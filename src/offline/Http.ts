import { Person } from '../services/apiTypes';

export interface IHttpRequestMessage {
    baseUrl: string;
    path: string;
    headers: ['Content-Type', 'application/json'];
    method: string;
    body: string;
}
export interface IHttpResponseMessage {
    baseUrl: string;
    path: string;
    headers: string[];
    contentType: string;
    content: string;
}

export interface IHttpMessage<T> {
    readonly client: IHttpClient<T>;
    request: IHttpRequestMessage;
    response: IHttpResponseMessage;
    data: Array<T>;
    executedDate: Date;
    executedBy: Person;

    executeRequestMessage(): Promise<IHttpMessage<T>>;
    getHash(): string;
    getData(): Array<T>;
}

export interface IHttpClient<T> {
    sendMessage(message: IHttpRequestMessage): Promise<IHttpResponseMessage>;
}
