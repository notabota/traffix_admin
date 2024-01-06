import React from "react";
import {IResourceComponentsProps} from "@refinedev/core";

import {Create, useForm, useSelect} from "@refinedev/antd";

import {Form, Input, InputNumber} from "antd";

import MDEditor from "@uiw/react-md-editor";

import {ICamera} from "../../interfaces";

export const PostCreate: React.FC<IResourceComponentsProps> = () => {
    const {formProps, saveButtonProps} = useForm<ICamera>();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
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
                    label="Description"
                    name="description"
                >
                    <MDEditor data-color-mode="light"/>
                </Form.Item>
            </Form>
        </Create>
    );
};
