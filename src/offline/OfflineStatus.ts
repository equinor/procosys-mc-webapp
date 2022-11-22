import { isOfType } from '@equinor/procosys-webapp-components';

export const getOfflineStatusfromLocalStorage = (): boolean => {
    const offline = localStorage.getItem('offline');
    console.log(offline);
    if (offline === 'true') {
        return true;
    } else {
        console.log('returning false');
        return false;
    }
};

/**
 * Update offline statue on local storage and service worker
 */
export const updateOfflineStatus = (
    isOffline: boolean,
    userPin: string
): void => {
    localStorage.setItem('offline', String(isOffline));

    //Send message to service worker about offline status
    //Note: When running tests, serviceWorker will not exists
    if (isOfType<Navigator>(navigator, 'serviceWorker')) {
        navigator.serviceWorker.controller?.postMessage({
            type: 'SET_OFFLINE_STATUS',
            data: {
                isOffline: isOffline,
                userPin: userPin,
            },
        });
    }
};
