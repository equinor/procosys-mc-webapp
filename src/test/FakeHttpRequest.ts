import { faker } from '@faker-js/faker';
import { AxiosRequestConfig } from 'axios';
import { FakerAlphaCode, FakerPlant } from './fakes/faker';
import { HttpRequestMessageConfig, KeyValue } from './HttpRequest';

export const FakerParams = (): Map<string, string> => {
    // TODO: improve by using IDs that actually exists
    return new Map([[FakerAlphaCode(4), FakerAlphaCode(3)]]);
};

export const FakerParamsArray = (): KeyValue[] => {
    // TODO: improve by using IDs that actually exists
    return [{ key: FakerAlphaCode(2), value: FakerAlphaCode(5) }];
};

export const FakerHeaders = (): Record<string, string> => {
    // TODO: why can't I use faker stuff inside the record?
    const headers: Record<string, string> = {
        'FakerAlphaCode(2)': 'fr',
    };
    return headers;
};

export const FakerHeadersArray = (): Array<KeyValue> => {
    return [{ key: FakerAlphaCode(2), value: FakerAlphaCode(5) }];
};

// REQUEST MESSAGE CONFIG

// Making a generic faker function doesn't seem to be possible?
export const FakerHttpRequestMessageConfig = (): HttpRequestMessageConfig => {
    return {
        method: FakerAlphaCode(4),
        url: faker.internet.url(),
        baseURL: faker.internet.url(),
        //data: T,
        params: FakerParams(),
        paramsArray: FakerParamsArray(),
        headers: FakerHeaders(),
        headersArray: FakerHeadersArray(),
        responseType: FakerAlphaCode(4),
    };
};

// Without having used axiosConfig as input
export const FakerPlantHttpRequestMessageConfig =
    (): HttpRequestMessageConfig => {
        return {
            method: FakerAlphaCode(4),
            url: faker.internet.url(),
            baseURL: faker.internet.url(),
            data: FakerPlant(1),
            params: FakerParams(),
            paramsArray: FakerParamsArray(),
            headers: FakerHeaders(),
            headersArray: FakerHeadersArray(),
            responseType: FakerAlphaCode(4),
        };
    };

// Using axiosConfig as input. Need a fake AxiosRequestCongif too?
export const FakerPlantHttpRequestMessageConfigWithAxiosConfig = (
    axiosConfig: AxiosRequestConfig
): HttpRequestMessageConfig => {
    return {
        method: axiosConfig.method,
        url: axiosConfig.url,
        baseURL: axiosConfig.baseURL,
        data: FakerPlant(1),
        params: FakerParams(),
        paramsArray: FakerParamsArray(),
        headers: FakerHeaders(),
        headersArray: FakerHeadersArray(),
        responseType: FakerAlphaCode(4),
    };
};
