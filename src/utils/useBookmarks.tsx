import { AsyncStatus } from '@equinor/procosys-webapp-components';
import { useContext, useEffect, useState } from 'react';
import PlantContext from '../contexts/PlantContext';
import { SearchType } from '../typings/enums';
import { Bookmarks } from '../services/apiTypes';
import useCommonHooks from './useCommonHooks';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useBookmarks = () => {
    const { params, api } = useCommonHooks();
    const [currentBookmarks, setCurrentBookmarks] = useState<Bookmarks | null>(
        null
    );
    const [fetchBookmarksStatus, setFetchBookmarksStatus] =
        useState<AsyncStatus>(AsyncStatus.INACTIVE);
    const { currentProject } = useContext(PlantContext);
    const abortController = new AbortController();
    // TODO: only allow this to be used when in editing mode!
    // TODO: add a way to start editing mode

    const getCurrentBookmarks = async (): Promise<void> => {
        if (!currentProject) return;
        setFetchBookmarksStatus(AsyncStatus.LOADING);
        try {
            const bookmarksFromApi = await api.getBookmarks(
                params.plant,
                currentProject?.id,
                abortController.signal
            );
            if (bookmarksFromApi == null) {
                setFetchBookmarksStatus(AsyncStatus.EMPTY_RESPONSE);
            } else {
                setFetchBookmarksStatus(AsyncStatus.SUCCESS);
                setCurrentBookmarks(bookmarksFromApi);
            }
        } catch {
            setFetchBookmarksStatus(AsyncStatus.ERROR);
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
            getCurrentBookmarks();
        } catch (error) {
            if (!(error instanceof Error)) return;
        }
    };

    const deleteAllBookmarks = async (): Promise<void> => {
        try {
            if (currentProject) {
                await api.deleteAllBookmarks(params.plant, currentProject?.id);
                setFetchBookmarksStatus(AsyncStatus.EMPTY_RESPONSE);
                setCurrentBookmarks(null);
            }
        } catch (error) {
            if (!(error instanceof Error)) return;
        }
    };

    return {
        fetchBookmarksStatus,
        currentBookmarks,
        isBookmarked,
        handleBookmarkClicked,
        deleteAllBookmarks,
    };
};

export default useBookmarks;
