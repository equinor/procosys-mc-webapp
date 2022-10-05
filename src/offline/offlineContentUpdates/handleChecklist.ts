import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { ChecklistResponse } from '../../services/apiTypes';
import { IEntity } from '../IEntity';
import { generateRandomId } from './utils';

const offlineContentRepository = new OfflineContentRepository();

/**
 * Update offline content database based on a post of checklist sign
 */
export const handleChecklistPostSign = async (
    checklistId: number
): Promise<void> => {
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            checklistId
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.signedAt = new Date();
        checklist.checkList.signedByFirstName = '<offline user>';
        checklist.checkList.signedByLastName = '<offline user>';
        checklist.checkList.signedByUser = '<offline user>';
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of checklist unsign
 */
export const handleChecklistPostUnSign = async (
    checklistId: number
): Promise<void> => {
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(checklistId)
        );
    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.signedAt = null;
        checklist.checkList.signedByFirstName = null;
        checklist.checkList.signedByLastName = null;
        checklist.checkList.signedByUser = null;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of checklist verify
 */
export const handleChecklistPostVerify = async (
    checklistId: number
): Promise<void> => {
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(checklistId)
        );
    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.verifiedAt = new Date();
        checklist.checkList.verifiedByFirstName = '<offline user>';
        checklist.checkList.verifiedByLastName = '<offline user>';
        checklist.checkList.verifiedByUser = '<offline user>';
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of checklist unverify
 */
export const handleChecklistPostUnVerify = async (
    checklistId: number
): Promise<void> => {
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(checklistId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.verifiedAt = null;
        checklist.checkList.verifiedByFirstName = null;
        checklist.checkList.verifiedByLastName = null;
        checklist.checkList.verifiedByUser = null;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

type CustomCheckItemDto = {
    ItemNo: string;
    Text: string;
    IsOk: boolean;
    ChecklistId: string;
};

/**
 * Update offline content database based on a post of custom checkitem
 */
export const handleChecklistPostCustomCheckItem = async (
    dto: CustomCheckItemDto
): Promise<void | { id: number }> => {
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.ChecklistId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        const id = generateRandomId();
        const newCustomCheckItem = {
            id: id,
            itemNo: dto.ItemNo,
            text: dto.Text,
            isOk: dto.IsOk,
        };

        checklist.customCheckItems.push(newCustomCheckItem);
        await offlineContentRepository.replaceEntity(checklistEntity);
        return { id: id };
    }
};

type ChecklistCommentDto = {
    CheckListId: number;
    Comment: string;
};

/**
 * Update offline content database based on a put of checklist comment
 */
export const handleChecklistPutComment = async (
    dto: ChecklistCommentDto
): Promise<void> => {
    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(dto.CheckListId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.comment = dto.Comment;
    }
    await offlineContentRepository.replaceEntity(checklistEntity);
};
