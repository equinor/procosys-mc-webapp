import { Person } from '../services/apiTypes';
import useCommonHooks from '../utils/useCommonHooks';
import axios from 'axios';

export interface IHttpRequestMessage {
    baseUrl: string | undefined;
    path: string | undefined;
    headers: ['Content-Type', 'application/json'] | undefined;
    method: string | undefined;
    body: string | undefined;
    urlsearchparams: URLSearchParams | undefined;
}
export interface IHttpResponseMessage {
    baseUrl: string | undefined;
    path: string | undefined;
    headers: Record<string, string> | undefined;
    contentType: string | undefined;
    content: string | undefined;
}

export class HttpResponseMessage implements IHttpResponseMessage {
    baseUrl: string | undefined;
    path: string | undefined;
    headers: Record<string, string> | undefined;
    contentType: string | undefined;
    content: string | undefined;
}

export interface IHttpMessage<ApiType> {
    request: IHttpRequestMessage | undefined;
    response: IHttpResponseMessage | undefined;
    data: Array<ApiType>;
    executedDate: Date | undefined;
    executedBy: Person | undefined;

    executeRequestMessage(): Promise<IHttpMessage<ApiType>>;
    getHash(): string;
    getData(): Array<ApiType>;
}

export class HttpRequestMessage implements IHttpRequestMessage {
    baseUrl: string | undefined;
    path: string | undefined;
    headers: ['Content-Type', 'application/json'] | undefined;
    method: string | undefined;
    body: string | undefined;
    urlsearchparams: URLSearchParams | undefined;
}

export class HttpMessage<ApiType> implements IHttpMessage<ApiType> {
    request: HttpRequestMessage | undefined;
    response: HttpResponseMessage | undefined;
    data: ApiType[];
    executedDate: Date | undefined;
    executedBy: Person | undefined;

    constructor() {
        this.data = new Array<ApiType>();
        this.request = new HttpRequestMessage();
        this.response = new HttpResponseMessage();
    }

    async executeRequestMessage(): Promise<IHttpMessage<ApiType>> {
        const user = await this.getUser();
        const accessToken = await this.getAccessToken();

        /* HERE WE NEED TO EITHER CHANGE THE API OR MAKE A NEW CONCEPTS Due to no access to AxiosConfiguration (Or request and response data)
        1. Suggestion, we can reuse and add more functionality to the existing one 
        2. New super clever way of doing an api class definition (Will break scope))
        */

        throw new Error('Method not implemented.');
    }
    getHash(): string {
        if (this.executedDate !== undefined) {
            return 'I have a valid request';
        }
        throw new Error('Error');
    }
    getData(): ApiType[] {
        throw new Error('Method not implemented.');
    }

    async getUser(): Promise<string | undefined> {
        const { auth, api, procosysApiSettings, params } = useCommonHooks();
        return await auth.getUserName();
    }

    async getAccessToken(): Promise<string | null> {
        const { auth, api, procosysApiSettings, params } = useCommonHooks();
        const scope = procosysApiSettings.scope;
        const accessToken = await auth.getAccessToken(scope);
        const { token, cancel } = axios.CancelToken.source();
        const tagResponse = await api.getTag(params.plant, 12, token);
        return accessToken ? accessToken : null;
    }
}

export interface IHttpClient<T> {
    sendMessage(message: IHttpRequestMessage): Promise<IHttpResponseMessage>;
}
