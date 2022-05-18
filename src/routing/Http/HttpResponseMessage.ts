import { AxiosResponse } from 'axios';
import { ResponseType } from '../../test/types';
import { IHttpRequestMessage } from './HttpRequestMessage';

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
}
