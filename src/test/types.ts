import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export interface ProxyConfig {
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol?: string;
}

export type HttpHeaders = RecordKVStrings | undefined;

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

export interface IMyMap {
    map: Map<string, string>;
}

export type KEY = string | number | symbol;

export interface IMyRecord {
    record: Record<KEY, any>;
}

export interface IMyString {
    string: string;
}
export type TypeCandidates =
    | Map<string, string>
    | Record<string, string>
    | string
    | undefined;

export type MAP = Map<string, string>;
export type MapKVString = Map<string, string> | undefined;
export type RecordKVStrings = Record<string, string> | undefined;

/**
 * @Summmary: Meta-data programming for transforming a type heavily depending axios type to pure TS
 */
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

export type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
/** @Summary: Less dependency on axios */
export type HttpRequestMessageConfig<T> = MyPick<
    AxiosRequestConfig<T>,
    | 'method'
    | 'url'
    | 'baseURL'
    | 'data'
    | 'params'
    | 'headers'
    | 'responseType'
>;

/** @Summary: Reverse back to Axios types */
export type HttpResponseMessageConfigRaw<T> = MyPick<
    AxiosRequestConfig<T>,
    | 'method'
    | 'url'
    | 'baseURL'
    | 'data'
    | 'params'
    | 'headers'
    | 'responseType'
>;

export type ReplaceAxisHeaders<T> = Omit<T, 'headers'> & {
    headers: RecordKVStrings | undefined;
};
export type ReplaceAxiosParams<T> = Omit<T, 'params'> & {
    params: URLSearchParams | undefined;
};

export type ReplaceReverseAxisHeaders<T> = Omit<T, 'headers'> & {
    headers?: AxiosRequestHeaders | undefined;
};
export type ReplaceReverseAxiosParams<T> = Omit<T, 'params'> & {
    params?: any | undefined;
};
