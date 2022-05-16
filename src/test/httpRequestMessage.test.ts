import { baseURL } from './setupServer';
import { describe, it } from '@jest/globals';
import axios, { AxiosRequestConfig } from 'axios';
import { Person } from '../services/apiTypes';
import { MapAxiosRequestToHttpRequestMessage } from './mapAxiosToHttpRequestMessage';
import { HttpRequestMessage } from './httpRequestResponseMessage';
import { PropertyAccSortingStrategy } from './IPropertyStrategy';

export class Tag {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}

describe('HttpReqestMessage should generate a hash by the HttpRequest parameters and URL path', () => {

    const parameterBuilder = new URLSearchParams();
    parameterBuilder.set('test1', 'value1');
    parameterBuilder.set('test2', 'value2');
    parameterBuilder.set('test3', 'value3');

    const content = new ArrayBuffer(0);
    const headers: Record<string, string> = {
        miffy1: '12',
        miffy2: '22',
        miffy3: '36',
    };

    const config: AxiosRequestConfig<Person> = {
        url: '/person/100',
        baseURL: 'http://localhost:8080/api/',
        headers: headers,
        method: 'get',
        params: parameterBuilder,
        responseType: 'json'
    };

    beforeEach(() => {
       
    });

    it('Should get relative path', () => {
        const copyPropertiesFromAxios = new MapAxiosRequestToHttpRequestMessage<Person>();
        copyPropertiesFromAxios.map<Person>(config);
        expect(copyPropertiesFromAxios.url).toBe('/person/100');
        const httpRequestMessage = new HttpRequestMessage<Person>(copyPropertiesFromAxios, new PropertyAccSortingStrategy<Person>());
        expect(httpRequestMessage.url).toBe('/person/100');

    });

    it('Should get all arguments from http request ', () => {
        const copyPropertiesFromAxios = new MapAxiosRequestToHttpRequestMessage<Person>();
        copyPropertiesFromAxios.map<Person>(config);
        expect(copyPropertiesFromAxios.url).toBe('/person/100');
        const httpRequestMessage = new HttpRequestMessage<Person>(copyPropertiesFromAxios, new PropertyAccSortingStrategy<Person>());
        const hashcode = httpRequestMessage.GetHashCode<Person>(httpRequestMessage);

        expect(hashcode).toBeDefined();
        expect(hashcode).toBeGreaterThan(5);
    });
});
