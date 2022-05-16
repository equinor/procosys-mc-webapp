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


describe('Reconstruct an AxiosRequestConfig<T> object from ')

describe('HttpReqestMessage should generate a hash by the HttpRequest parameters and URL path', () => {

    const parameterBuilder = new URLSearchParams();
    parameterBuilder.set('parameter1', 'value1');
    parameterBuilder.set('parameter2', 'value2');
    parameterBuilder.set('parameter3', 'value3');

    const content = new ArrayBuffer(0);
    const headers: Record<string, string> = {
        headers1: '12',
        headers2: '22',
        headers3: '36',
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
