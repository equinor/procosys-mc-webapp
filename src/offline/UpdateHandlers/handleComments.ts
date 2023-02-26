import { OfflineContentRepository } from '../OfflineContentRepository';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { generateRandomId } from './utils';
import { EntityType } from '../../typings/enums';
import { IEntity } from '../IEntity';

const offlineContentRepository = new OfflineContentRepository();

export const handlePostComment = async (
    offlinePostRequest: OfflineUpdateRequest,
    params: URLSearchParams
): Promise<void> => {
    const plantId = params.get('plantId');
    const punchIdStr = params.get('punchItemId');
    const comment = offlinePostRequest.bodyData;
    const newCommentId = generateRandomId();
    if (punchIdStr === null) {
        console.error('The request parameters does not contain a punchId.');
        return;
        //todo: Hva gjør vi her?
    }

    const punchId = Number(punchIdStr);
    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    const apiPath = `PunchListItem/AddComment?plantId=PCS$${plantId}${apiVersion}`;

    //Create entity object and store in database
    const punchCommentEntity: IEntity = {
        entitytype: EntityType.PunchComment,
        apipath: apiPath,
        responseObj: comment,
        parententityid: punchId,
        entityid: newCommentId,
    };

    await offlineContentRepository.add(punchCommentEntity);
};
