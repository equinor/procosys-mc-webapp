import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { ChecklistResponse } from '../../services/apiTypes';
import { IEntity } from '../IEntity';
import { DotProgress } from '@equinor/eds-core-react';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { addRequestToOfflineUpdatesDb } from '../addUpdateRequestToDatabase';

const offlineContentRepository = new OfflineContentRepository();

type PostDto = {
    CheckListId: number;
    CustomCheckItemId: number;
};

/**
 * Update offline content database based on a post of set ok on custom checklist item
 */
export const handleCustomChecklistItemPostSetOK = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: PostDto = offlinePostRequest.bodyData;

    console.log('handleCustomChecklistItemPostSetOK', dto);
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
        await addRequestToOfflineUpdatesDb(dto.CheckListId, offlinePostRequest);
    }
};

/**
 * Update offline content database based on a post of set ok on custom checklist item
 */
export const handleCustomChecklistItemPostClear = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: PostDto = await offlinePostRequest.bodyData;

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.CheckListId)
        );

    const checklist: ChecklistResponse = await checklistEntity.responseObj;

    const customCheckitem = checklist.customCheckItems.find(
        (item) => item.id === dto.CustomCheckItemId
    );

    if (customCheckitem) {
        customCheckitem.isOk = false;
        await offlineContentRepository.replaceEntity(checklistEntity);
        await addRequestToOfflineUpdatesDb(dto.CheckListId, offlinePostRequest);
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
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const dto: DeleteDto = offlinePostRequest.bodyData;

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
        await addRequestToOfflineUpdatesDb(
            Number(dto.ChecklistId),
            offlinePostRequest
        );
    }
};
