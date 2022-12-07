import { AsyncStatus, isOfType } from '@equinor/procosys-webapp-components';
import { useContext, useEffect, useState } from 'react';
import PlantContext from '../contexts/PlantContext';
import { EntityType, SearchType } from '../typings/enums';
import { Bookmarks } from '../services/apiTypes';
import useCommonHooks from './useCommonHooks';
import buildOfflineScope from '../offline/buildOfflineScope';
import { db } from '../offline/db';
import { updateOfflineStatus } from '../offline/OfflineStatus';
import { OfflineContentRepository } from '../offline/OfflineContentRepository';
import { config } from 'process';

export enum OfflineAction {
    INACTIVE = 0,
    STARTING = 1,
    DOWNLOADING = 2,
    CANCELLING = 3,
    SYNCHING = 4,
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useBookmarks = () => {
    const { currentPlant, currentProject } = useContext(PlantContext);
    const { params, api, setOfflineState, auth, configurationAccessToken } =
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
        } catch {
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
        }
    };

    const cancelOffline = async (): Promise<void> => {
        try {
            if (currentProject) {
                setBookmarksStatus(AsyncStatus.LOADING);
                await api.putCancelOffline(params.plant, currentProject.id);
                updateOfflineStatus(false, '');
                await db.delete();
                setOfflineState(false);
                setOfflineAction(OfflineAction.INACTIVE);
                setBookmarksStatus(AsyncStatus.EMPTY_RESPONSE);
                setCurrentBookmarks(null);
            }
        } catch (error) {
            if (!(error instanceof Error)) return;
            // TODO: handle
        }
    };

    const deleteBookmarks = async (): Promise<void> => {
        try {
            if (currentProject) {
                setBookmarksStatus(AsyncStatus.LOADING);
                await api.putCancelOffline(params.plant, currentProject.id);
                setBookmarksStatus(AsyncStatus.EMPTY_RESPONSE);
                setCurrentBookmarks(null);
            }
        } catch (error) {
            if (!(error instanceof Error)) return;
            // TODO: handle
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
        setBookmarksStatus(AsyncStatus.LOADING);
        setOfflineAction(OfflineAction.DOWNLOADING);

        localStorage.removeItem('SynchErrors');
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
        updateOfflineStatus(true, userPin, currentProject?.id);

        setOfflineState(true);
        localStorage.removeItem('loginTries'); //just to be sure...
        setBookmarksStatus(AsyncStatus.SUCCESS);
        setOfflineAction(OfflineAction.INACTIVE);
    };

    const finishOffline = async (): Promise<void> => {
        //setOfflineAction(OfflineAction.SYNCHING);
        //setBookmarksStatus(AsyncStatus.LOADING);
        localStorage.setItem('status', 'sync');
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
