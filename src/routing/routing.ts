import { RouteHandlerCallbackOptions } from 'workbox-core';
import { StatusRepository } from '../database/StatusRepository';
import {
    HashCodeByHashConfiguration,
    hashCodeByUrlAndPayload,
    HashCodeByUrlAndPayload,
    URLSearchParamsToMap,
} from './hash';
import { HttpResponseMessage } from './Http/HttpResponseMessage';

/**
 * An object with responsibility on matching a request to a route.
 * Where the request is type og POST and the query parameters are in the payload
 * @param param0
 * @returns
 */
export const handlerPOSTCb = async function ({
    //Todo: handlerForHttpPostCallback
    url,
    request,
    event,
    params,
}: RouteHandlerCallbackOptions) {
    const response = await fetch(request);
    const responseBody = await response.json();
    if (await OnlineMode()) {
        console.log('ONLINE MODE');
    } else {
        console.log("custom routing: match on route 'api/person'");
        const hash = hashCodeByUrlAndPayload(
            url !== undefined ? url.toString() : ' ',
            responseBody
        );

        return new Response(`${responseBody}`, { headers: response.headers });
    }
    throw new Error('Should not happend');
};

//Todo: handlerForHttpGETCallback

export const handlerGETCb = async <T>({
    url,
    request,
    event,
    params,
}: RouteHandlerCallbackOptions) => {
    const response = await fetch(request);
    const responseBody = await response.json();
    const parameters = url !== undefined ? url.searchParams : '';
    if (await OnlineMode()) {
    } else {
        console.log("custom routing: match on route 'api/person'");
        if (parameters instanceof URLSearchParams) {
            // eslint-disable-next-line prettier/prettier
            const hash = HashCodeByHashConfiguration('url', URLSearchParamsToMap(parameters));
            /** MAKE THE LOOKUP TO DATABASE WITH THE hash*/
            //This is the best we can get in this moment of time.
            return new Response(`${responseBody}`, {
                headers: response.headers,
            });
        }
    }
    throw new Error('parameters is undefined');
};

async function OnlineMode(): Promise<boolean | undefined> {
    const statusRepository = new StatusRepository();
    const status = await statusRepository.getStatus();
    try {
        const status = await statusRepository.getStatus();
        if (status !== undefined) {
            return status.name === 'offline' ? false : true;
        }
    } catch (err) {
        console.log(err);
    }
}
