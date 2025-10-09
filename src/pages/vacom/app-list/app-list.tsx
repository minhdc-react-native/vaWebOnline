import { useNavigate } from "react-router-dom"
import { AppCard } from "./app-card"
import { AppHeader } from "../app-header"
import { toAbsoluteUrl } from '@/lib/helpers';
import { useAuth } from "@/auth/context/auth-context";
import { useApiQuery } from "@/api/useApi";
import { api } from "@/api/apiMethods";
import { useLanguage } from "@/providers/i18n-provider";

const getFirstMenu = (menu: IData[]) => {
    if (menu[0].submenu) return getFirstMenu(menu[0].submenu);
    return menu[0];
}
export function AppListPage() {
    const navigate = useNavigate();
    const { currenLanguage } = useLanguage();
    const { setCurrentApp, setLoading, setCurrentMenu } = useAuth();

    const { data: apps, isLoading, error } = useApiQuery<IData[]>(['apps'],
        {
            link: `/api/System/Command`,
            method: "post",
            data: {
                parameter: {}, command: "G_APP_ICON"
            },
            select: (response: IData[]) => {
                return response.map(item => ({
                    ...item,
                    NAME: currenLanguage.code === 'vi' ? item.NAME : (item.en_NAME || item.NAME),
                }));
            }
        }
    )

    // if (isLoading) return <p>Đang tải...</p>;
    // if (error) return <p>Lỗi: {(error as any).message}</p>;

    const handleClick = (app: IData) => {
        api.get({
            link: `/api/System/GetAppMenu?id=${app?.id}`,
            callBack: (res: IData[]) => {
                setCurrentApp(app);
                setCurrentMenu(res);
                const firstMenu = getFirstMenu(res);
                const path = `/app/${firstMenu.code}/${firstMenu.window_id}`
                navigate(path);
            },
            setLoading
        })
    }
    return (
        <>
            <style>
                {`
          .page-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-7.png')}');
          }
          .dark .page-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-10-dark.png')}');
          }
        `}
            </style>
            <div className="min-h-screen flex flex-col w-full">
                <AppHeader />
                <div className="grid lg:grid-cols-1 grow bg-no-repeat page-bg">
                    <main className="flex-1 flex flex-col items-center justify-start py-10">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-15 max-w-5xl">
                            {apps?.map(app => (
                                <AppCard
                                    key={app.id}
                                    name={app.NAME}
                                    color={app.BACKGROUND_COLOR}
                                    icon={app.ICON_CSS}
                                    onClick={() => handleClick(app)}
                                />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
