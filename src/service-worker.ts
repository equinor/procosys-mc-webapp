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
import { db } from './offline/db';
import { handleOtherFetchEvents } from './offline/handleFetchEvents';
import { OfflineStatus } from './typings/enums';

declare const self: ServiceWorkerGlobalScope;

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

let offlineStatus = OfflineStatus.ONLINE;

type OfflineStatusMessage = {
    offlineStatus: OfflineStatus;
    userPin: string;
};

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', async (event: MessageEventInit) => {
    const message: MessageEvent = event.data;
    if (message) {
        if (message.type === 'SKIP_WAITING') {
            self.skipWaiting();
        } else if (message.type === 'SET_OFFLINE_STATUS') {
            const offlineStatusMessage: OfflineStatusMessage = message.data;
            offlineStatus = offlineStatusMessage.offlineStatus;
            if (offlineStatus == OfflineStatus.OFFLINE) {
                if (
                    !offlineStatusMessage.userPin ||
                    offlineStatusMessage.userPin.length != 4
                ) {
                    console.error(
                        'Trying to update offline status for service worker, but pin is missing.'
                    );
                    return;
                }
                const suksess = await db.reInitAndVerifyPin(
                    offlineStatusMessage.userPin
                );
                if (!suksess) {
                    console.error(
                        'Service worker is not able to reinitiate database and verify pin.'
                    );
                }
            }
        }
    }
});

/**
 * When a new version of the application has been installed, the clients should skip waiting, and use the new version.
 * This ensures that the user will get the new version automatically, without restart of the browser window.
 */
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

/**
 * Handle fetch events. Will check if we are in offline mode.
 */
self.addEventListener('fetch', function (event: FetchEvent) {
    const url = event.request.url;
    if (
        offlineStatus == OfflineStatus.OFFLINE &&
        !url.includes('Application?') //is used to check connection to server
    ) {
        //User is in offline mode.  Data must be fetched from offline database
        console.log('Intercept fetch - offline mode', event.request.url);
        const method = event.request.method;
        if (method == 'GET' && url.includes('/api/')) {
            //todo: We should find a better way to identify these requests!
            //event.respondWith(handleFetchGET(event));
            return;
        } else if (
            (method == 'POST' || method == 'PUT' || method == 'DELETE') &&
            url.includes('/api/')
        ) {
            //event.respondWith(handleFetchUpdate(event));
            return;
        }
        event.respondWith(handleOtherFetchEvents(event));
    } else {
        //User is in online mode. The requests will be done the normal way.
        console.log('Intercept fetch - online mode', event.request.url);
        event.respondWith(fetch(event.request));
    }
});
