export const useCellEditStop = (tab: IData) => {
    const cellEditStop = (item: IData, columnId: string, value: any) => {
        const change: Record<string, any> = {};
        switch (columnId) {
            case 'SO_LUONG':
                change.TIEN2 = item.GIA2 * value;
                break;
            default:
                break;
        }
        return change;
    }
    return {
        cellEditStop
    }
}