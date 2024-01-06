import {
    AuthBindings,
    Authenticated,
    GitHubBanner,
    Refine,
} from "@refinedev/core";
import {
    useNotificationProvider,
    ThemedLayoutV2,
    ErrorComponent,
    RefineThemes, ThemedTitleV2,
} from "@refinedev/antd";
import dataProvider, {GraphQLClient} from "@refinedev/graphql";
import routerProvider, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
    DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom";

import {ConfigProvider, App as AntdApp} from "antd";
import "@refinedev/antd/dist/reset.css";

import {Login} from "./pages/login";
import {PostList, PostCreate, PostEdit, PostShow} from "./pages/cameras";

// const API_URL = "https://api.strapi.refine.dev/graphql";

const client = new GraphQLClient(import.meta.env.VITE_GRAPHQL_HOST);
const gqlDataProvider = dataProvider(client);

const authProvider: AuthBindings = {
    login: async ({username, password}) => {
        try {
            const {data} = await gqlDataProvider.custom!({
                url: "",
                method: "post",
                meta: {
                    operation: "login",
                    variables: {
                        input: {
                            value: {
                                username,
                                password
                            },
                            type: "CredentialInput",
                            required: true,
                        },
                    },
                    fields: ["jwt"],
                },
            });

            localStorage.setItem("token", data.jwt);
            client.setHeader("Authorization", `Bearer ${data.jwt}`);

            return {
                success: true,
                redirectTo: "/admin",
            };
        } catch (error: any) {
            return {
                success: false,
                error: new Error(error),
            };
        }
    },
    logout: async () => {
        localStorage.removeItem("token");
        client.setHeader("Authorization", "");
        return {
            success: true,
            redirectTo: "/admin/login",
        };
    },
    onError: async (error) => {
        console.error(error);
        return {error};
    },
    check: async () => {
        const jwt = localStorage.getItem("token");

        if (!jwt) {
            return {
                authenticated: false,
                error: {
                    message: "Check failed",
                    name: "Token not found",
                },
                redirectTo: "/admin/login",
            };
        }

        client.setHeader("Authorization", `Bearer ${jwt}`);

        return {
            authenticated: true,
        };
    },
    getPermissions: async () => {
        try {
            const {data} = await gqlDataProvider.custom!({
                url: "",
                method: "get",
                meta: {
                    operation: "me",
                    fields: [
                        {
                            role: ["name", "description"],
                        },
                    ],
                },
            });
            const {role} = data;

            return role;
        } catch (error) {
            return null;
        }
    },
    getIdentity: async () => {
        try {
            const {data} = await gqlDataProvider.custom!({
                url: "",
                method: "get",
                meta: {
                    operation: "me",
                    fields: ["id", "username", "email"],
                },
            });
            const {id, username, email} = data;
            return {
                id,
                username,
                email,
            };
        } catch (error) {
            return error;
        }
    },
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <ConfigProvider theme={RefineThemes.Blue}>
                <AntdApp>
                    <Refine
                        dataProvider={gqlDataProvider}
                        authProvider={authProvider}
                        routerProvider={routerProvider}
                        resources={[
                            {
                                name: "cameras",
                                list: "/admin/cameras",
                                create: "/admin/cameras/create",
                                edit: "/admin/cameras/edit/:id",
                                show: "/admin/cameras/show/:id",
                                meta: {
                                    canDelete: true,
                                },
                            },
                        ]}
                        notificationProvider={useNotificationProvider}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                        }}
                    >
                        <Routes>
                            <Route
                                element={
                                    <Authenticated
                                        key="authenticated-routes"
                                        fallback={
                                            <CatchAllNavigate to="/admin/login"/>
                                        }
                                    >
                                        <ThemedLayoutV2 Title={({collapsed}) => (
                                            <ThemedTitleV2
                                                collapsed={collapsed}
                                                icon={collapsed ? <p> Aye </p> : null}
                                                text="Traffix Admin"
                                            />
                                        )}>
                                            <Outlet/>
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route
                                    path="/admin"
                                    element={
                                        <NavigateToResource resource="cameras"/>
                                    }
                                />

                                <Route path="/admin/cameras">
                                    <Route index element={<PostList/>}/>
                                    <Route
                                        path="create"
                                        element={<PostCreate/>}
                                    />
                                    <Route
                                        path="edit/:id"
                                        element={<PostEdit/>}
                                    />
                                    <Route
                                        path="show/:id"
                                        element={<PostShow/>}
                                    />
                                </Route>
                            </Route>

                            <Route
                                element={
                                    <Authenticated
                                        key="auth-pages"
                                        fallback={<Outlet/>}
                                    >
                                        <NavigateToResource resource="cameras"/>
                                    </Authenticated>
                                }
                            >
                                <Route path="/admin/login" element={<Login/>}/>
                            </Route>

                            <Route
                                element={
                                    <Authenticated key="catch-all">
                                        <ThemedLayoutV2>
                                            <Outlet/>
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route path="/admin/*" element={<ErrorComponent/>}/>
                            </Route>
                        </Routes>
                        <UnsavedChangesNotifier/>
                        <DocumentTitleHandler/>
                    </Refine>
                </AntdApp>
            </ConfigProvider>
        </BrowserRouter>
    );
};

export default App;
