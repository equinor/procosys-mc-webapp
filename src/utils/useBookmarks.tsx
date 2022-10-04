import { AsyncStatus } from '@equinor/procosys-webapp-components';
import { useContext, useEffect, useState } from 'react';
import PlantContext from '../contexts/PlantContext';
import { SearchType } from '../typings/enums';
import { Bookmarks } from '../services/apiTypes';
import useCommonHooks from './useCommonHooks';
import { syncUpdatesWithBackend } from '../offline/syncUpdatesWithBackend';
import buildOfflineScope from '../offline/buildOfflineScope';
import { OfflineContentRepository } from '../offline/OfflineContentRepository';
import { OfflineUpdateRepository } from '../offline/OfflineUpdateRepository';

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
    const abortController = new AbortController();
    const [isCancelling, setIsCancelling] = useState<boolean>(false);

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
                await setOfflineState(false);
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

    const startOffline = async (): Promise<void> => {
        setBookmarksStatus(AsyncStatus.LOADING);
        setIsDownloading(true);
        const offlineContentRepository = new OfflineContentRepository();
        const offlineUpdateRepository = new OfflineUpdateRepository();

        await offlineContentRepository.cleanOfflineContent();
        await offlineUpdateRepository.cleanOfflineUpdates();

        if (currentPlant && currentProject) {
            await buildOfflineScope(
                api,
                currentPlant.slug,
                currentProject.id,
                configurationAccessToken
            );
        }

        await setOfflineState(true);
        setBookmarksStatus(AsyncStatus.SUCCESS);
        setIsDownloading(false);
    };
    const finishOffline = async (): Promise<void> => {
        setBookmarksStatus(AsyncStatus.LOADING);
        await setOfflineState(false);
        await syncUpdatesWithBackend(api);
        await getCurrentBookmarks();
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
    };
};

export default useBookmarks;
