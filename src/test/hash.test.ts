import * as jestMockAxios from 'jest-mock-axios';
import { HashGenerator } from '../routing/hash';
import { describe, expect, it } from '@jest/globals';
import { mockedResponse, requestMockContent } from './axios.requests';
import { HttpRequestMessage, HttpResponseMessage } from './httpRequestResponseMessage';
import { Person } from '../services/apiTypes';
import { Any } from '@react-spring/types';
import { AxiosRequestConfig } from 'axios';

describe('hashGenerator2 testing', () => {
    it('should return a hash', () => {
        const hash = hashGenerator2('/test', ['n', 'm']);
        expect(hash).toBe(-2114169182);
    });

    it('should return a hash when args contains string of digits and values', () => {
        const hash = hashGenerator2('/test', ['n', '10', 'm', '20']);
        expect(hash).toBe(2132228991);
    });
});

describe('Performance testing', () => {
    it('should measure the time generating a number of hashes', () => {
        const startTime = performance.now();
        for (let i = 0; i < 1000; i++) {
            HashGenerator('/api/test', ['n', '10', 'm', '20']);
        }
        const endTime = performance.now();
        const consumedTime = endTime - startTime;
        expect(consumedTime).toBeLessThan(1000);
    });
});

describe('Hashgenerator3 - With propery name and values', () => {
    it('should have a map of properties with name and value', () => {
        const request = jestMockAxios.mockAxios.get.mockResolvedValueOnce(requestMockContent);
        const response = jestMockAxios.mockAxios.mockResponseFor(
            { url: '/api/person' },
            { data: '{test: 12, id = 12}'}
        );
        const config = (): AxiosRequestConfig<Person> => {

        };
        const httpRequestMessage = new HttpRequestMessage() {
            
        };
    });
});
