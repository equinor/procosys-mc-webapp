import { TypeCandidates } from '../../test/types';
import { HashGenerator } from '../hash';
import { HashHttpRequest } from './Utils/HashHttpRequest';
import { HttpRequestMessageConfig } from './HttpRequestMessageConfig';
import { IStrategy } from './Strategies/IStrategy';
import ProcessBodyStrategy from './Strategies/ProcessBodyStrategy';
import { QueryParamsStrategy } from './Strategies/QueryParamsStrategy';

export interface IHttpRequestMessage<T> {
    GetHashCode(request: IHttpRequestMessage<T>): number;
    GetPath(): string | undefined;
    GetHttpRequestParameters(): Map<string, string> | undefined;
    GetStrategy<T>(): IStrategy<T>;
    GetBodyData(): TypeCandidates | undefined;
}

export class HttpRequestMessage<T> implements IHttpRequestMessage<T> {
    strategy?: IStrategy<T> | undefined;
    processBodyStrategy: ProcessBodyStrategy<T>;
    queryParamsStrategy: QueryParamsStrategy<T>;
    config?: HttpRequestMessageConfig<T> | undefined;

    constructor(
        config: HttpRequestMessageConfig<T>,
        processBodyStrategy: IStrategy<T>,
        queryParamsStrategy: IStrategy<T>
    ) {
        this.config = config;
        this.processBodyStrategy = processBodyStrategy;
        this.queryParamsStrategy = queryParamsStrategy;
    }

    GetBodyData<T>(): TypeCandidates | undefined {
        if (this.config?.method == 'post') {    //Move safety into strategy
            const result = this.processBodyStrategy.process(
                this?.config?.params
            );
            return result;
        }
    }

    GetHashCode<T>(request: IHttpRequestMessage<T>): number {
        if (this.strategy === undefined) throw Error('strategy is undefined');
        const hash = HashHttpRequest<T>(
            request,
            HashGenerator,
            this.strategy,
            this?.config?.params
        );
        return hash;
    }

    GetPath(): string | undefined {
        return this.config?.url;
    }

    GetHttpRequestParameters<T>(): Map<string, string> | undefined {
        if (this.strategy !== undefined) {
            const result = (this.strategy as QueryParamsStrategy<T>).process(
                this.config.params
            );

            return result;
        }
    }

    GetStrategy<T>(): IStrategy<T> {
        if (this.strategy === undefined) throw Error('strategy is undefined');
        return this.strategy;
    }
}
