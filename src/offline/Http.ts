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

export interface IHttpMessage<StrategyTypes> {
    readonly client: IHttpClient<StrategyTypes>;
    request: IHttpRequestMessage;
    response: IHttpResponseMessage;
    data: Array<StrategyTypes>;
    executedDate: Date;
    executedBy: Person;

    executeRequestMessage(): Promise<IHttpMessage<StrategyTypes>>;
    getHash(): string;
    getData(): Array<StrategyTypes>;
}

export interface IHttpClient<T> {
    sendMessage(message: IHttpRequestMessage): Promise<IHttpResponseMessage>;
}
