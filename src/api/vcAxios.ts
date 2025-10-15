import axios from 'axios';
import { getData, removeData, KEY_STORAGE } from '@/lib/storage';
import { getSupabaseUrl } from '@/lib/helpers';

const vcAxios = axios.create();

vcAxios.interceptors.request.use((config) => {
    return Promise.resolve().then(async () => {
        const [token, year, dvcs, lang] = await Promise.all([
            getData(KEY_STORAGE.TOKEN),
            getData(KEY_STORAGE.YEAR_SELECTED),
            getData(KEY_STORAGE.ORG_UNIT),
            getData(KEY_STORAGE.LANG_SELECTED),
        ]);
        config.baseURL = getSupabaseUrl() || 'https://hoclaptrinh.vaonline.vn';
        config.headers = config.headers || {};

        if (token) {
            config.headers.Authorization = `Bearer ${token};${dvcs ?? ''};${year ?? ''};${lang ?? 'vi'}`;
        }
        config.headers["Accept-language"] = lang ?? 'vi';
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
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
            // console.log('Request cancelled:', link);
            return;
        }
        // console.log("error>>", error);
        if (error.response?.status === 401) {
            await removeData(KEY_STORAGE.TOKEN);
        }
        return Promise.reject(error);
    }
);

export default vcAxios;
