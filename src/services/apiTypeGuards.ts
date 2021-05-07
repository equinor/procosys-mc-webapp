import { SearchType } from '../pages/Search/Search';
import objectToCamelCase from '../utils/objectToCamelCase';
import { McPkgPreview, SearchResults } from './apiTypes';

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

export const isArraryOfCorrectPreview = (
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
