import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { generateRandomId } from './utils';
import { Attachment } from '@equinor/procosys-webapp-components';
import { IEntity } from '../IEntity';

const offlineContentRepository = new OfflineContentRepository();

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
    const attachmentListEntity = await offlineContentRepository.getEntity(
        EntityType.PunchAttachments,
        Number(punchId)
    );
    const attachmentList: Attachment[] = attachmentListEntity.responseObj;

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
        entitytype: EntityType.PunchAttachment,
        entityid: newAttachmentId,
        parententityid: workOrderId ? Number(workOrderId) : undefined,
        responseObj: blob,
        apipath: apiPath,
    };

    await offlineContentRepository.add(workOrderAttachmentEntity);

    //Update attachment list
    const attachmentListEntity = await offlineContentRepository.getEntity(
        EntityType.WorkOrderAttachments,
        Number(workOrderId)
    );
    const attachmentList: Attachment[] = attachmentListEntity.responseObj;

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

    //todo: Må oppdatere punch listen også, med attachmentCount
};

/**
 * Deletes an attachment from an attatchment list and updates the response in the offline database
 */
const deleteAttachmentFromList = async (
    attachmentListEntity: IEntity,
    attachmentId: number
): Promise<void> => {
    const attachmentList: Attachment[] = attachmentListEntity.responseObj;

    const indexOfAttachment = attachmentList.findIndex(
        (attachment: Attachment) => {
            attachment.id == attachmentId;
        }
    );

    attachmentList.splice(indexOfAttachment);

    await offlineContentRepository.replaceEntity(attachmentListEntity);
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
    const attachmentListEntity = await offlineContentRepository.getEntity(
        EntityType.WorkOrderAttachments,
        Number(dto.workOrderId)
    );

    await deleteAttachmentFromList(attachmentListEntity, dto.AttachmentId);
};

type DeletePunchAttachmentDto = {
    workOrderId: number;
    AttachmentId: number;
};

/**
 * Update offline content database based on a delete of punch attachment.
 */
export const handleDeletePunchAttachment = async (
    bodyData: any
): Promise<void> => {
    const dto: DeletePunchAttachmentDto = bodyData;

    //Update attachment list
    const attachmentListEntity = await offlineContentRepository.getEntity(
        EntityType.PunchAttachments,
        Number(dto.workOrderId)
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
    const attachmentListEntity = await offlineContentRepository.getEntity(
        EntityType.ChecklistAttachment,
        Number(dto.CheckListId)
    );

    await deleteAttachmentFromList(attachmentListEntity, dto.AttachmentId);
};
