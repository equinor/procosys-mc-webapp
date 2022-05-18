import { describe, it } from '@jest/globals';
import { Person } from '../services/apiTypes';
import { HttpRequestMessageConfig } from '../routing/Http/HttpRequestMessageConfig';
import {
    HttpRequestMessage,
} from '../routing/Http/HttpRequestMessage';
import { QueryParamsStrategyWitAscendingSorting } from '../routing/Http/Strategies/QueryParamsStrategyWitAscendingSorting';
import { config, httpPostRequestWithbody } from './httpRequestMessage.testdata';
import ProcessBodyStrategy from '../routing/Http/Strategies/ProcessBodyStrategy';

describe('HttpRequestMessage should generate a hash by the HttpRequest parameters and URL path', () => {
    it('Should get relative path', () => {
        const httpRequestMessageConfig = new HttpRequestMessageConfig<Person>(
            config
        );
        const strategy = new QueryParamsStrategyWitAscendingSorting<Person>();
        const httpRequestMessage = new HttpRequestMessage<Person>(
            httpRequestMessageConfig,
            strategy
        );
        expect(httpRequestMessage?.config?.url).toBe('/person/100');
    });

    it('Should get all query-parameters from a http request ', () => {
        const httpRequestMessageConfig = new HttpRequestMessageConfig<Person>(
            config
        );
        const strategy = new QueryParamsStrategyWitAscendingSorting<Person>();
        const httpRequestMessage = new HttpRequestMessage<Person>(
            httpRequestMessageConfig,
            strategy
        );

        const hash = httpRequestMessage.GetHashCode(httpRequestMessage);

        expect(hash).toBeDefined();
        expect(hash).toBeGreaterThan(5);

        const parameters = httpRequestMessage.GetHttpRequestParameters();
        expect(parameters).toBeGreaterThan(5);
    });

    it('Should get all query content from body from a http request ', () => {
        const httpRequestMessageConfig = new HttpRequestMessageConfig<Person>(
            httpPostRequestWithbody
        );
        const strategy = new ProcessBodyStrategy<Person>();
        const httpRequestMessage = new HttpRequestMessage<Person>(
            httpRequestMessageConfig,
            strategy
        );
        const hashcode =
            httpRequestMessage.GetHashCode<Person>(httpRequestMessage);
        expect(hashcode).toBeDefined();
        expect(hashcode).toBeGreaterThan(5);
    });
});
