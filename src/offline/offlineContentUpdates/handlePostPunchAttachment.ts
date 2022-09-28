import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { generateRandomId } from './utils';
import { Attachment } from '@equinor/procosys-webapp-components';
import { IEntity } from '../IEntity';

const offlineContentRepository = new OfflineContentRepository();

/**
 * Update offline content database based on a post of new punch.
 */
export const handlePostPunchAttachment = async (
    requestUrl: string,
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
