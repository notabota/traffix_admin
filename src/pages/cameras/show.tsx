import {useShow, IResourceComponentsProps} from "@refinedev/core";

import {Show, MarkdownField, RefreshButton} from "@refinedev/antd";

import {Typography} from "antd";

import {ICamera} from "../../interfaces";

const {Title, Text} = Typography;

export const PostShow: React.FC<IResourceComponentsProps> = () => {
    const {queryResult} = useShow<ICamera>({
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
    const {data, isLoading} = queryResult;
    const record = data?.data;

    return (
        <Show
            isLoading={isLoading}
            headerProps={{
                extra: <RefreshButton onClick={() => queryResult.refetch()}/>,
            }}
        >
            <Title level={5}>Id</Title>
            <Text>{record?.id}</Text>

            <Title level={5}>Name</Title>
            <Text>{record?.name}</Text>

            <Title level={5}>Lat - Lng</Title>
            <Text>{record?.lat} - {record?.lng}</Text>

            <Title level={5}>URL</Title>
            <Text>{record?.url}</Text>

            <Title level={5}>Type</Title>
            <Text>{record?.type}</Text>

            <Title level={5}>Counting State</Title>
            {record?.counting_state ? <p> True </p> : <p> False </p>}
            <Title level={5}>Description</Title>
            <MarkdownField value={record?.description}/>
        </Show>
    );
};
