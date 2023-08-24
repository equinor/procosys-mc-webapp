import {
    LocalStorage,
    OfflineStatus,
    isOfType,
} from '@equinor/procosys-webapp-components';

/**
 * Update offline statue on local storage and service worker.
 * Offline plantid and projectid will also be stored in local storage.
 */
export const updateOfflineStatus = (
    offlineStatus: OfflineStatus,
    userPin: string,
    currentProjectId?: number
): void => {
    localStorage.setItem(LocalStorage.OFFLINE_STATUS, offlineStatus.toString());

    //todo: skal vi gjøre dette på en annen måte?
    if (currentProjectId) {
        localStorage.setItem(
            LocalStorage.OFFLINE_PROJECT_ID,
            String(currentProjectId)
        );
    }

    //Send message to service worker about offline status
    //Note: When running tests, serviceWorker will not exists
    if (isOfType<Navigator>(navigator, 'serviceWorker')) {
        navigator.serviceWorker.controller?.postMessage({
            type: 'SET_OFFLINE_STATUS',
            data: {
                offlineStatus: offlineStatus,
                userPin: userPin,
            },
        });
    }
};

export const getOfflineProjectIdfromLocalStorage = (): number => {
    const projectId = localStorage.getItem(LocalStorage.OFFLINE_PROJECT_ID);
    if (projectId) {
        return Number.parseInt(projectId);
    }
    throw Error('Offline projectId is missing in local storage.');
};
