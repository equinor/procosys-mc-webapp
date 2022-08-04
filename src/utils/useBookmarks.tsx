import { AsyncStatus, StorageKey } from '@equinor/procosys-webapp-components';
import { useContext, useEffect, useState } from 'react';
import Search, { SearchType } from '../pages/Search/Search';
import useCommonHooks from './useCommonHooks';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useBookmarks = () => {
    const { params, api } = useCommonHooks();
    const [currentBookmarks, setCurrentBookmarks] = useState<any[]>(); // TODO: change to return type of getBookmarks
    const [fetchBookmarksStatus, setFetchBookmarksStatus] =
        useState<AsyncStatus>(AsyncStatus.INACTIVE);

    // Set current bookmarks
    useEffect(() => {
        (async (): Promise<void> => {
            setFetchBookmarksStatus(AsyncStatus.LOADING);
            try {
                const bookmarksFromApi = await api.getBookmarks(params.plant);
                if (bookmarksFromApi.length < 1) {
                    // TODO: check in a better way once I know how the DTO looks
                    setFetchBookmarksStatus(AsyncStatus.EMPTY_RESPONSE);
                } else {
                    setFetchBookmarksStatus(AsyncStatus.SUCCESS);
                    setCurrentBookmarks(bookmarksFromApi);
                }
            } catch {
                setFetchBookmarksStatus(AsyncStatus.ERROR);
            }
        })();
    }, [params.project]);

    const isBookmarked = (
        entityType: SearchType,
        entityId: string
    ): boolean => {
        // TODO: muligens fikse når jeg ser hvordan getBookmarks DTO ser ut
        if (!currentBookmarks) return false;
        if (entityType == SearchType.MC) {
            currentBookmarks.mcPkgs.some((mcPkg) => mcPkg.id === entityId);
        } else if (entityType == SearchType.Tag) {
            currentBookmarks.tags.some((tag) => tag.id === entityId);
        } else if (entityType == SearchType.PO) {
            currentBookmarks.purchaseOrders.some((po) => po.id === entityId);
        } else {
            currentBookmarks.workOrders.some((wo) => wo.id === entityId);
        }
    };

    const handleBookmarkClicked = async (
        entityType: SearchType,
        entityId: string,
        isBookmarked: boolean // TODO: or do I just use isBookmarked function?
    ): Promise<void> => {
        try {
            if (isBookmarked) {
                await api.deleteBookmark(
                    params.plant,
                    params.searchType,
                    params.entityId
                );
            } else {
                await api.postSetBookmark(
                    params.plant,
                    params.searchType,
                    params.entityId
                );
            }
        } catch (error) {
            if (!(error instanceof Error)) return;
        }
    };

    return {
        fetchBookmarksStatus,
        currentBookmarks,
        isBookmarked,
    };
};

export default useBookmarks;
