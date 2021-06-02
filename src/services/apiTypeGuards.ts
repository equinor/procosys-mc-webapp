import { SearchType } from '../pages/Search/Search';
import {
    CheckItem,
    ChecklistDetails,
    ChecklistPreview,
    ChecklistResponse,
    CustomCheckItem,
    LoopTag,
    McPkgPreview,
    Person,
    PunchCategory,
    PunchOrganization,
    PunchPreview,
    PunchPriority,
    PunchSort,
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
    return data != null && typeof (data as PunchType).parentId === 'number';
};

export const isArrayOfPunchType = (data: unknown): data is PunchType[] => {
    return Array.isArray(data) && data.every(isPunchType);
};

const isPunchOrganization = (data: unknown): data is PunchOrganization => {
    return (
        data != null && typeof (data as PunchOrganization).parentId === 'number'
    );
};

export const isArrayOfPunchOrganization = (
    data: unknown
): data is PunchOrganization[] => {
    return Array.isArray(data) && data.every(isPunchOrganization);
};

const isPunchSort = (data: unknown): data is PunchSort => {
    return data != null && typeof (data as PunchSort).parentId === 'number';
};

export const isArrayOfPunchSort = (data: unknown): data is PunchSort[] => {
    return Array.isArray(data) && data.every(isPunchSort);
};

const isPunchPriority = (data: unknown): data is PunchPriority => {
    return data != null && typeof (data as PunchPriority).id === 'number';
};

export const isArrayOfPunchPriority = (
    data: unknown
): data is PunchPriority[] => {
    return Array.isArray(data) && data.every(isPunchPriority);
};

const isPerson = (data: unknown): data is Person => {
    return data != null && typeof (data as Person).azureOid === 'string';
};

export const isArrayofPerson = (data: unknown): data is Person[] => {
    return Array.isArray(data) && data.every(isPerson);
};

//CHECKLIST
const isLoopTag = (data: unknown): data is LoopTag => {
    return data != null && typeof (data as LoopTag).tagId === 'number';
};

const isArrayOfLoopTags = (data: unknown): data is LoopTag[] => {
    return Array.isArray(data) && data.every(isLoopTag);
};

const isChecklistDetails = (data: unknown): data is ChecklistDetails => {
    return (
        data != null &&
        typeof (data as ChecklistDetails).hasElectronicForm === 'boolean'
    );
};

const isCheckItem = (data: unknown): data is CheckItem => {
    return data != null && typeof (data as CheckItem).text === 'string';
};

const isArrayOfCheckItems = (data: unknown): data is CheckItem[] => {
    return Array.isArray(data) && data.every(isCheckItem);
};

const isCustomCheckItem = (data: unknown): data is CustomCheckItem => {
    return data != null && typeof (data as CustomCheckItem).text === 'string';
};

const isArrayOfCustomCheckItems = (
    data: unknown
): data is CustomCheckItem[] => {
    return Array.isArray(data) && data.every(isCustomCheckItem);
};

export const isChecklistResponse = (
    data: unknown
): data is ChecklistResponse => {
    return (
        data != null &&
        isArrayOfLoopTags((data as ChecklistResponse).loopTags) &&
        isChecklistDetails((data as ChecklistResponse).checkList) &&
        isArrayOfCheckItems((data as ChecklistResponse).checkItems) &&
        isArrayOfCustomCheckItems((data as ChecklistResponse).customCheckItems)
    );
};
