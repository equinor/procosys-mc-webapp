import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { ChecklistResponse } from '../../services/apiTypes';
import { IEntity } from '../IEntity';

const offlineContentRepository = new OfflineContentRepository();

type Dto = {
    CheckListId: string;
    CheckItemId: number;
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistItemPostSetOK = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
    );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const checkitem = checklist.checkItems.find(
        (item) => item.id === dto.CheckItemId
    );

    if (checkitem) {
        checkitem.isOk = true;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistItemPostSetNA = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
    );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const checkitem = checklist.checkItems.find(
        (item) => item.id === dto.CheckItemId
    );

    if (checkitem) {
        checkitem.isNotApplicable = true;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistItemPostClear = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
    );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const checkitem = checklist.checkItems.find(
        (item) => item.id === dto.CheckItemId
    );

    if (checkitem) {
        checkitem.isNotApplicable = false;
        checkitem.isOk = false;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};
