import { AxiosResponse } from 'axios';
import { IHttpRequestMessage } from './HttpRequestMessage';
import { HttpRequestMessageConfig } from './HttpRequestMessageConfig';

export class HttpResponseMessage<T, S> {
    status: number;
    content: ArrayBuffer;
    request: HttpRequestMessageConfig<T> | undefined;
    headers: Record<string, string>;
    responseType: ResponseType;
    data?: T | undefined;

    constructor() {
        this.status = 0;
        this.content = new ArrayBuffer(0);
        this.request = undefined;
        this.headers = {};
        this.responseType = 'basic';
    }

    buildResponse(): Response {
        return new Response(this.content, {
            status: this.status,
            statusText: '',
            headers: this.headers,
        });
    }


    fromAxios(axiosResponse: AxiosResponse<T, S>): void {
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
}
