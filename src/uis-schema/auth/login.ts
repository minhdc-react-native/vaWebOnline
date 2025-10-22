import { IGroupSchema } from "@/uiEngine/interface";

export const loginSchema: IGroupSchema = {
    type: "group",
    layout: "flex",
    children: [
        // {
        //     type: "alert",
        //     close: false,
        //     icon: { name: "alert-circle", className: 'text-primary' },
        //     titleContent: 'Demo access'
        // },
        // {
        //     type: "alert",
        //     bind: 'errAlert',
        //     variant: "destructive",
        //     handleClose: 'closeAlert',
        //     conditions: {
        //         visible: "!!errAlert"
        //     }
        // },
        {
            type: "field",
            name: 'username',
            label: 'User name',
            iconLeft: "user-lock",
            rules: { required: true }
        },
        {
            type: "field",
            name: 'pass',
            fieldType: "password",
            label: 'Password',
            iconLeft: "key",
            rules: { required: true }
        },
        {
            type: "select",
            name: 'dvcs',
            label: 'Org unit',
            // cleanable: true,
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
                    label: 'Remember me',
                    isNotSpace: true
                },
                { type: "button", variant: "destructive", appearance: "ghost", hotkey: "F2", label: "Forgot password?", handleClick: 'forgotPassword' }
            ]
        },
        {
            type: "button", variant: "primary", label: "Sign in", hotkey: "F10",
            // labelLoading: "Loading...", 
            buttonType: "submit", isProcessing: true
        },
    ],
    dataSource: {
        dvcs: { url: '/api/System/GetDvcsByUser?username=#USER_NAME#', refId: '', mapKey: { '#USER_NAME#': 'username' }, typeEditor: "combo" }
    }
}