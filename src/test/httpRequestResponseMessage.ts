/* eslint-disable prettier/prettier */
//import { Query } from '@testing-library/react';
import { AxiosResponse } from 'axios';
import { HashGenerator, HashHttpRequest } from '../routing/hash';
import { IPropertyStrategy } from './IPropertyStrategy';
import { HttpRequestMessageConfig } from './HttpRequestMessageConfig';
import { ResponseType, HttpHeaders } from './types';

/**
 * Common interface from both IHttpRequestMessage and IHttpResponseMessage
 */
// interface IHttpCommon<T> {

//     data?: T;
//     headers: HttpHeaders,
//     httpAgent?: any;
//     httpsAgent?: any;
//     xsrfCookieName?: string;
//     xsrfHeaderName?: string;
// }

// export class HttpCommon<T> implements IHttpCommon<T> {
//     data?: T;
//     headers: HttpHeaders;
//     httpAgent?: any;
//     httpsAgent?: any;
//     xsrfCookieName?: string | undefined;
//     xsrfHeaderName?: string | undefined;

//     constructor(config: AxiosToHttpRequestMessageConfig<T>) {
//         this.data = config.data;
//         this.headers = config.headers;
//         this.httpAgent = config.httpAgent;
//         this.httpsAgent = config.httpsAgent;
//         this.xsrfCookieName = config.xsrfCookieName;
//         this.xsrfHeaderName = config.xsrfHeaderName;
//     }
// }


/**
 * IHttpRequestMessage interface
 */
//export interface IHttpRequestMessage<T> extends HttpCommon<T> {
export interface IHttpRequestMessage<T> {
    //url?: string | undefined;
    GetHashCode(request: IHttpRequestMessage<T>): number;
    GetPath(): string;
    GetHttpRequestParameters<T>(): Map<string, string>;
    GetStrategy<T>(): IPropertyStrategy<T>;
}

export class HttpRequestMessage<T> implements IHttpRequestMessage<T> {
    strategy: IPropertyStrategy<T> | undefined
    config: HttpRequestMessageConfig<T> | undefined;

    constructor(config: HttpRequestMessageConfig<T>, strategy: IPropertyStrategy<T>) {
        this.config = config;
        this.strategy = strategy;
    }

    GetHashCode<T>(request: IHttpRequestMessage<T>): number {
        if (this.strategy === undefined) throw Error("strategy is undefined");
        const hash = HashHttpRequest<T>(request, HashGenerator, this.strategy);
        return hash;
    }

    GetPath(): string {
        if(this.config === undefined || this.config.url === undefined ) 
            throw Error("config is undefined");
        return this.config.url;
    }

    GetHttpRequestParameters<T>(): Map<string, string> {
        if (this.strategy === undefined) throw Error("strategy is undefined");
        if (this.config === undefined) throw Error("Configuration object is missing. Should be set in constructor");
        const parameters = this.strategy.DoSomethingWithTheParameters(this.config.params);
        return parameters;
    }

    GetStrategy<T>(): IPropertyStrategy<T> {
        if (this.strategy === undefined) throw Error("strategy is undefined");
        return this.strategy;
    }
}

/**
 * IHttpResponseMessage interface
 */
// export interface IHttpResponseMessage<T, S> extends IHttpCommon<T> {
//     request: IHttpRequestMessage<T> | undefined;
//     responseType: ResponseType;

// }

export class HttpResponseMessage<T, S> {
    status: number;
    content: ArrayBuffer;
    request: IHttpRequestMessage<T> | undefined;
    headers: Record<string, string>;
    responseType: ResponseType;
    data?: T | undefined;

    constructor(axiosResponse: AxiosResponse<T, S>) {
        this.content = new ArrayBuffer(0);
        this.status = axiosResponse.status;
        const stringData = JSON.stringify(axiosResponse.data);
        this.str2ab(stringData);
        this.request = undefined;
        this.headers = axiosResponse.headers;
        this.responseType = axiosResponse.request.responseType;
    }

    str2ab(str: string): void {
        this.content = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        const bufView = new Uint16Array(this.content);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
    }
    /**
     *
     * @returns a string representation of the ArrayBuffer
     */
    // ab2str() {
    // return String.fromCharCode.apply(null, new Uint16Array(this.content));
}
