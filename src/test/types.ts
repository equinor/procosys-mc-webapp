import { AxiosRequestConfig } from "axios";

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
export type HttpServiceMessageRawConfig<T> = MyPick<AxiosRequestConfig<T>,
    'method' | 'url' | 'baseURL' | 'data' | 'params' | 'headers' | 'responseType'>;
export type ReplaceAxisHeaders<T> = Omit<T, 'headers'> & { headers: Record<string,string> | undefined };
export type ReplaceAxiosParams<T> = Omit<T, 'params'> & { params: URLSearchParams | undefined };