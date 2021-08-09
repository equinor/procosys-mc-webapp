import { PunchPreview } from '../../services/apiTypes';
import {
    filterOnFormType,
    filterOnResponsible,
    filterOnStatus,
    filterPunchPreviewsOnSignature,
} from './helperFunctions';
import { Filter } from './useFilterFacade';

export const filterPunchPreviews = (
    punchPreviews: PunchPreview[],
    filter: Filter
): { filtered: PunchPreview[]; filterCount: number } => {
    let filtered = punchPreviews;
    let filterCount = 0;
    if (filter.status.length > 0) {
        filtered = filterOnStatus(filtered, filter.status);
        filterCount++;
    }
    if (filter.signature) {
        filtered = filterPunchPreviewsOnSignature(filtered, filter.signature);
        filterCount++;
    }
    if (filter.responsible) {
        filtered = filterOnResponsible(filtered, filter.responsible);
        filterCount++;
    }
    if (filter.formType) {
        filtered = filterOnFormType(filtered, filter.formType);
        filterCount++;
    }
    return { filtered, filterCount };
};
