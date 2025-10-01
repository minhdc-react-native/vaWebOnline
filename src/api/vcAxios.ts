import axios from 'axios';
import { getData, removeData, KEY_STORAGE } from '@/lib/storage';
import { getSupabaseUrl } from '@/lib/helpers';

const vcAxios = axios.create();

export const attachInterceptors = (showSessionExpiredDialog: () => void) => {
    vcAxios.interceptors.request.use(async (config) => {

        const token = await getData(KEY_STORAGE.TOKEN);
        const year = await getData(KEY_STORAGE.YEAR_SELECTED);
        const dvcs = await getData(KEY_STORAGE.ORG_UNIT);
        const baseUrl = getSupabaseUrl();
        if (baseUrl) {
            config.baseURL = baseUrl;
        } else {
            config.baseURL = 'https://demoketoan.vaonline.vn';
        }
        const remember = await getData(KEY_STORAGE.INFO_LOGIN);

        if (token) {
            config.headers.Authorization = `Bearer ${token};${dvcs ?? ''};${year ?? ''};${remember?.lang ?? 'vi'}`;
        }
        // config.headers['X-Rquested-With'] = "XMLHttpRequest";
        config.headers["Accept-language"] = remember?.lang ?? 'vi';
        // config.headers["X-Orgcode"] = await getOrgUnit();
        // config.headers["__tenant"] = await getTenant();
        return config;
    });

    vcAxios.interceptors.response.use(
        (response) => {
            const responseType = response.config?.responseType;
            if (responseType === 'arraybuffer' || responseType === 'blob' || responseType === 'text') {
                return response;
            }
            if (!response.data) {
                return null;
            }
            return response.data || response;
        },
        async (error) => {
            console.log("error>>", error);
            if (error.response?.status === 401) {
                await removeData(KEY_STORAGE.TOKEN);
                showSessionExpiredDialog();
            }
            return Promise.reject(error);
        }
    );
};

export default vcAxios;
