import {
    AsyncStatus,
    SearchType,
    isOfType,
} from '@equinor/procosys-webapp-components';
import { useContext, useEffect, useState } from 'react';
import PlantContext from '../contexts/PlantContext';
import { EntityType, OfflineStatus } from '../typings/enums';
import { Bookmarks } from '../services/apiTypes';
import useCommonHooks from './useCommonHooks';
import buildOfflineScope from '../offline/buildOfflineScope';
import { db } from '../offline/db';
import { updateOfflineStatus } from '../offline/OfflineStatus';
import { OfflineContentRepository } from '../offline/OfflineContentRepository';
import { LocalStorage } from '../contexts/McAppContext';

export enum OfflineAction {
    INACTIVE = 0,
    STARTING = 1,
    DOWNLOADING = 2,
    CANCELLING = 3,
    SYNCHING = 4,
}

interface UseBookmarks {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useBookmarks = ({ setSnackbarText }: UseBookmarks) => {
    const { currentPlant, currentProject } = useContext(PlantContext);
    const { params, api, setOfflineState, configurationAccessToken } =
        useCommonHooks();
    const [currentBookmarks, setCurrentBookmarks] = useState<Bookmarks | null>(
        null
    );
    const [bookmarksStatus, setBookmarksStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );
    const [offlineAction, setOfflineAction] = useState<OfflineAction>(
        OfflineAction.INACTIVE
    );
    const [userPin, setUserPin] = useState<string>('');
    const abortController = new AbortController();
    const offlineContentRepository = new OfflineContentRepository();

    const getCurrentBookmarks = async (): Promise<void> => {
        if (!currentProject) return;
        setBookmarksStatus(AsyncStatus.LOADING);
        try {
            const bookmarksFromApi = await api.getBookmarks(
                params.plant,
                currentProject?.id,
                abortController.signal
            );
            if (
                bookmarksFromApi == null ||
                (bookmarksFromApi.bookmarkedMcPkgs.length < 1 &&
                    bookmarksFromApi.bookmarkedPurchaseOrders.length < 1 &&
                    bookmarksFromApi.bookmarkedTags.length < 1 &&
                    bookmarksFromApi.bookmarkedWorkOrders.length < 1)
            ) {
                setBookmarksStatus(AsyncStatus.EMPTY_RESPONSE);
                setCurrentBookmarks(bookmarksFromApi);
            } else {
                setBookmarksStatus(AsyncStatus.SUCCESS);
                setCurrentBookmarks(bookmarksFromApi);
            }
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setBookmarksStatus(AsyncStatus.ERROR);
        }
    };

    useEffect(() => {
        getCurrentBookmarks();
    }, [params.project]);

    const isBookmarked = (
        entityType: SearchType,
        entityId: number
    ): boolean => {
        if (!currentBookmarks) return false;
        if (entityType == SearchType.MC) {
            return currentBookmarks.bookmarkedMcPkgs.some(
                (mcPkg) => mcPkg.id === entityId
            );
        } else if (entityType == SearchType.Tag) {
            return currentBookmarks.bookmarkedTags.some(
                (tag) => tag.id === entityId
            );
        } else if (entityType == SearchType.PO) {
            return currentBookmarks.bookmarkedPurchaseOrders.some(
                (po) => po.callOffId === entityId
            );
        } else {
            return currentBookmarks.bookmarkedWorkOrders.some(
                (wo) => wo.id === entityId
            );
        }
    };

    const handleBookmarkClicked = async (
        entityType: SearchType,
        entityId: number,
        isBookmarked: boolean
    ): Promise<void> => {
        try {
            if (isBookmarked) {
                await api.deleteBookmark(params.plant, entityType, entityId);
            } else {
                await api.postSetBookmark(params.plant, entityType, entityId);
            }
            await getCurrentBookmarks();
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            await getCurrentBookmarks();
        }
    };

    const cancelOffline = async (): Promise<void> => {
        try {
            if (currentProject) {
                setBookmarksStatus(AsyncStatus.LOADING);
                updateOfflineStatus(OfflineStatus.ONLINE, '');
                setOfflineState(OfflineStatus.ONLINE);
                await api.putUnderPlanning(params.plant, currentProject.id);
                await db.delete();
                setOfflineAction(OfflineAction.INACTIVE);
                setBookmarksStatus(AsyncStatus.SUCCESS);
            }
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setOfflineAction(OfflineAction.INACTIVE);
            setBookmarksStatus(AsyncStatus.SUCCESS);
            setOfflineState(OfflineStatus.OFFLINE); // TODO: evaluate whether this one should be here or not
        }
    };

    const deleteBookmarks = async (): Promise<void> => {
        try {
            if (currentProject) {
                setBookmarksStatus(AsyncStatus.LOADING);
                await api.deleteBookmarks(params.plant, currentProject.id);
                setBookmarksStatus(AsyncStatus.EMPTY_RESPONSE);
                setCurrentBookmarks(null);
            }
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setBookmarksStatus(AsyncStatus.SUCCESS);
        }
    };

    const sendOfflineStatusToBackend = async (): Promise<void> => {
        if (!currentProject || !currentPlant) {
            return;
        }
        const checklistIds = await offlineContentRepository.getEntityIdsByType(
            EntityType.Checklist
        );
        const punchItemIds = await offlineContentRepository.getEntityIdsByType(
            EntityType.PunchItem
        );

        await api.putOfflineScopeOffline(
            currentPlant.slug,
            currentProject.id,
            checklistIds,
            punchItemIds
        );
    };

    const startOffline = async (userPin: string): Promise<void> => {
        try {
            setBookmarksStatus(AsyncStatus.LOADING);
            setOfflineAction(OfflineAction.DOWNLOADING);

            localStorage.removeItem(LocalStorage.SYNCH_ERRORS); //just to be sure...
            db.create(userPin);

            if (currentPlant && currentProject) {
                await buildOfflineScope(
                    api,
                    currentPlant.slug,
                    currentProject.id,
                    configurationAccessToken
                );
            }
            await sendOfflineStatusToBackend();
            updateOfflineStatus(
                OfflineStatus.OFFLINE,
                userPin,
                currentProject?.id
            );

            setOfflineState(OfflineStatus.OFFLINE);
            localStorage.removeItem(LocalStorage.LOGIN_TRIES); //just to be sure...
            setBookmarksStatus(AsyncStatus.SUCCESS);
            setOfflineAction(OfflineAction.INACTIVE);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setBookmarksStatus(AsyncStatus.SUCCESS);
            setOfflineAction(OfflineAction.INACTIVE);
        }
    };

    const finishOffline = async (): Promise<void> => {
        //setOfflineAction(OfflineAction.SYNCHING);
        setBookmarksStatus(AsyncStatus.LOADING);
        localStorage.setItem(
            LocalStorage.OFFLINE_STATUS,
            OfflineStatus.SYNCHING.toString()
        );
        //After reloading, the application will be reauthenticated, and
        //syncronization will be started.
        //Note: When running tests, location object does not have 'reload'.
        if (isOfType<Location>(location, 'reload')) {
            location.reload();
        }
    };

    return {
        bookmarksStatus,
        currentBookmarks,
        isBookmarked,
        handleBookmarkClicked,
        cancelOffline,
        startOffline,
        finishOffline,
        deleteBookmarks,
        userPin,
        setUserPin,
        offlineAction,
        setOfflineAction,
    };
};

export default useBookmarks;
