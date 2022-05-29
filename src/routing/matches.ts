import { RouteMatchCallbackOptions } from 'workbox-core';

export const matchGetUrlCb = ({
    url,
    request,
    event,
}: RouteMatchCallbackOptions): boolean => {
    if (event === undefined) {
        throw new Error(`event is undefined`);
    }
    return request.method === 'GET' && url.pathname.includes('api/person');
};

export const matchPostPutPatchUrlCb = ({
    url,
    request,
    event,
}: RouteMatchCallbackOptions): boolean => {
    if (event === undefined) {
        throw new Error(`event is undefined`);
    }
    return (
        (request.method === 'POST' ||
            request.method === 'PUT' ||
            request.method === 'PATCH') &&
        url.pathname.includes('api/person')
    );
};
