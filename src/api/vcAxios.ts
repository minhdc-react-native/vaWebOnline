import axios from 'axios';
import { getData, removeData, KEY_STORAGE } from '@/lib/storage';
import { getSupabaseUrl } from '@/lib/helpers';

const vcAxios = axios.create();

vcAxios.interceptors.request.use((config) => {
    return Promise.resolve().then(async () => {
        const [token, year, dvcs, remember] = await Promise.all([
            getData(KEY_STORAGE.TOKEN),
            getData(KEY_STORAGE.YEAR_SELECTED),
            getData(KEY_STORAGE.ORG_UNIT),
            getData(KEY_STORAGE.INFO_LOGIN),
        ]);

        config.baseURL = getSupabaseUrl() || 'https://demoketoan.vaonline.vn';
        config.headers = config.headers || {};

        if (token) {
            config.headers.Authorization = `Bearer ${token};${dvcs ?? ''};${year ?? ''};${remember?.lang ?? 'vi'}`;
        }
        config.headers["Accept-language"] = remember?.lang ?? 'vi';

        return config;
    });
});

vcAxios.interceptors.response.use(
    (response) => {
        const type = response.config?.responseType;
        if (['arraybuffer', 'blob', 'text'].includes(type || '')) return response;
        return response.data ?? response;
    },
    async (error) => {
        console.log("error>>", error);
        if (error.response?.status === 401) {
            await removeData(KEY_STORAGE.TOKEN);
        }
        return Promise.reject(error);
    }
);

export default vcAxios;
