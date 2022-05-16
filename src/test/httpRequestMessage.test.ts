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

describe('HttpReqestMessage', () => {
    it('Should get all arguments from http request ', () => {
        const content = new ArrayBuffer(0);
        const headers: Record<string, string> = {
            miffy1: '12',
            miffy2: '22',
            miffy3: '36',
        };

        const parameterBuilder = new URLSearchParams();
        parameterBuilder.set('test1', 'value1');
        parameterBuilder.set('test2', 'value2');
        parameterBuilder.set('test3', 'value3');

        const parametersIterator = parameterBuilder;

        const config: AxiosRequestConfig<Person> = {
            url: 'http://localhost:8080/api/person',
            baseURL: 'www.vg.no',
            headers: {},
            data: {
                id: 12,
                azureOid: '',
                username: '',
                firstName: '',
                lastName: '',
                email: '',
            },
            method: 'get',
            params: parameterBuilder,
            responseType: 'json'    
            };
            
        

        const mapperFromAxiosToHttpMessagePropertiesAndValues = new MapAxiosRequestToHttpRequestMessage<Person>();
        mapperFromAxiosToHttpMessagePropertiesAndValues.map<Person>(config);

        const httpRequestMessage = new HttpRequestMessage<Person>(mapperFromAxiosToHttpMessagePropertiesAndValues, new PropertyAccSortingStrategy<Person>() );
        const hashcode =
            httpRequestMessage.GetHashCode<Person>(httpRequestMessage);
        expect(hashcode).toBeDefined();
        expect(hashcode).toBeGreaterThan(5);
    });
});
