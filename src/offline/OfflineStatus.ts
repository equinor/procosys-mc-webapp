export const getOfflineStatusfromLocalStorage = (): boolean => {
    const offline = localStorage.getItem('offline');
    if (offline === 'true') {
        return true;
    } else {
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
    navigator.serviceWorker.controller?.postMessage({
        type: 'SET_OFFLINE_STATUS',
        data: {
            isOffline: isOffline,
            userPin: userPin,
        },
    });
};
