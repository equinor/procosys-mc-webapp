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
export const handleChecklistPostSetOK = async (dto: Dto): Promise<void> => {
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
        offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistPostSetNA = async (dto: Dto): Promise<void> => {
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
        offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistPostClear = async (dto: Dto): Promise<void> => {
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
        offlineContentRepository.replaceEntity(checklistEntity);
    }
};
