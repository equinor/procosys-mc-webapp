import { StorageKey } from '@equinor/procosys-webapp-components';
import { useContext, useEffect, useState } from 'react';
import PlantContext from '../contexts/PlantContext';

const cleanUpBookmarks = (bookmarks: any): string[] => {
    const mcPkgIds: string[] = bookmarks.filter(
        (bookmark: unknown) => typeof bookmark === 'string'
    );
    return Array.from(new Set(mcPkgIds));
};

export const getCurrentBookmarks = (projectId: string): string[] => {
    const bookmarksFromLocalStorage = window.localStorage.getItem(
        `${StorageKey.BOOKMARK}: ${projectId}`
    );
    if (bookmarksFromLocalStorage) {
        return cleanUpBookmarks(JSON.parse(bookmarksFromLocalStorage));
    }
    return [];
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useBookmarks = (mcPkgId: string) => {
    const { currentProject } = useContext(PlantContext);
    const projectId = currentProject?.id.toString() as string;
    const [currentBookmarks, setCurrentBookmarks] = useState<string[]>();
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Set current bookmarks to whatever is in local storage
    useEffect(() => {
        setCurrentBookmarks(getCurrentBookmarks(projectId));
    }, [projectId]);

    // Set isBookmarked to true if package exists in localstorage
    useEffect(() => {
        if (!currentBookmarks) return;
        setIsBookmarked(
            currentBookmarks.some(
                (mcPkgIdFromCache) => mcPkgIdFromCache === mcPkgId
            )
        );
    }, [currentBookmarks, mcPkgId]);

    // Update currentbookmarks whenever user bookmarks/unbookmarks a pkg
    useEffect(() => {
        if (!currentBookmarks) return;
        if (isBookmarked) {
            if (!mcPkgId) return;
            setCurrentBookmarks([...currentBookmarks, mcPkgId]);
        } else {
            if (currentBookmarks.length < 1) return;
            setCurrentBookmarks(
                currentBookmarks.filter(
                    (existingmcPkgId) => existingmcPkgId !== mcPkgId
                )
            );
        }
    }, [isBookmarked]);

    // Set current bookmark state to localstorage whenever it changes
    useEffect(() => {
        if (!currentBookmarks) return;
        window.localStorage.setItem(
            `${StorageKey.BOOKMARK}: ${projectId}`,
            JSON.stringify(cleanUpBookmarks(currentBookmarks))
        );
    }, [currentBookmarks]);

    return {
        setIsBookmarked,
        isBookmarked,
    };
};

export default useBookmarks;
