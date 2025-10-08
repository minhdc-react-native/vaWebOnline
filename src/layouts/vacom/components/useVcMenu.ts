interface UseMenuReturn {
    isActive: (code: string | undefined) => boolean;
    hasActiveChild: (submenu: IData[] | undefined) => boolean;
}

export const useVcMenu = (pathname: string): UseMenuReturn => {
    const isActive = (code: string | undefined): boolean => {
        if (code && code === '/') {
            return code === pathname;
        } else {
            return !!code && pathname.startsWith(code);
        }
    };

    const hasActiveChild = (submenu: IData[] | undefined): boolean => {
        if (!submenu || !Array.isArray(submenu)) return false;
        return submenu.some(
            (child: IData) => {
                const path = `/app/${child.code}/${child.window_id}`;
                return (child.code && isActive(path)) ||
                    (child.submenu && hasActiveChild(child.submenu))
            }
        );
    };
    return {
        isActive,
        hasActiveChild
    };
}