import {
    HashConfigurationByPath,
    HashParameterConfiguration,
} from '../routing/hash';
import { HttpRequestMessageConfig } from '../routing/Http/HttpRequestMessageConfig';

import { Person } from '../services/apiTypes';
import { pathUrl, baseUrl } from './axios.requests';
import { parameterBuilder } from './httpRequestMessage.testdata';

const config = new HttpRequestMessageConfig<Person>({
    method: 'get',
    url: pathUrl,
    baseURL: baseUrl,
    data: {
        id: 100,
        azureOid: '12',
        username: '12',
        firstName: '12',
        lastName: '12',
        email: '12',
    },
    params: parameterBuilder,
    headers: {
        'Content-Type': 'application/json',
    },
    responseType: 'json',
});



describe('HttpRequestMessage should generate a hash by the HttpRequest parameters and URL path', () => {
    it('Should get relative path', () => {
        const url = HashConfigurationByPath(pathUrl);
        expect(url).toBe(pathUrl);
    });

    it('Test mee please', () => {
        const url = HashConfigurationByPath(config.url);
        expect(url).toBe(pathUrl);
    });

    it('Should read the configuration Map<string, string>', () => {
        const parameters = HashParameterConfiguration(config.params);
        expect(parameters).toBe(config.params);
    });
});
