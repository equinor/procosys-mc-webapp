import { isOfType } from '@equinor/procosys-webapp-components';
import { LocalStorage, OfflineStatus } from '../typings/enums';

export const getOfflineStatusfromLocalStorage = (): OfflineStatus => {
    const offlineStatus = localStorage.getItem(LocalStorage.OFFLINE_STATUS);
    console.log('--------------oFFLINE STATUS: ' + offlineStatus);
    if (offlineStatus == null) return OfflineStatus.ONLINE;
    console.log('JEG HER HER!');
    const offlineStatusNum = parseInt(offlineStatus);
    console.log('JEG HER HER! ' + offlineStatusNum);

    if (offlineStatusNum in OfflineStatus) {
        return offlineStatusNum;
    }
    return OfflineStatus.ONLINE;
};

/**
 * Update offline statue on local storage and service worker.
 * Offline plantid and projectid will also be stored in local storage.
 */
export const updateOfflineStatus = (
    offlineStatus: OfflineStatus,
    userPin: string,
    currentProjectId?: number
): void => {
    console.log('-----updateOfflineStatus: ' + offlineStatus);
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
    console.log('getOfflineProjectIdfromLocalStorage');
    const projectId = localStorage.getItem(LocalStorage.OFFLINE_PROJECT_ID);
    if (projectId) {
        return Number.parseInt(projectId);
    }
    throw Error('Offline projectId is missing in local storage.');
};
