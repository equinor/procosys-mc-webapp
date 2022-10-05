import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { generateRandomId } from './utils';
import { Attachment } from '@equinor/procosys-webapp-components';
import { IEntity } from '../IEntity';
import { isArrayOfType, isOfType } from '../../services/apiTypeGuards';

const offlineContentRepository = new OfflineContentRepository();

const addNewAttachment = async (
    attachmentListEntity: IEntity,
    newAttachmentId: number,
    title: string | null
): Promise<void> => {
    if (!isOfType<IEntity>(attachmentListEntity, 'responseObj')) {
        console.error(
            'Was not able to find checklist attachment list in offline database.',
            newAttachmentId
        );
        return;
        //todo: error handling
    }
    const attachmentList: Attachment[] = attachmentListEntity.responseObj;

    if (!isArrayOfType<Attachment>(attachmentList, 'title')) {
        console.error(
            'Response object was not array of Attachment.',
            attachmentListEntity
        );
    }

    const attachment: Attachment = {
        id: newAttachmentId,
        uri: '',
        title: title ? title : '',
        createdAt: new Date(),
        classification: '',
        mimeType: '',
        thumbnailAsBase64: '',
        hasFile: true,
        fileName: title ? title : '',
    };
    attachmentList.push(attachment);
    await offlineContentRepository.replaceEntity(attachmentListEntity);
};

/**
 * Update offline content database based on a post of new punch attachment.
 */
export const handlePostPunchAttachment = async (
    params: URLSearchParams,
    bodyData: any
): Promise<void> => {
    const plantId = params.get('plantId');
    const title = params.get('title');
    const punchId = params.get('punchItemId');
    const blob: Blob = bodyData[0];

    //Construct url for new punch attachment
    const newAttachmentId = generateRandomId();
    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    const apiPath = `PunchListItem/Attachment?plantId=${plantId}&punchItemId=${punchId}&attachmentId=${newAttachmentId}&${apiVersion}`;

    //Create entity object and store in database
    const punchAttachmentEntity: IEntity = {
        entitytype: EntityType.PunchAttachment,
        entityid: newAttachmentId,
        parententityid: punchId ? Number(punchId) : undefined,
        responseObj: blob,
        apipath: apiPath,
    };

    await offlineContentRepository.add(punchAttachmentEntity);

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.PunchAttachments,
            Number(punchId)
        );
    await addNewAttachment(attachmentListEntity, newAttachmentId, title);
    //todo: Må oppdatere punch listen også, med attachmentCount
};

/**
 * Update offline content database based on a post of new work order attachment.
 */
export const handlePostWorkOrderAttachment = async (
    params: URLSearchParams,
    bodyData: any
): Promise<void> => {
    const plantId = params.get('plantId');
    const title = params.get('title');
    const workOrderId = params.get('workOrderId');
    const blob: Blob = bodyData[0];

    //Construct url for new punch attachment
    const newAttachmentId = generateRandomId();
    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    const apiPath = `WorkOrder/Attachment?plantId=${plantId}&workOrderId=${workOrderId}&attachmentId=${newAttachmentId}&${apiVersion}`;

    //Create entity object and store in database
    const workOrderAttachmentEntity: IEntity = {
        entitytype: EntityType.WorkOrderAttachment,
        entityid: newAttachmentId,
        parententityid: workOrderId ? Number(workOrderId) : undefined,
        responseObj: blob,
        apipath: apiPath,
    };

    await offlineContentRepository.add(workOrderAttachmentEntity);

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.WorkOrderAttachments,
            Number(workOrderId)
        );
    await addNewAttachment(attachmentListEntity, newAttachmentId, title);
    //todo: Må oppdatere punch listen også, med attachmentCount
};

/**
 * Update offline content database based on a post of new checklist attachment.
 */
export const handlePostChecklistAttachment = async (
    params: URLSearchParams,
    bodyData: any
): Promise<void> => {
    const plantId = params.get('plantId');
    const title = params.get('title');
    const checklistId = params.get('checkListId');
    const blob: Blob = bodyData[0];

    //Construct url for new punch attachment
    const newAttachmentId = generateRandomId();
    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    const apiPath = `CheckList/Attachment?plantId=${plantId}&checkListId=${checklistId}&attachmentId=${newAttachmentId}&${apiVersion}`;

    //Create entity object and store in database
    const checklistAttachmentEntity: IEntity = {
        entitytype: EntityType.ChecklistAttachment,
        entityid: newAttachmentId,
        parententityid: checklistId ? Number(checklistId) : undefined,
        responseObj: blob,
        apipath: apiPath,
    };

    await offlineContentRepository.add(checklistAttachmentEntity);

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.ChecklistAttachments,
            Number(checklistId)
        );
    await addNewAttachment(attachmentListEntity, newAttachmentId, title);
    //todo: Må oppdatere punch listen også, med attachmentCount
};

/**
 * Deletes an attachment from an attatchment list and updates the response in the offline database
 */
const deleteAttachmentFromList = async (
    attachmentListEntity: IEntity,
    attachmentId: number
): Promise<void> => {
    if (!isOfType<IEntity>(attachmentListEntity, 'responseObj')) {
        console.error(
            'Was not able to find checklist attachment list in offline database.',
            attachmentId
        );
        //todo: Må sørge for at bruker for feilmelding.
        return;
    }
    const attachmentList: Attachment[] = attachmentListEntity.responseObj;

    if (!isArrayOfType<Attachment>(attachmentList, 'title')) {
        console.error(
            'Response object was not array of Attachment.',
            attachmentListEntity
        );
    }

    const indexOfAttachment = attachmentList.findIndex(
        (attachment) => attachment.id === attachmentId
    );

    if (indexOfAttachment > -1) {
        attachmentList.splice(indexOfAttachment, 1);

        await offlineContentRepository.replaceEntity(attachmentListEntity);
    } else {
        console.error(
            'Did not find the attachment in the checklist attachment list.',
            attachmentListEntity,
            attachmentId
        );
        //todo: Må sørge for at bruker for feilmelding.
    }
};

type DeleteWOAttachmentDto = {
    workOrderId: number;
    AttachmentId: number;
};

/**
 * Update offline content database based on delete of work order attachment.
 */
export const handleDeleteWorkOrderAttachment = async (
    bodyData: any
): Promise<void> => {
    const dto: DeleteWOAttachmentDto = bodyData;

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.WorkOrderAttachments,
            Number(dto.workOrderId)
        );

    await deleteAttachmentFromList(attachmentListEntity, dto.AttachmentId);
};

type DeletePunchAttachmentDto = {
    PunchItemId: number;
    AttachmentId: number;
};

/**
 * Update offline content database based on a delete of punch attachment.
 */
export const handleDeletePunchAttachment = async (
    bodyData: any
): Promise<void> => {
    const dto: DeletePunchAttachmentDto = bodyData;

    //Update attachment list on punch
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.PunchAttachments,
            Number(dto.PunchItemId)
        );
    await deleteAttachmentFromList(attachmentListEntity, dto.AttachmentId);
};

type DeleteChecklistAttachmentDto = {
    CheckListId: number;
    AttachmentId: number;
};

export const handleDeleteCheckListAttachment = async (
    bodyData: any
): Promise<void> => {
    const dto: DeleteChecklistAttachmentDto = bodyData;

    //Update attachment list
    const attachmentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.ChecklistAttachments,
            Number(dto.CheckListId)
        );

    await deleteAttachmentFromList(attachmentListEntity, dto.AttachmentId);
};
