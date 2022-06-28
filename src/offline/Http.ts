import { Person } from '../services/apiTypes';
import { StrategyTypes } from './Strategy';

export interface IHttpRequestMessage {
    baseUrl: string;
    path: string;
    headers: ['Content-Type', 'application/json'];
    method: string;
    body: string;
    urlsearchparams: URLSearchParams;
}
export interface IHttpResponseMessage {
    baseUrl: string;
    path: string;
    headers: Record<string, string>;
    contentType: string;
    content: string;
}

export interface IHttpMessage<ApiType> {
    readonly client: IHttpClient<ApiType>;
    request: IHttpRequestMessage;
    response: IHttpResponseMessage;
    data: Array<ApiType>;
    executedDate: Date;
    executedBy: Person;

    executeRequestMessage(): Promise<IHttpMessage<ApiType>>;
    getHash(): string;
    getData(): Array<ApiType>;
}

export interface IHttpClient<T> {
    sendMessage(message: IHttpRequestMessage): Promise<IHttpResponseMessage>;
}
