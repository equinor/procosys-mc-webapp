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
    config?: HttpRequestMessageConfig<T> | undefined;

    constructor(config: HttpRequestMessageConfig<T>, strategy: IStrategy<T>) {
        this.config = config;
        this.strategy = strategy;
    }
    GetBodyData<T>(): TypeCandidates | undefined {
        if (this.config?.method == 'post') {
            const result = (this.strategy as ProcessBodyStrategy<T>).process(
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
                this?.config?.params
            );

            return result;
        }
    }

    GetStrategy<T>(): IStrategy<T> {
        if (this.strategy === undefined) throw Error('strategy is undefined');
        return this.strategy;
    }
}
