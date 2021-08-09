import { ChecklistPreview, PunchPreview } from '../../services/apiTypes';
import {
    filterChecklistPreviewsOnSignature,
    filterOnFormType,
    filterOnResponsible,
    filterOnStatus,
    filterPunchPreviewsOnSignature,
} from './helperFunctions';
import { Filter } from './useFilterFacade';

export const filterChecklistPreviews = (
    checklistPreviews: ChecklistPreview[],
    filter: Filter
): { filtered: ChecklistPreview[]; filterCount: number } => {
    let filtered = checklistPreviews;
    let filterCount = 0;
    if (filter.status.length > 0) {
        filtered = filterOnStatus(filtered, filter.status);
        filterCount++;
    }
    if (filter.signature) {
        filtered = filterChecklistPreviewsOnSignature(
            filtered,
            filter.signature
        );
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
