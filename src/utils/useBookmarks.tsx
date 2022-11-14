import { AsyncStatus, isOfType } from '@equinor/procosys-webapp-components';
import { useContext, useEffect, useState } from 'react';
import PlantContext from '../contexts/PlantContext';
import { SearchType } from '../typings/enums';
import { Bookmarks } from '../services/apiTypes';
import useCommonHooks from './useCommonHooks';
import buildOfflineScope from '../offline/buildOfflineScope';
import { db } from '../offline/db';
import { updateOfflineStatus } from '../offline/OfflineStatus';

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
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [isStarting, setIsStarting] = useState<boolean>(false);
    const [userPin, setUserPin] = useState<string>('');
    const abortController = new AbortController();

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
                setIsCancelling(false);
                setBookmarksStatus(AsyncStatus.SUCCESS);
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

    const startOffline = async (userPin: string): Promise<void> => {
        setBookmarksStatus(AsyncStatus.LOADING);
        setIsDownloading(true);

        db.create(userPin);

        if (currentPlant && currentProject) {
            await buildOfflineScope(
                api,
                currentPlant.slug,
                currentProject.id,
                configurationAccessToken
            );
        }

        updateOfflineStatus(true, userPin);
        setOfflineState(true);
        localStorage.removeItem('loginTries'); //just to be sure...
        setBookmarksStatus(AsyncStatus.SUCCESS);
        setIsDownloading(false);
    };

    const finishOffline = async (): Promise<void> => {
        setBookmarksStatus(AsyncStatus.LOADING);
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
        isDownloading,
        finishOffline,
        deleteBookmarks,
        isCancelling,
        setIsCancelling,
        isStarting,
        setIsStarting,
        userPin,
        setUserPin,
    };
};

export default useBookmarks;
