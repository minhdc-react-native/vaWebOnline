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
            type: "field",
            fieldType: "date",
            name: 'voucherDate',
            label: 'Ngày',
            placeholder: 'Ngày tháng',
            rules: { required: true }
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