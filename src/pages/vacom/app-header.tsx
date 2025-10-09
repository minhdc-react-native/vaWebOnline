import { api } from '@/api/apiMethods';
import { useAuth } from '@/auth/context/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toAbsoluteUrl } from '@/lib/helpers';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import { useEffect } from 'react';
import { useApiQuery } from '@/api/useApi';
interface IProgs {
    hiddenUser?: boolean
}
export function AppHeader({ hiddenUser }: IProgs) {
    const { currentYear, setCurrentYear, listCurrentYear, user, infoDvcs, setInfoDvcs } = useAuth();
    const { data, isSuccess } = useApiQuery<IData[]>(['infoDvcs'], {
        link: `/api/System/GetInfoDvcs`
    })
    useEffect(() => {
        if (isSuccess && data && data.length > 0) {
            setInfoDvcs(data[0]);
        }
    }, [isSuccess, data, setInfoDvcs]);

    return (
        <header className="w-full flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
                <img
                    src={toAbsoluteUrl("/media/app/LogoVacom.png")}
                    alt="Logo"
                    className="h-10"
                />
                <Select onValueChange={setCurrentYear} value={currentYear || undefined}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                        {listCurrentYear.map((item) => (
                            <SelectItem
                                key={item.NAM}
                                value={item.NAM}
                                className="flex items-center gap-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span>{item.NAM}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {!hiddenUser && <UserDropdownMenu
                    trigger={
                        <div className="flex items-center gap-2 hover:cursor-pointer">
                            <img
                                className="size-9 rounded-full border-2 border-green-500"
                                src={toAbsoluteUrl('/media/avatars/300-2.png')}
                                alt="User avatar"
                            />
                            {/* <div className="flex flex-col">
                                {user?.username}
                            </div> */}
                            {/* <DynamicIcon name={"chevron-down"} /> */}
                        </div>
                    }
                />}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <span className="text-shadow-md">
                            {`${infoDvcs?.DVCS_ID} - ${infoDvcs?.TEN_DVCS}`}
                        </span>
                        <span className="text-sm text-gray-600">
                            {`Mã số thuế: ${infoDvcs?.MS_THUE}`}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">

            </div>
        </header>
    );
}