import React from "react";
import {HttpError, IResourceComponentsProps} from "@refinedev/core";

import {
    Edit,
    ListButton,
    RefreshButton,
    useForm,
    useSelect,
} from "@refinedev/antd";

import {Form, Input, InputNumber, Select, Space, Switch} from "antd";

import MDEditor from "@uiw/react-md-editor";

import {ICamera, IRecord} from "../../interfaces";

export const PostEdit: React.FC<IResourceComponentsProps> = () => {
    const {formProps, saveButtonProps, queryResult} = useForm<
        ICamera,
        HttpError,
        ICamera
    >({
        metaData: {
            fields: [
                "id",
                "name",
                "lat",
                "lng",
                "counting_state",
                "url",
                "type",
                "description",
            ],
        },
    });

    return (
        <Edit
            saveButtonProps={saveButtonProps}
            headerProps={{
                extra: (
                    <Space>
                        <ListButton/>
                        <RefreshButton onClick={() => queryResult?.refetch()}/>
                    </Space>
                ),
            }}
        >
            <Form
                {...formProps}
                layout="vertical"
                onFinish={(values) =>
                    formProps.onFinish?.({
                        ...values,
                        record: values.record?.id,
                    } as any)
                }
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Lat"
                    name="lat"
                >
                    <InputNumber
                        style={{width: 200}}
                    />
                </Form.Item>
                <Form.Item
                    label="Lng"
                    name="lng"
                >
                    <InputNumber
                        style={{width: 200}}
                    />
                </Form.Item>
                <Form.Item
                    label="Counting State"
                    name="counting_state"
                >
                    <Switch/>
                </Form.Item>
                <Form.Item
                    label="Type"
                    name="type"
                >
                    <Select
                        options={[
                            {
                                label: "mobile",
                                value: "mobile",
                            },
                            {
                                label: "static",
                                value: "static",
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="URL"
                    name="url"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <MDEditor data-color-mode="light"/>
                </Form.Item>
            </Form>
        </Edit>
    );
};
