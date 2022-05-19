import { HttpRequestMessageConfig } from '../routing/Http/HttpRequestMessageConfig';
import { Person } from '../services/apiTypes';
import {
    configWithTypePerson as ConfigWithTypePerson,
    headers,
    parameterBuilder,
} from './httpRequestMessage.testdata';
import { getProperty } from './types';

describe('Property and Value copy with Pick<> feature', () => {
    const config = ConfigWithTypePerson;
    const headers = getProperty(config, 'headers');
    
    

    const clone: HttpRequestMessageConfig<Person> = {
        method: getProperty(config, 'method'),
        url: getProperty(config, 'url'),
        baseURL: getProperty(config, 'baseURL'),
        data: getProperty(config, 'data'),
        params: getProperty(config, 'params'),
        headers: getProperty(config, 'headers'),
        responseType: getProperty(config, 'responseType'),
    };

    it('should copy the url', () => {
        expect(clone.url).toBe('/person/100');
    });

    it('should copy the method', () => {
        expect(clone.method).toBe('get');
    });

    it('should copy the baseURL', () => {
        expect(clone.baseURL).toBe('http://localhost');
    });

    it('should copy the data property and value', () => {
        expect(clone.data?.id).toBe(100);
    });

    it('should copy the params property and value', () => {
        expect(Array.from(clone.params).length).toBe(
            Array.from(parameterBuilder).length
        );
    });

    it('should have a header collection with the same length as source data', () => {
        expect(clone.headers?.length).toBe(headers.length);
    });
});
