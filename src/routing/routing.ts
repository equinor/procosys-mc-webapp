import { RouteHandlerCallbackOptions } from 'workbox-core';

export const handlerCb = async ({ url, request, event, params }: RouteHandlerCallbackOptions) => {
    const response = await fetch(request);
    const responseBody = await response.text();
    console.log("custom routing: match on route 'api/person'")
    return new Response(`${responseBody}`, { headers: response.headers });
};