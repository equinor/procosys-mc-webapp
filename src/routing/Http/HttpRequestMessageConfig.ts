import { AxiosRequestConfig, Method } from 'axios';

export class HttpRequestMessageConfig<D = any> {
    method?: string;
    url?: string | undefined;
    baseURL?: string | undefined;
    data?: D;
    params?: Map<string, string>;
    headers: Record<string, string> = {};
    responseType?: string;

    constructor(axiosConfig: AxiosRequestConfig<D>) {
        this.method = axiosConfig.method;
        this.url = axiosConfig.url;
        this.baseURL = axiosConfig.baseURL;

        const headers = new Map<string, string>();
        axiosConfig.headers.