import { AxiosRequestConfig } from 'axios';
import { Person } from '../services/apiTypes';
import {
    config,
    headers,
    parameterBuilder,
} from './httpRequestMessage.testdata';
import {
    getProperty,
    HttpRequestMessageConfig,
    RecordKVStrings,
    ReplaceAxiosParams,
    ReplaceAxisHeaders,
} from './types';

describe("Transform a type's properties with other types", () => {
    it('should discover that headers have change type', () => {
        const transformed: ReplaceAxisHeaders<
            HttpRequestMessageConfig<Person>
        > = {
            headers: getProperty(config, 'headers'),
        };
        expect(transformed.headers).toBe(headers);
    });

    it('should discover that param have change type', () => {
        const transformed: ReplaceAxiosParams<
            HttpRequestMessageConfig<Person>
        > = {
            params: getProperty(config, 'params'),
        };
        expect(transformed.params).toBe(parameterBuilder);
    });
});
