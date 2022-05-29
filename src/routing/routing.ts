import { RouteHandlerCallbackOptions } from 'workbox-core';
import {
    HashCodeByHashConfiguration,
    HashCodeByUrlAndPayload,
    URLSearchParamsToMap,
} from './hash';

/**
 * An object with responsibility on matching a request to a route.
 * Where the request is type og POST and the query parameters are in the payload
 * @param param0
 * @returns
 */
export const handlerPOSTCb = async <T>({
    url,
    request,
    event,
    params,
}: RouteHandlerCallbackOptions): Promise<Response> => {
    const response = await fetch(request);
    const responseBody = await response.json();
    console.log("custom routing: match on route 'api/person'");
    const hash = HashCodeByUrlAndPayload<T>(
        url !== undefined ? url.toString() : ' ', //Todo: Investigate how to handle url is undefined
        responseBody
    );

    return new Response(`${responseBody}`, { headers: response.headers });
};

export const handlerGETCb = async <T>({
    url,
    request,
    event,
    params,
}: RouteHandlerCallbackOptions): Promise<Response> => {
    const response = await fetch(request);
    const responseBody = await response.json();
    const parameters = url !== undefined ? url.searchParams : '';
    console.log("custom routing: match on route 'api/person'");
    if (parameters instanceof URLSearchParams) {
        // eslint-disable-next-line prettier/prettier
        const hash = HashCodeByHashConfiguration('url', URLSearchParamsToMap(parameters));

        /** MAKE THE LOOKUP TO DATABASE WITH THE hash*/
        return new Response(`${responseBody}`, { headers: response.headers });
    }
    throw new Error('parameters is undefined');
};
