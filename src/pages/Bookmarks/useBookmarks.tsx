import { useContext, useEffect, useState } from 'react';
import PlantContext from '../../contexts/PlantContext';

export enum StorageKey {
    PLANT = 'currentPlant',
    PROJECT = 'currentProject',
    BOOKMARK = 'Procosys Bookmark',
    REDIRECTPATH = 'ProCoSys-CWA-redirectPath',
}

const cleanUpBookmarks = (bookmarks: any): string[] => {
    const commPkgIds: string[] = bookmarks.filter(
        (bookmark: unknown) => typeof bookmark === 'string'
    );
    return Array.from(new Set(commPkgIds));
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
const useBookmarks = (commPkgId: string) => {
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
                (commPkgIdFromCache) => commPkgIdFromCache === commPkgId
            )
        );
    }, [currentBookmarks, commPkgId]);

    // Update currentbookmarks whenever user bookmarks/unbookmarks a pkg
    useEffect(() => {
        if (!currentBookmarks) return;
        if (isBookmarked) {
            if (!commPkgId) return;
            setCurrentBookmarks([...currentBookmarks, commPkgId]);
        } else {
            if (currentBookmarks.length < 1) return;
            setCurrentBookmarks(
                currentBookmarks.filter(
                    (existingCommPkgId) => existingCommPkgId !== commPkgId
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
