import { HttpRequestMessage } from '../routing/Http/HttpRequestMessage';
import { QueryParamsStrategyWitAscendingSorting } from '../routing/Http/Strategies/QueryParamsStrategyWitAscendingSorting';
import { config, httpPostRequestWithbody } from './httpRequestMessage.testdata';
import ProcessBodyStrategy from '../routing/Http/Strategies/ProcessBodyStrategy';
import { QueryParamsStrategy } from '../routing/Http/Strategies/QueryParamsStrategy';
import { Person } from '../services/apiTypes';
import { HttpRequestMessageConfig } from '../routing/Http/HttpRequestMessageConfig';
import { QueryParamsToOneSingleLineStrategy } from '../routing/Http/Strategies/QueryParamsToOneSingleLineStrategy';

describe('HttpRequestMessage should generate a hash by the HttpRequest parameters and URL path', () => {
    const queryParamsStrategyWitAscendingSorting =
        new QueryParamsStrategyWitAscendingSorting<Person>();
    const queryParamsStrategy = new QueryParamsStrategy<Person>();
    const processBodyStrategy = new ProcessBodyStrategy<Person>();
    const queryParamsToOneSingleLineStrategy =
        new QueryParamsToOneSingleLineStrategy<Person>();

    it('Should get relative path', () => {
        const httpRequestMessageConfig = new HttpRequestMessageConfig<Person>(
            config
        );
        const httpRequestMessage = new HttpRequestMessage<Person>(
            httpRequestMessageConfig,
            processBodyStrategy,
            queryParamsStrategyWitAscendingSorting,
            queryParamsToOneSingleLineStrategy
        );
        expect(httpRequestMessage?.config?.url).toBe('/person/100');
    });

    it('Should get all query-parameters from a http request ', () => {
        const httpRequestMessageConfig = new HttpRequestMessageConfig<Person>(
            config
        );
        const httpRequestMessage = new HttpRequestMessage<Person>(
            httpRequestMessageConfig,
            processBodyStrategy,
            queryParamsStrategyWitAscendingSorting,
            queryParamsToOneSingleLineStrategy
        );

        const hash = httpRequestMessage.GetHashCode<Person>(httpRequestMessage);

        expect(hash).toBeDefined();
        expect(hash).toBeGreaterThan(5);

        const parameters = httpRequestMessage.GetHttpRequestParameters();
        expect(parameters).toBeGreaterThan(5);
    });

    it('Should get all query content from body from a http request ', () => {
        const httpRequestMessageConfig = new HttpRequestMessageConfig<Person>(
            httpPostRequestWithbody
        );
        const httpRequestMessage = new HttpRequestMessage<Person>(
            httpRequestMessageConfig,
            queryParamsStrategy,
            processBodyStrategy,
            queryParamsToOneSingleLineStrategy
        );
        const hashcode =
            httpRequestMessage.GetHashCode<Person>(httpRequestMessage);
        expect(hashcode).toBeDefined();
        expect(hashcode).toBeGreaterThan(5);
    });
});
