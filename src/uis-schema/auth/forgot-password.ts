import { IGroupSchema } from "@/uiEngine/interface";

export const forgotPassword: IGroupSchema = {
    type: "group",
    layout: "flex",
    children: [
        {
            type: "alert",
            close: false,
            icon: { name: "alert-circle", className: 'text-primary' },
            titleContent: `Bạn phải nhập đúng địa chỉ email khi đăng ký! <br/>Ví dụ: <strong>support@vacom.com.vn</strong>`
        },
        {
            type: "field",
            name: 'email',
            label: 'Email',
            placeholder: 'nhập hòm thư',
            iconLeft: "mail",
            rules: { required: true, email: true }
        },
        {
            type: "group",
            layout: "flex",
            direction: "row",
            children: [
                {
                    type: "fieldset",
                    // collapsible: true,
                    className: "flex-1",
                    title: "Thông tin",
                    children: {
                        type: "group",
                        layout: "flex",
                        direction: "row",
                        children: [
                            {
                                type: "field",
                                fieldType: "input",
                                name: 'fullName',
                                label: 'Họ và Tên',
                                placeholder: 'Nhập & tên',
                                rules: { required: true },
                                span: 1
                            },
                            {
                                type: "field",
                                fieldType: "date",
                                name: 'voucherDate',
                                label: 'Ngày',
                                placeholder: 'Ngày tháng',
                                rules: { required: true },
                                span: 1
                            }
                        ]
                    },
                },
                {
                    type: "fieldset",
                    // collapsible: true,
                    width: 200,
                    title: "Khác",
                    children: {
                        type: "group",
                        layout: "flex",
                        direction: "row",
                        children: [
                            {
                                type: "number",
                                name: 'total',
                                label: 'Tổng cộng',
                                placeholder: 'Nhập số...',
                                iconLeft: "sigma",
                                decimalScale: 2,
                                rules: { required: true },
                                span: 1
                            }
                        ]
                    },
                },
            ]
        },
        {
            type: "group",
            layout: "grid",
            columns: 4,
            children: [
                { type: "empty", span: 2 },
                { type: "button", span: 1, variant: "secondary", appearance: "ghost", label: "Huỷ bỏ", hotkey: "F9", handleClick: 'closeDialog' },
                { type: "button", span: 1, variant: "primary", label: "Xác nhận", hotkey: "F10", buttonType: "submit", handleClick: 'submitAlert' },
            ]
        },
    ]
}