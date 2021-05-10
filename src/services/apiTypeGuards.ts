// TODO: sorting
import { SearchType } from '../pages/Search/Search';
import {
    ChecklistPreview,
    McPkgPreview,
    PunchPreview,
    SearchResults,
} from './apiTypes';

export const isCorrectPreview = (
    data: unknown,
    searchType: SearchType
): data is McPkgPreview => {
    if (searchType === SearchType.MC) {
        return (
            data != null && typeof (data as McPkgPreview).mcPkgNo === 'string'
        );
    } else {
        return false;
    }
};

const isArraryOfCorrectPreview = (
    data: unknown,
    searchType: SearchType
): data is McPkgPreview[] => {
    if (Array.isArray(data)) {
        data.forEach((item) => {
            if (isCorrectPreview(item, searchType) === false) return false;
        });
        return true;
    }
    return false;
};

export const isCorrectSearchResults = (
    data: unknown,
    searchType: SearchType
): data is SearchResults => {
    return (
        data != null &&
        data != undefined &&
        isArraryOfCorrectPreview((data as SearchResults).items, searchType)
    );
};

const isChecklistPreview = (data: unknown): data is ChecklistPreview => {
    return (
        data != null &&
        typeof (data as ChecklistPreview).attachmentCount === 'number'
    );
};

export const isArrayOfChecklistPreview = (
    data: unknown
): data is ChecklistPreview[] => {
    return Array.isArray(data) && data.every(isChecklistPreview);
};

const isPunchPreview = (data: unknown): data is PunchPreview => {
    return (
        data != null &&
        typeof (data as PunchPreview).statusControlledBySwcr === 'boolean'
    );
};

export const isArrayOfPunchPreview = (
    data: unknown
): data is PunchPreview[] => {
    return Array.isArray(data) && data.every(isPunchPreview);
};
