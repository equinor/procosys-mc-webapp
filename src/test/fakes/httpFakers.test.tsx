import React from 'react';
// import {
//     FakerHttpRequestMessage,
//     FakerHttpRequestMessageConfig,
// } from './FakerHttpRequest';
// import { FakerHttpResponseMessage } from './FakerHttpResponse';

// describe('http request fakers', () => {
//     it('FakerHttpRequestMessageConfig returns HttpRequestMessageConfig', () => {
//         const httpRequestMessageConfig = FakerHttpRequestMessageConfig();
//         expect(typeof httpRequestMessageConfig.method).toBe('string');
//         expect(typeof httpRequestMessageConfig.url).toBe('string');
//         expect(typeof httpRequestMessageConfig.baseURL).toBe('string');
//         // TODO: test more?
//     });
//     it('FakerHttpRequestMessage uses passed in config to create the fake', () => {
//         const httpRequestMessageConfig = FakerHttpRequestMessageConfig();
//         const httpRequestMessage = FakerHttpRequestMessage(
//             httpRequestMessageConfig
//         );
//         expect(httpRequestMessageConfig).toEqual(httpRequestMessage.config);
//     });
//     it('FakerHttpRequestMessage GetConfigObject returns the correct config', () => {
//         const httpRequestMessageConfig = FakerHttpRequestMessageConfig();
//         const httpRequestMessage = FakerHttpRequestMessage(
//             httpRequestMessageConfig
//         );
//         expect(httpRequestMessageConfig).toEqual(
//             httpRequestMessage.GetConfigObject()
//         );
//     });
// });

// describe('http response fakers', () => {
//     it('FakerHttpResponseMessage uses passed in request', () => {
//         const httpRequestMessageConfig = FakerHttpRequestMessageConfig();
//         const httpResponseMessage = FakerHttpResponseMessage(
//             httpRequestMessageConfig
//         );
//         expect(httpRequestMessageConfig).toEqual(httpResponseMessage.request);
//     });
// });
