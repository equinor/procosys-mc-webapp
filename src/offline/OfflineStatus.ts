export const getOfflineStatus = (): boolean => {
    const isOffline = localStorage.getItem('offline');
    if (isOffline === 'true') {
        return true;
    } else if (isOffline === 'false') {
        return false;
    } else {
        //insert offline status, if it is missing
        setOfflineStatus(false);
        return false;
    }
};

export const setOfflineStatus = (offlineStatus: boolean): void => {
    localStorage.setItem('offline', String(offlineStatus));

    //Send message to service worker about offline status
    if (offlineStatus) {
        navigator.serviceWorker.controller?.postMessage({
            type: 'SET_OFFLINE',
        });
    } else {
        navigator.serviceWorker.controller?.postMessage({
            type: 'SET_ONLINE',
        });
    }
};
