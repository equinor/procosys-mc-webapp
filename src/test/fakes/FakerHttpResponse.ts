import { faker } from '@faker-js/faker';
// import {
//     FakerHeaders,
//     FakerHttpRequestMessageConfig,
// } from './FakerHttpRequest';
// import { FakerAlphaCode } from './faker';
// import { AxiosResponse } from 'axios';

// // Generic version of this does not work. Will need one faker for each response type
// export const FakerHttpResponseMessageConfig =
//     (): HttpResponseMessageConfig<any> => {
//         return {
//             data: {}, // this is data from server
//             status: parseInt(faker.random.numeric(3)),
//             statusText: faker.lorem.sentence(6),
//             headers: FakerHeaders(),
//             config: faker.lorem.sentence(3),
//             request: FakerAlphaCode(9),
//         };
//     };

// export const FakerHttpResponseMessage = (
//     request: HttpRequestMessageConfig
// ): HttpResponseMessage<any, any> => {
//     const status = parseInt(faker.random.numeric(3));
//     const headers = FakerHeaders();
//     const content = new ArrayBuffer(8);
//     return {
//         status: status,
//         content: content,
//         request: request,
//         headers: headers,
//         responseType: 'basic',
//         data: {}, // if data is not from a passed in response message config, then one FakerHttpResponseMessage is needed for eact response type
//         buildResponse: (): Response =>
//             new Response(content, {
//                 status: status,
//                 statusText: '',
//                 headers: headers,
//             }),
//         fromAxios: (axiosResponse: AxiosResponse): void => {
//             // doesn't return anything
//         },
//         str2ab: (str: string): void => {
//             // doesn't return anything
//         },
//     };
// };

// export const FakerHttpResponseMessageWithAxiosInput = (
//     axiosResponse: AxiosResponse,
//     request: HttpRequestMessageConfig
// ): HttpResponseMessage<any, any> => {
//     const content = new ArrayBuffer(8);
//     return {
//         status: axiosResponse.status,
//         content: content,
//         request: request,
//         headers: axiosResponse.headers,
//         responseType: axiosResponse.request.responseType,
//         data: {}, // if data is not from a passed in response message config, then one FakerHttpResponseMessage is needed for eact response type
//         buildResponse: (): Response =>
//             new Response(content, {
//                 status: axiosResponse.status,
//                 statusText: '',
//                 headers: axiosResponse.headers,
//             }),
//         fromAxios: (axiosResponse: AxiosResponse): void => {
//             // doesn't return anything
//         },
//         str2ab: (str: string): void => {
//             // doesn't return anything
//         },
//     };
// };
