import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { ChecklistResponse } from '../../services/apiTypes';
import { IEntity } from '../IEntity';
import { generateRandomId } from './utils';

const offlineContentRepository = new OfflineContentRepository();

type Dto = {
    CheckListId: string;
    CheckItemId: number;
};

/**
 * Update offline content database based on a post of checklist sign
 */
export const handleChecklistPostSign = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
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
export const handleChecklistPostUnSign = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
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
export const handleChecklistPostVerify = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
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
export const handleChecklistPostUnVerify = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
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
): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.ChecklistId)
    );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        const newCustomCheckItem = {
            id: generateRandomId(),
            itemNo: dto.ItemNo,
            text: dto.Text,
            isOk: dto.IsOk,
        };

        checklist.customCheckItems.push(newCustomCheckItem);
        await offlineContentRepository.replaceEntity(checklistEntity);
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
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
    );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        checklist.checkList.comment = dto.Comment;
    }
    await offlineContentRepository.replaceEntity(checklistEntity);
};
