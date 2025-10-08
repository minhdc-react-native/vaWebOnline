import { useNavigate } from "react-router-dom"
import { AppCard } from "./app-card"
import { AppHeader } from "../app-header"
import { toAbsoluteUrl } from '@/lib/helpers';
import { useEffect, useState } from "react";
import { api } from "@/api/apiMethods";
import { useAuth } from "@/auth/context/auth-context";

export function AppListPage() {
    const navigate = useNavigate();
    const { setCurrentApp } = useAuth();
    const [apps, setApps] = useState<IData[]>([]);

    useEffect(() => {
        api.post({
            link: `/api/System/Command`,
            data: {
                parameter: {}, command: "G_APP_ICON"
            },
            callBack: (res) => setApps(res.data || [])
        });
    }, []);
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-5xl">
                            {apps.map(app => (
                                <AppCard
                                    key={app.id}
                                    name={app.NAME}
                                    color={app.BACKGROUND_COLOR}
                                    icon={app.ICON_CSS}
                                    onClick={() => {
                                        setCurrentApp(app);
                                        navigate(`/app`);
                                    }}
                                />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
