import { IGroupSchema } from "@/uiEngine/interface";

export const loginSchema: IGroupSchema = {
    type: "group",
    layout: "flex",
    children: [
        {
            type: "alert",
            close: false,
            icon: { name: "alert-circle", className: 'text-primary' },
            titleContent: `Use <strong>demo@kt.com</strong> username and 
              <strong>demo123</strong> password for demo access.`
        },
        {
            type: "alert",
            bind: 'errAlert',
            variant: "destructive",
            handleClose: 'closeAlert',
            conditions: {
                visible: "!!errAlert"
            }
        },
        {
            type: "field",
            name: 'username',
            label: 'User name',
            placeholder: 'Input username',
            iconLeft: "log-in",
            rules: { required: true }
        },
        {
            type: "field",
            name: 'password',
            fieldType: "password",
            label: 'Password',
            iconLeft: "key",
            rules: { required: true }
        },
        {
            type: "select",
            name: 'orgUnit',
            label: 'Org unit',
            placeholder: 'Input orgUnit',
            cleanable: true,
            iconLeft: "database",
            columns: [
                { id: 'id', label: 'Mã', width: 150 },
                { id: 'value', label: 'Tên công ty', width: 400 }
            ],
            display: { fDisplay: 'id' },
            rules: { required: true }
        },
        {
            type: "group",
            layout: "grid",
            columns: 2,
            children: [
                {
                    type: "field",
                    fieldType: "checkbox",
                    name: 'remember',
                    label: 'Remember me'
                },
                { type: "button", variant: "destructive", appearance: "ghost", label: "Forgot password?", handleClick: 'forgotPassword' }
            ]
        },
        { type: "button", variant: "primary", label: "Sign in", labelLoading: "Loading...", buttonType: "submit", handleProcessing: 'processing' },
    ],
    dataSource: {
        orgUnit: { url: '/api/System/GetDvcsByUser?username=#USER_NAME#', mapKey: { '#USER_NAME#': 'username' } }
    }
}