import { OfflineContentRepository } from '../OfflineContentRepository';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { OfflineUpdateRepository } from '../OfflineUpdateRepository';
import { generateRandomId } from './utils';
import { EntityType } from '../../typings/enums';
import { APIComment } from '@equinor/procosys-webapp-components';

const offlineContentRepository = new OfflineContentRepository();
const offlineUpdateRepository = new OfflineUpdateRepository();

export const handlePostComment = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
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
            EntityType.PunchComments,
            punchId
        );

    const newComment: APIComment = {
        createdAt: new Date(),
        createdAtUtc: new Date(),
        firstName: 'John',
        lastName: 'Doe',
        text: comment,
        id: newCommentId,
        guid: 'some-guid',
        createdBy: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            userName: 'johndoe',
            emailAddress: 'john.doe@example.com',
            officePhoneNo: null,
            mobilePhoneNo: null,
            isVoided: false,
            nameAndUserNameAsString: 'John Doe (johndoe)',
            fullName: 'John Doe',
            fullNameFormal: 'Doe, John',
        },
    };

    const commentList: APIComment[] = commentListEntity.responseObj;
    const mainEntityId = commentListEntity.parententityid; //MC,Tag,PO or WO
    if (mainEntityId === undefined) {
        console.error('Not able to find', commentList);
        return; // todo: feilhåndtering.
    }

    commentList.unshift(newComment);
    commentListEntity.responseObj = commentList;
    await offlineContentRepository.replaceEntity(commentListEntity);

    await offlineUpdateRepository.addUpdateRequest(
        punchId,
        EntityType.PunchItem,
        offlinePostRequest
    );
};
