import {
    HashCodeByHashConfiguration,
    HashConfigByPayload as GetPayloadConfiguration,
    HashConfigurationByPath as GetUrlConfiguration,
    HashParameterConfiguration as GetParametersConfiguration,
    SortedMapAscending,
    ToString,
} from '../routing/hash';
import { HttpRequestMessageConfig } from '../routing/Http/HttpRequestMessageConfig';

import { Person } from '../services/apiTypes';
import { pathUrl, baseUrl } from './axios.requests';
import { parameterBuilder } from './httpRequestMessage.testdata';

const config1 = new HttpRequestMessageConfig<Person>({
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
    params: {
        ID0: 1,
        ID1: 12,
        ID3: 123,
    },
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    responseType: 'json',
});

describe('HttpRequestMessage should generate a hash by the HttpRequest parameters and URL path', () => {
    it('Should get relative path', () => {
        const url = GetUrlConfiguration(pathUrl);
        expect(url).toBe(pathUrl);
    });

    it('Test mee please', () => {
        const url = GetUrlConfiguration(config1.url);
        expect(url).toBe(pathUrl);
    });

    it('Should read the configuration Map<string, string>', () => {
        const parameters = GetParametersConfiguration(config1.params);
        expect(parameters).toBe('ID0=1&ID1=12&ID3=123&');
    });

    it('Parameters should be sorted in ascending order', () => {
        const result = SortedMapAscending(config1.params);
        const sorted = ToString(result);
        expect(sorted).toBe('ID0=1&ID1=12&ID3=123&');
    });

    it('Should read the configuration Data : T', () => {
        const payload = GetPayloadConfiguration(config1.data);
        expect(payload).toBe(
            '{"id":100,"azureOid":"12","username":"12","firstName":"12","lastName":"12","email":"12"}'
        );
    });
});
