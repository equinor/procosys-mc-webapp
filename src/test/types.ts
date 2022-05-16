import { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

export interface ProxyConfig {
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol?: string;
}

export type HttpHeaders = Record<string, string> | undefined;

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

export type Method =
    | 'get'
    | 'GET'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH'
    | 'purge'
    | 'PURGE'
    | 'link'
    | 'LINK'
    | 'unlink'
    | 'UNLINK';
/**
 * @Summmary: Meta-data programming for transforming a type heavily depending axios type to pure TS
 */
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

export type MyPick<T, K extends keyof T> = { [P in K]: T[P]; };
/** @Summary: Less dependency on axios */
export type HttpRequestMessageConfig<T> = MyPick<AxiosRequestConfig<T>, 'method' | 'url' | 'baseURL' | 'data' | 'params' | 'headers' | 'responseType'>;
export type ReplaceAxisHeaders<T> = Omit<T, 'headers'> & { headers: Record<string,string> | undefined };
export type ReplaceAxiosParams<T> = Omit<T, 'params'> & { params: URLSearchParams | undefined };
/** @Summary: Reverse back to Axios types */
export type HttpResponseMessageConfigRaw<T> = MyPick<AxiosRequestConfig<T>, 'method' | 'url' | 'baseURL' | 'data' | 'params' | 'headers' | 'responseType'>;
export type ReplaceReverseAxisHeaders<T> = Omit<T, 'headers'> & { headers?: AxiosRequestHeaders | undefined };
export type ReplaceReverseAxiosParams<T> = Omit<T, 'params'> & { params?: any | undefined };