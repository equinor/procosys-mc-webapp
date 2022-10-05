import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { ChecklistResponse } from '../../services/apiTypes';
import { IEntity } from '../IEntity';

const offlineContentRepository = new OfflineContentRepository();

type PostDto = {
    CheckListId: number;
    CustomCheckItemId: number;
};

/**
 * Update offline content database based on a post of set ok on custom checklist item
 */
export const handleCustomChecklistItemPostSetOK = async (
    dto: any
): Promise<void> => {
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.CheckListId)
        );
    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const customCheckitem = checklist.customCheckItems.find(
        (item) => item.id === dto.CustomCheckItemId
    );

    if (customCheckitem) {
        customCheckitem.isOk = true;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of set ok on custom checklist item
 */
export const handleCustomChecklistItemPostClear = async (
    dto: PostDto
): Promise<void> => {
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.CheckListId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const customCheckitem = checklist.customCheckItems.find(
        (item) => item.id === dto.CustomCheckItemId
    );

    if (customCheckitem) {
        customCheckitem.isOk = false;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

type DeleteDto = {
    ChecklistId: string;
    CustomCheckItemId: number;
};

/**
 * Update offline content database based on a deletion of custom checklist item
 */
export const handleCustomChecklistItemDelete = async (
    dto: DeleteDto
): Promise<void> => {
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.ChecklistId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;
    const customCheckitemIndex = checklist.customCheckItems.findIndex(
        (item) => item.id === dto.CustomCheckItemId
    );

    if (customCheckitemIndex > -1) {
        checklist.customCheckItems.splice(customCheckitemIndex, 1);
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};
