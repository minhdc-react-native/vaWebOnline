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
            name: 'email',
            label: 'email',
            placeholder: 'Input email',
            iconLeft: "mail",
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
    ]
}