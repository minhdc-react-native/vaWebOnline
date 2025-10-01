import { IGroupSchema } from "@/uiEngine/interface";

export const schemaForgotPassword: IGroupSchema = {
    type: "group",
    layout: "flex",
    children: [
        {
            type: "field",
            span: 2,
            fieldType: "input",
            name: 'email',
            label: 'Input email',
            labelPosition: "left",
            iconLeft: "mail",
            rules: { required: true, email: true }
        },
        {
            type: "group",
            layout: "grid",
            columns: 4,
            children: [
                { type: "empty", span: 2 },
                { type: "button", variant: "secondary", label: "Huỷ bỏ", onClick: 'closeDialog' },
                { type: "button", variant: "primary", label: "Xác nhận", buttonType: "submit" }
            ]
        }
    ]
}