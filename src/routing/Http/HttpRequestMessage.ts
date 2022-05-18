import { TypeCandidates } from '../../test/types';
import { HashGenerator } from '../hash';
import { HttpRequestMessageConfig } from './HttpRequestMessageConfig';
import ProcessBodyStrategy from './Strategies/ProcessBodyStrategy';
import { QueryParamsStrategy } from './Strategies/QueryParamsStrategy';
import { QueryParamsToOneSingleLineStrategy } from './Strategies/QueryParamsToOneSingleLineStrategy';
import { HashHttpRequest } from './Utils/HashHttpRequest';

export interface IHttpRequestMessage<T> {
    GetHashCode(request: IHttpRequestMessage<T>): number;
    GetPath(): string;
    GetHttpRequestParameters(): Map<string, string> | undefined;
    GetBodyData(): TypeCandidates | undefined;
}

export class HttpRequestMessage<T> implements IHttpRequestMessage<T> {
    config?: HttpRequestMessageConfig<T>;
    processBodyStrategy: ProcessBodyStrategy<T>;
    queryParamsStrategy: QueryParamsStrategy<T>;
    queryParamsToOneSingleLineStrategy: QueryParamsToOneSingleLineStrategy<T>;

    constructor(
        config: HttpRequestMessageConfig<T>,
        processBodyStrategy: ProcessBodyStrategy<T>,
        queryParamsStrategy: QueryParamsStrategy<T>,
        queryParamsToOneSingleLineStrategy: QueryParamsToOneSingleLineStrategy<T>
    ) {
        this.config = config;
        this.processBodyStrategy = processBodyStrategy;
        this.queryParamsStrategy = queryParamsStrategy;
        this.queryParamsToOneSingleLineStrategy =
            queryParamsToOneSingleLineStrategy;
    }

    GetBodyData<T>(): TypeCandidates {
        throw Error('Not implemented');
    }

    GetHashCode<T>(request: IHttpRequestMessage<T>): number {
        if (this.config !== undefined) {
            const hash = HashHttpRequest<T>(
                request,
                HashGenerator,
                new QueryParamsToOneSingleLineStrategy<T>(),
                this.config
            );
        }

        return hash;
    }

    GetPath(): string | undefined {
        return this.config?.url;
    }

    GetHttpRequestParameters<T>(): Map<string, string> {
        throw Error('Not implemented');
    }
}
