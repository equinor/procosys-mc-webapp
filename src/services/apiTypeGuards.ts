import { SearchType } from '@equinor/procosys-webapp-components';
import { SavedSearchType } from '../typings/enums';
import {
    ChecklistDetails,
    ChecklistResponse,
    ChecklistSavedSearchResult,
    CustomCheckItem,
    LoopTag,
    McPkgPreview,
    Person,
    PoPreview,
    PunchItemSavedSearchResult,
    Tag,
    WoPreview,
} from './apiTypes';
import { CheckItem } from '@equinor/procosys-webapp-components/dist/typings/apiTypes';

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
    if (varToBeChecked === undefined) return false;
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

// SAVED SEARCH
export const isCorrectSavedSearchResults = (
    data: unknown,
    savedSearchType: string
): data is ChecklistSavedSearchResult[] | PunchItemSavedSearchResult[] => {
    if (savedSearchType === SavedSearchType.CHECKLIST) {
        return isArrayOfType<ChecklistSavedSearchResult>(
            data,
            'projectDescription'
        );
    } else if (savedSearchType === SavedSearchType.PUNCH) {
        return isArrayOfType<PunchItemSavedSearchResult>(data, 'isCleared');
    } else {
        return false;
    }
};

// SCOPE
export const isCorrectDetails = (
    data: unknown,
    searchType: string
): data is McPkgPreview | WoPreview | Tag => {
    if (searchType === SearchType.MC) {
        return isOfType<McPkgPreview>(data, 'mcPkgNo');
    } else if (searchType === SearchType.WO) {
        return isOfType<WoPreview>(data, 'workOrderNo');
    } else if (searchType === SearchType.Tag) {
        return isOfType<Tag>(data, 'tag');
    } else if (searchType === SearchType.PO) {
        return isOfType<PoPreview>(data, 'callOffId');
    } else {
        return false;
    }
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
    return (
        data != null && typeof (data as CheckItem).hasMetaTable === 'boolean'
    );
};

const isArrayOfCheckItems = (data: unknown): data is CheckItem[] => {
    return Array.isArray(data) && data.every(isCheckItem);
};

const isCustomCheckItem = (data: unknown): data is CustomCheckItem => {
    return data != null && typeof (data as CustomCheckItem).isOk === 'boolean';
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
