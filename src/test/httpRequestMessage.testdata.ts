import { AxiosRequestConfig as AxiosRequestQueryParamsConfig } from 'axios';
import { Person } from '../services/apiTypes';

export const parameterBuilder = new URLSearchParams();
parameterBuilder.set('parameter1', 'value1');
parameterBuilder.set('parameter2', 'value2');
parameterBuilder.set('parameter3', 'value3');

export const headers: Record<string, string> = {
    headers1: '12',
    headers2: '22',
    headers3: '36',
    'Content-Type': 'application/json',
};

const httpRequestQueryParamsConfig: AxiosRequestQueryParamsConfig<Person> = {
    url: '/person/100',
    method: 'post',
    baseURL: 'http://localhost',
    data: {
        id: 100,
        azureOid: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
    },
    params: parameterBuilder,
    headers: headers,
};

export const config: AxiosRequestQueryParamsConfig = {
    url: '/person/100',
    method: 'get',
    baseURL: 'http://localhost:8080/api/',
    params: parameterBuilder,
    headers: headers,
    responseType: 'json',
};

export const httpPostRequestWithbody: AxiosRequestQueryParamsConfig = {
    url: '/person/100',
    method: 'post',
    baseURL: 'http://localhost:8080/api/',
    data: { data: [1, 2, 3, 4, 5] },
    responseType: 'json',
    headers: headers,
};

export const configWithTypePerson: AxiosRequestQueryParamsConfig<Person> = {
    url: '/person/100',
    method: 'get',
    baseURL: 'http://localhost',
    data: {
        id: 100,
        azureOid: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
    },
    params: parameterBuilder,
    headers: headers,
};
