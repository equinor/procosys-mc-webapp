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
    Tag,
} from './apiTypes';

export class TypeguardError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'An error occured (Unexpected type)';
    }
}

export const isOfType = <T>(
    varToBeChecked: unknown,
    propertyToCheckFor: keyof T
): varToBeChecked is T => {
    return (varToBeChecked as T)[propertyToCheckFor] !== undefined;
};

export const isArrayOfType = <T>(
    dataToBeChecked: unknown,
    propertyToCheckFor: keyof T
): dataToBeChecked is T[] => {
    return (
        Array.isArray(dataToBeChecked) &&
        dataToBeChecked.every((item) => isOfType<T>(item, propertyToCheckFor))
    );
};

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

const isPerson = (data: unknown): data is Person => {
    return data != null && typeof (data as Person).firstName === 'string';
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

// Tag
export const isTagResponse = (data: unknown): data is Tag => {
    return (
        (data != null &&
            typeof (data as Tag).tag.disciplineCode === 'string') ||
        typeof (data as Tag).tag.disciplineCode === null
    );
};
