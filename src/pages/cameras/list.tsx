import {IResourceComponentsProps, useExport} from "@refinedev/core";

import {
    List,
    useTable,
    EditButton,
    ShowButton,
    DeleteButton,
    getDefaultSortOrder,
    FilterDropdown,
    useSelect,
    ExportButton,
    ImportButton,
    CreateButton,
    useImport, RefreshButton,
} from "@refinedev/antd";

import {Table, Space, Select} from "antd";

import {IRecord, ICamera} from "../../interfaces";

export const PostList: React.FC<IResourceComponentsProps> = () => {
    const {tableQueryResult, tableProps, sorters} = useTable<ICamera>({
        sorters: {
            initial: [
                {
                    field: "id",
                    order: "desc",
                },
            ],
        },
        queryOptions: {
            refetchInterval: 1000,
        },
        meta: {
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

    const {triggerExport, isLoading: exportLoading} = useExport<ICamera>({
        mapData: (item) => {
            return {
                id: item.id,
                name: item.name,
                lat: item.lat,
                lng: item.lng,
                counting_state: item.counting_state,
                url: item.url,
                type: item.type,
                description: item.description,
            };
        },
        meta: {
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
        maxItemCount: tableQueryResult.data?.data.length,
    });

    const importProps = useImport<ICamera>({
        mapData: (item) => {
            return {
                name: item.name,
                lat: Number(item.lat),
                lng: Number(item.lng),
                counting_state: item.counting_state,
                url: item.url,
                type: item.type,
                description: item.description,
            };
        },
        paparseOptions: {
            skipEmptyLines: true,
        },
        batchSize: 100,
        onFinish: (result) => {
            // success requests response
            result.succeeded.forEach((item) => {
                console.log(item);
            });

            // failed requests response
            result.errored.forEach((item) => {
                console.log(item);
            });
        },
    });

    return (
        <List
            headerProps={{
                extra: (
                    <Space>
                        <ImportButton {...importProps} />
                        <ExportButton
                            onClick={triggerExport}
                            loading={exportLoading}
                        />
                        <CreateButton/>
                    </Space>
                ),
            }}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    key="id"
                    dataIndex="id"
                    title="ID"
                    sorter={{multiple: 2}}
                    defaultSortOrder={getDefaultSortOrder("id", sorters)}
                />
                <Table.Column
                    key="counting_state"
                    dataIndex="counting_state"
                    title="Counting State"
                    sorter={{multiple: 1}}
                    render={(value: boolean, record: ICamera) => {
                        if (value)
                            return <p> True </p>
                        else
                            return <p> False </p>
                    }}
                />
                <Table.Column
                    key="name"
                    dataIndex="name"
                    title="Name"
                    sorter
                />
                <Table.Column
                    key="lat"
                    dataIndex="lat"
                    title="Lat"
                    sorter
                />
                <Table.Column
                    key="lng"
                    dataIndex="lng"
                    title="Lng"
                    sorter
                />
                <Table.Column
                    key="type"
                    dataIndex="type"
                    title="Type"
                    sorter={{multiple: 1}}
                />
                <Table.Column
                    key="url"
                    dataIndex="url"
                    title="URL"
                    sorter
                />
                <Table.Column
                    key="description"
                    dataIndex="description"
                    title="Description"
                    sorter
                />
                <Table.Column<ICamera>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <DeleteButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
