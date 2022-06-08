import {
    HttpResponseMessage,
    HttpResponseMessageConfig,
} from '../HttpResponse';
import { faker } from '@faker-js/faker';
import {
    FakerHeaders,
    FakerHttpRequestMessageConfig,
} from './FakerHttpRequest';
import { FakerAlphaCode } from './faker';
import { AxiosResponse } from 'axios';
import { HttpRequestMessageConfig } from '../HttpRequest';

// Generic version of this does not work. Will need one faker for each response type
export const FakerHttpResponseMessageConfig =
    (): HttpResponseMessageConfig<any> => {
        return {
            data: {}, // this is data from server
            status: parseInt(faker.random.numeric(3)),
            statusText: faker.lorem.sentence(6),
            headers: FakerHeaders(),
            config: faker.lorem.sentence(3),
            request: FakerAlphaCode(9),
        };
    };

// Some of these props might be from a passed in response message config?
export const FakerHttpResponseMessage = (
    request: HttpRequestMessageConfig
): HttpResponseMessage<any, any> => {
    const status = parseInt(faker.random.numeric(3));
    const headers = FakerHeaders();
    const content = new ArrayBuffer(8);
    return {
        status: status,
        content: content,
        request: request,
        headers: headers,
        responseType: 'basic',
        data: {}, // if data is not from a passed in response message config, then one FakerHttpResponseMessage is needed for eact response type
        buildResponse: (): Response =>
            new Response(content, {
                status: status,
                statusText: '',
                headers: headers,
            }),
        fromAxios: (axiosResponse: AxiosResponse): void => {
            // doesn't return anything
        },
        str2ab: (str: string): void => {
            // doesn't return anything
        },
    };
};