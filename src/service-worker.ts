/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { OfflineContentRepository } from './offline/OfflineContentRepository';
import { updateOfflineContentDatabase } from './offline/offlineContentUpdates/updateOfflineDatabase';
import { addUpdateRequestToDatabase } from './offline/addUpdateRequestToDatabase';
import { OfflineUpdateRequest } from './offline/OfflineUpdateRequest';
import removeBaseUrlFromUrl from './utils/removeBaseUrlFromUrl';
import IsOfflineMode from './utils/isOfflineMode';

declare const self: ServiceWorkerGlobalScope;

const offlineContentRepository = new OfflineContentRepository();

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
    // Return false to exempt requests from being fulfilled by index.html.
    ({ request, url }: { request: Request; url: URL }) => {
        // If this isn't a navigation, skip.
        if (request.mode !== 'navigate') {
            return false;
        }

        // If this is a URL that starts with /_, skip.
        if (url.pathname.startsWith('/_')) {
            return false;
        }

        // If this looks like a URL for a resource, because it contains
        // a file extension, skip.
        if (url.pathname.match(fileExtensionRegexp)) {
            return false;
        }

        // Return true to signal that we want to use the handler.
        return true;
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
    // Add in any other file extensions or routing criteria as needed.
    ({ url }) =>
        url.origin === self.location.origin && url.pathname.endsWith('.png'),
    // Customize this strategy as needed, e.g., by changing to CacheFirst.
    new StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            // Ensure that once this runtime cache reaches a maximum size the
            // least-recently used images are removed.
            new ExpirationPlugin({ maxEntries: 50 }),
        ],
    })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

const handleFetchGET = async (event: FetchEvent): Promise<any> => {
    console.log('handleFetchGET', event.request.url);
    const url = removeBaseUrlFromUrl(event.request.url);

    if (await IsOfflineMode()) {
        // Try to get the response from offline content database.
        const entity = await offlineContentRepository.getByApiPath(url);
        if (entity) {
            //todo: Ta bort log
            console.log(
                'handleFetchGET: Returnerer objekt fra database. ' +
                    event.request.url,
                entity.responseObj
            );
            const blob = new Blob([JSON.stringify(entity.responseObj)]);
            return new Response(blob);
        } else {
            console.error(
                'Offline-mode. Entity for given url is not found in local database. Will try to fetch.',
                event.request.url
            );
            return await fetch(event.request);
        }
    } else {
        return await fetch(event.request);
    }
};

const handleFetchUpdate = async (event: FetchEvent): Promise<Response> => {
    if (await IsOfflineMode()) {
        console.log('handleFetchupdate. Offline mode.', event.request.url);

        const offlinePostRequest = await OfflineUpdateRequest.build(
            event.request
        );
        await updateOfflineContentDatabase(offlinePostRequest);
        await addUpdateRequestToDatabase(offlinePostRequest);

        return new Response();
    } else {
        console.log('handleFetchUpdate. Online mode', event.request.url);
        return await fetch(event.request);
    }
};

const handleOtherFetchEvents = async (event: FetchEvent): Promise<Response> => {
    if (await IsOfflineMode()) {
        console.error(
            'We are in offline mode, and should not need to perform any fetch.',
            event.request.url
        );
        return await fetch(event.request);
    } else {
        console.log('handleFetchUpdate. Online mode', event.request.url);
        return await fetch(event.request);
    }
};

self.addEventListener('fetch', function (event: FetchEvent) {
    console.log('Intercept fetch', event.request.url);
    const url = event.request.url;
    const method = event.request.method;
    if (method == 'GET' && url.includes('/api/')) {
        //todo: We should find a better way to identify these requests!
        event.respondWith(handleFetchGET(event));
        return;
    } else if (
        (method == 'POST' || method == 'PUT' || method == 'DELETE') &&
        url.includes('/api/')
    ) {
        event.respondWith(handleFetchUpdate(event));
        return;
    }
    event.respondWith(handleOtherFetchEvents(event));
});
