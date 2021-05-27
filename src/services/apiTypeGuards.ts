import { SearchType } from '../pages/Search/Search';
import {
    ChecklistPreview,
    McPkgPreview,
    PunchCategory,
    PunchOrganization,
    PunchPreview,
    PunchType,
    SearchResults,
} from './apiTypes';

// SEARCH
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

const isArrayOfCorrectPreview = (
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
        isArrayOfCorrectPreview((data as SearchResults).items, searchType)
    );
};

// SCOPE
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

// PUNCH
const isPunchCategory = (data: unknown): data is PunchCategory => {
    return data != null && typeof (data as PunchCategory).id === 'number';
};

export const isArrayOfPunchCategory = (
    data: unknown
): data is PunchCategory[] => {
    return Array.isArray(data) && data.every(isPunchCategory);
};

const isPunchType = (data: unknown): data is PunchType => {
    return data != null && typeof (data as PunchType).id === 'number';
};

export const isArrayOfPunchType = (data: unknown): data is PunchType[] => {
    return Array.isArray(data) && data.every(isPunchType);
};

const isPunchOrganization = (data: unknown): data is PunchOrganization => {
    return data != null && typeof (data as PunchOrganization).id === 'number';
};

export const isArrayOfPunchOrganization = (
    data: unknown
): data is PunchOrganization[] => {
    return Array.isArray(data) && data.every(isPunchOrganization);
};
