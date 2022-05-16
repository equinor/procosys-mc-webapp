import { HttpHeaders } from './types';
/* eslint-disable prettier/prettier */

import { ProxyConfig } from './types';
import { AxiosRequestConfig } from 'axios';


import * as axios from 'axios';
import {
    HttpRequestMessage,
    IHttpRequestMessage,
    IHttpResponseMessage,
} from './httpRequestResponseMessage';

export interface IMapAxiosToHttpRequestMessage<T> {    
    url?: string;
    method?: string;
    baseURL?: string;
    // transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
    // transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
    //headers?: AxiosRequestHeaders;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: T;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    // adapter?: AxiosAdapter;
    // auth?: AxiosBasicCredentials;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: ((status: number) => boolean) | null;
    maxBodyLength?: number;
    maxRedirects?: number;
    socketPath?: string | null;
    proxy?: ProxyConfig | false;
    // cancelToken?: CancelToken;
    // decompress?: boolean;
    //transitional?: TransitionalOptions;
    //signal?: AbortSignal;
    //insecureHTTPParser?: boolean;
    
    headers: HttpHeaders;
    httpAgent?: any;
    httpsAgent?: any;
    xsrfCookieName?: string | undefined;
    xsrfHeaderName?: string | undefined;

    map(axiosRequestConfig: AxiosRequestConfig<any>): void;
    
}

/**
 *  Mapper object for mapping between Axiox and IHttpRequestMessage
 */
export class MapAxiosRequestToHttpRequestMessage<T> implements IMapAxiosToHttpRequestMessage<T>
{
    responseType?: ResponseType | undefined;
    headers: HttpHeaders | undefined;
    httpAgent?: any;
    httpsAgent?: any;
    xsrfCookieName?: string | undefined;
    xsrfHeaderName?: string | undefined;
    // `url` is the server URL that will be used for the request
    url?: string;

    //method: 'get', // default
    method?: string | undefined;
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL?: string | undefined;
    /**
     *  `params` are the URL parameters to be sent with the request
        Must be a plain object or a URLSearchParams object
        NOTE: params that are null or undefined are not rendered in the URL.
     */
    params?: Map<string, string>;
    paramsSerializer?: ((params: any) => string) | undefined;
    
    /** `data` is the data to be sent as the request body
    Only applicable for request methods 'PUT', 'POST', 'DELETE', and 'PATCH' */
    data?: T | undefined;
    
    timeout?: number | undefined;
    timeoutErrorMessage?: string | undefined;
    withCredentials?: boolean | undefined;
    onUploadProgress?: ((progressEvent: any) => void) | undefined;
    onDownloadProgress?: ((progressEvent: any) => void) | undefined;
    maxContentLength?: number | undefined;
    validateStatus?: ((status: number) => boolean) | null | undefined;
    maxBodyLength?: number | undefined;
    maxRedirects?: number | undefined;
    socketPath?: string | null | undefined;
    proxy?: false | ProxyConfig | undefined;


    map<T>(axiosRequestConfig: AxiosRequestConfig<any>): void{

        if(axiosRequestConfig.url === undefined)
            throw new Error("missing required parameter: + 'url");


        //this.status = axiosRequestConfig.isVerified
        this.url = axiosRequestConfig.url;
        this.baseURL = axiosRequestConfig.baseURL;
        this.method = axiosRequestConfig.method;
        this.baseURL = axiosRequestConfig.baseURL;
        this.params = new Map<string, string>();

        // `params` are the URL parameters to be sent with the request
        // Must be a plain object or a URLSearchParams object
        // NOTE: params that are null or undefined are not rendered in the URL.
        const parameters : URLSearchParams  = axiosRequestConfig.params;
        const i : IterableIterator<[string, string]> = parameters.entries();

        for (const [key, value] of parameters) {

            this.params.set(key, value);
        }

        this.paramsSerializer = axiosRequestConfig.paramsSerializer;
        
        this.data = axiosRequestConfig.data;
        
        this.headers = {"Content-Type": "application/json"};
        if(axiosRequestConfig.headers !== undefined) {
            this.headers = axiosRequestConfig.headers;
        }
        
        this.timeout = axiosRequestConfig.timeout;
        this.timeoutErrorMessage = axiosRequestConfig.timeoutErrorMessage;
        this.withCredentials = axiosRequestConfig.withCredentials;
        this.onUploadProgress = axiosRequestConfig.onUploadProgress;
        this.onDownloadProgress = axiosRequestConfig.onDownloadProgress;
        this.maxContentLength = axiosRequestConfig.maxContentLength;
        this.validateStatus = axiosRequestConfig.validateStatus;
        this.maxBodyLength = axiosRequestConfig.maxBodyLength;
        this.maxRedirects = axiosRequestConfig.maxRedirects;
        this.socketPath = axiosRequestConfig.socketPath;
        this.proxy = axiosRequestConfig.proxy;

            
        // this.cancelToken = axiosRequestConfig.cancelToken;
        // this.decompress = axiosRequestConfig.decompress;
        // this.transitional = axiosRequestConfig.transitional;
        // this.signal = axiosRequestConfig.signal;
        // this.insecureHTTPParser = axiosRequestConfig.insecureHTTPParser;
    };
}