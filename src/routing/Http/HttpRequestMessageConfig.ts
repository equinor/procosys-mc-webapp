import { AxiosRequestConfig, Method } from 'axios';

export class HttpRequestMessageConfig<T> {
    method?: Method;
    url?: string;
    baseURL?: string;
    data?: T;
    params?: Map<string, string>;
    headers: Record<string, string> | undefined;
    responseType?: string;

    constructor(axiosConfig: AxiosRequestConfig<T>) {
        this.method = axiosConfig.method;
        this.url = axiosConfig.url;
        this.baseURL = axiosConfig.baseURL;
        this.data = axiosConfig.data;
        this.responseType = axiosConfig.responseType;
    }
}
