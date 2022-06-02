import { request, RequestOptions, OutgoingHttpHeaders} from 'http';
import { TypeCandidates } from '../../test/types';
import { HashGenerator } from '../hash';
import { HttpRequestMessageConfig } from './HttpRequestMessageConfig';
import ProcessBodyStrategy from './Strategies/ProcessBodyStrategy';
import { QueryParamsStrategy } from './Strategies/QueryParamsStrategy';
import { QueryParamsToOneSingleLineStrategy } from './Strategies/QueryParamsToOneSingleLineStrategy';

export interface IHttpRequestMessage<T> {
    GetHashCode(): number;
    GetPath(): string;
    GetHttpRequestParameters(): Map<string, string>;
    GetBodyData(): T;
}

export class HttpRequestMessage<T> implements IHttpRequestMessage<T> {
    config?: HttpRequestMessageConfig<T>;
    processBodyStrategy: ProcessBodyStrategy<T>;
    queryParamsStrategy: QueryParamsStrategy<T>;
    queryParamsToOneSingleLineStrategy: QueryParamsToOneSingleLineStrategy<T>;

    constructor(
        config: HttpRequestMessageConfig<T> | undefined,
        processBodyStrategy: ProcessBodyStrategy<T>,
        queryParamsStrategy: QueryParamsStrategy<T>,
        queryParamsToOneSingleLineStrategy: QueryParamsToOneSingleLineStrategy<T>
    ) {
        const postData = JSON.stringify({ msg: 'Hello World!' });
        const option: RequestOptions = {
            host: 'http://www.api.no',
            path: '/api/v1/test',
            method: 'GET',   
            port: 80,
            path: '/type?id=100',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };
        
 

        if (config === undefined) throw Error();
        this.config = config;
        this.processBodyStrategy = processBodyStrategy;
        this.queryParamsStrategy = queryParamsStrategy;
        this.queryParamsToOneSingleLineStrategy =
            queryParamsToOneSingleLineStrategy;
    }

    GetConfigObject(): HttpRequestMessageConfig<T> {
        if (this.config === undefined) throw Error();
        return this.config;
    }

    GetBodyData<T>(): T {
        throw Error('Not implemented');
    }

    GetHashCode<T>(): number {
        return 1;
    }

    GetPath(): string {
        throw Error('Not implemented');
    }

    GetHttpRequestParameters<T>(): Map<string, string> {
        throw Error('Not implemented');
    }
}
