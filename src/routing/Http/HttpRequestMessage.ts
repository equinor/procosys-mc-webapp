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
