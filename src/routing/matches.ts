import { RouteMatchCallbackOptions } from 'workbox-core';
export const matchCb = ({url, request, event}: RouteMatchCallbackOptions ) => {
    return url.pathname.includes('api/person');
}
