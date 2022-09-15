import { CompletionStatus, PunchCategory } from '../../services/apiTypes';
import { EntityType } from '../../typings/enums';
import { OfflineContentRepository } from '../OfflineContentRepository';

const offlineContentRepository = new OfflineContentRepository();

/**
 * Find the completion status code based on punch category id
 */
export const getCompletionStatusByCategory = async (
    categoryId: number
): Promise<CompletionStatus> => {
    const entity = await offlineContentRepository.getEntity(
        EntityType.PunchCategories
    );
    const categories: PunchCategory[] = entity.responseObj;
    const category = categories.find((category) => (category.id = categoryId));
    return category ? (category.code as CompletionStatus) : CompletionStatus.PA;
};

/**
 * We will get a floating number between 0 and 1. This should ensure that we don't get an id already in use.
 */
export const generateRandomId = (): number => {
    return Math.random();
};
