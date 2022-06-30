// import { IHttpResponseMessage } from './Http';
import { Person } from '../services/apiTypes';
import { StrategyTypes } from './Strategy';
import { useCommonHooks } from '../../src/utils/useCommonHooks';

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
    }

    executeRequestMessage(): Promise<IHttpMessage<ApiType>> {
        
        
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

    async getAccessToken(): Promise<string> {
        const { auth, api, offlineState, setOfflineState } = useCommonHooks();
        const authConfiguration = await this.auth.getAuthConfig();
        const accessToken = await auth.getAccessToken(
            authConfiguration.configurationScope
        );

        const tags = await api.getTag();

        return accessToken ? accessToken : null;
    }
}

export interface IHttpClient<T> {
    sendMessage(message: IHttpRequestMessage): Promise<IHttpResponseMessage>;
}
