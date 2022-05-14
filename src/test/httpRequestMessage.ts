/* eslint-disable prettier/prettier */
import axios from 'axios';
import { AxiosResponse } from 'axios';

/**
 * Common interface from both IHttpRequestMessage and IHttpResponseMessage
 */
interface IHttpCommon {
    content: ArrayBuffer;
    headers: Record<string, string>;
}

/**
 * IHttpRequestMessage interface
 */
interface IHttpRequestMessage extends IHttpCommon {
    getHashCode(): number;
    status: number;
}

/**
 * IHttpResponseMessage interface
 */
interface IHttpResponseMessage extends IHttpCommon {
    request: IHttpRequestMessage | undefined;
}

export class HttpResponseMessage<T> implements IHttpResponseMessage {
    status: number;
    content: ArrayBuffer;
    request: IHttpRequestMessage | undefined;
    headers: Record<string, string>;
    /**
     *
     */
    constructor(axiosResponse: AxiosResponse<T>) {
        this.content = new ArrayBuffer(0);
        this.status = axiosResponse.status;
        const stringData = JSON.stringify(axiosResponse.data);
        this.str2ab(stringData);
        this.request = undefined;
        this.headers = axiosResponse.headers;
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
