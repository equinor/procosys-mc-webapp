import { AxiosRequestConfig, Method } from 'axios';

export class HttpRequestMessageConfig<T> {
    method?: Method | undefined;
    url?: string | undefined;
    baseURL?: string | undefined;
    data?: T | undefined;
    params?: Map<string, string> | undefined;
    headers: Record<string, string> | undefined;
    responseType?: string | undefined;

    constructor(axiosConfig: AxiosRequestConfig<T>) {
        this.method = axiosConfig.method;
        this.url = axiosConfig.url;
        this.baseURL = axiosConfig.baseURL;
        this.data = axiosConfig.data;
        this.headers = axiosConfig.headers;
        this.responseType = axiosConfig.responseType;
    }
}
