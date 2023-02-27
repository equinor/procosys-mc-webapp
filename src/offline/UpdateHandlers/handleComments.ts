import { OfflineContentRepository } from '../OfflineContentRepository';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { OfflineUpdateRepository } from '../OfflineUpdateRepository';
import { generateRandomId } from './utils';
import { EntityType } from '../../typings/enums';
import { IEntity } from '../IEntity';
import { APIComment } from '@equinor/procosys-webapp-components/dist/typings/apiTypes';

const offlineContentRepository = new OfflineContentRepository();
const offlineUpdateRepository = new OfflineUpdateRepository();

export const handlePostComment = async (
    offlinePostRequest: OfflineUpdateRequest,
    params: URLSearchParams
): Promise<void> => {
    const plantId = params.get('plantId');
    const { Text: comment, PunchItemId: punchIdStr } =
        offlinePostRequest.bodyData; // PunchId is stored in the body of the request
    const newCommentId = generateRandomId();
    const punchId = Number(punchIdStr);

    if (punchId === null) {
        console.error('The request parameters does not contain a punchId.');
        return;
        //todo: Hva gjør vi her?
    }

    const commentListEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.PunchComment,
            punchId
        );

    const newComment = {
        id: newCommentId,
        text: comment,
        firstName: '',
        lastName: '',
        createdAt: new Date(Date.now()).toLocaleString().split(',')[0],
    };

    const commentList: APIComment[] = commentListEntity.responseObj;
    const mainEntityId = commentListEntity.parententityid; //MC,Tag,PO or WO
    if (mainEntityId === undefined) {
        console.error(
            'Not able to find main punchlist based on entity on checklist punchlist.',
            commentList
        );
        return; // todo: feilhåndtering.
    }

    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    const apiPath = `PunchListItem/Comments?plantId=${plantId}&${apiVersion}`;

    //Create entity object and store in database
    const punchCommentEntity: IEntity = {
        entitytype: EntityType.PunchComment,
        apipath: apiPath,
        responseObj: commentList,
        parententityid: punchId,
        entityid: newCommentId,
    };

    commentList.unshift(newComment);
    commentListEntity.responseObj = commentList;
    await offlineContentRepository.replaceEntity(commentListEntity);

    await offlineUpdateRepository.addUpdateRequest(
        newCommentId,
        EntityType.PunchItem,
        offlinePostRequest
    );
};
