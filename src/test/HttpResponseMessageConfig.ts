import { HttpRequestMessageConfig, Method } from './types';

export class HttpResponseMessageConfig<T>
{
    method?: Method;
    url?: string;
    baseURL?: string;
    data?: T;
    params?: any;
    headers : Record<string,string> | undefined;
    responseType?: string;
    
    constructor(config: HttpRequestMessageConfig<T>) {
        this.method = config.method;
        this.url = config.url;
        this.baseURL = config.baseURL;
        this.data = config.data;
        this.headers = config.headers;
        this.responseType = config.responseType;
    } 
};