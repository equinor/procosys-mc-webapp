import { IEntity } from '../IEntity';
import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType, SearchType } from '../../typings/enums';
import {
    Attachment,
    NewPunch,
    PunchItem,
    PunchPreview,
} from '../../services/apiTypes';
import { generateRandomId, getCompletionStatusByCategory } from './utils';

const offlineContentRepository = new OfflineContentRepository();

export const handleNewPunch = async (
    requestUrl: string,
    params: URLSearchParams,
    bodyData: any
): Promise<void> => {
    console.log('HandleNewPunch');

    const plantId = params.get('plantId');
    const newPunch = bodyData as NewPunch;

    //Get punchlist and get some information about tag
    const checklistPunchlistEntity = await offlineContentRepository.getEntity(
        EntityType.ChecklistPunchlist,
        newPunch.CheckListId
    );

    const checklistPunchlist: PunchPreview[] =
        checklistPunchlistEntity.responseObj;

    let tagNo = '';
    let tagDescription = '';
    let tagId = 0;
    let callOffNo = undefined;

    if (checklistPunchlist.length > 0) {
        tagId = checklistPunchlist[0].tagId;
        tagDescription = checklistPunchlist[0].tagDescription;
        tagNo = checklistPunchlist[0].tagNo;
        callOffNo = checklistPunchlist[0].callOffNo;
    }
    const completionStatus = await getCompletionStatusByCategory(
        newPunch.CategoryId
    );

    //Construct url for new PunchlistItem
    const newPunchItemId = generateRandomId();
    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    //const host = 'https://pcs-main-api-dev.azurewebsites.net';
    const newPunchItemUrl = `PunchListItem?plantId=${plantId}&punchItemId=${newPunchItemId}&${apiVersion}`;

    //Create respons object and add punch to database
    const responseObj: PunchItem = {
        actionByPerson: newPunch.ActionByPerson,
        actionByPersonFirstName: null,
        actionByPersonLastName: null,
        attachmentCount: 0,
        checklistId: newPunch.CheckListId,
        clearedAt: null,
        clearedByFirstName: null,
        clearedByLastName: null,
        clearedByUser: null,
        clearingByCode: '',
        clearingByDescription: '',
        description: newPunch.Description,
        dueDate: newPunch.DueDate,
        estimate: newPunch.Estimate,
        formularType: '',
        id: newPunchItemId,
        isRestrictedForUser: false, //??
        materialEta: null,
        materialNo: null,
        materialRequired: false, //??
        priorityCode: null,
        priorityDescription: null,
        priorityId: null,
        raisedByCode: '',
        raisedByDescription: '',
        rejectedAt: null,
        rejectedByFirstName: null,
        rejectedByLastName: null,
        rejectedByUser: null,
        responsibleCode: '',
        responsibleDescription: '',
        sorting: null,
        status: completionStatus,
        statusControlledBySwcr: false,
        systemModule: '',
        tagDescription: tagDescription,
        tagId: tagId,
        tagNo: tagNo,
        typeCode: '',
        typeDescription: '',
        verifiedAt: null,
        verifiedByFirstName: null,
        verifiedByLastName: null,
        verifiedByUser: null,
    };

    const punchEntity: IEntity = {
        entitytype: EntityType.PunchItem,
        entityid: newPunchItemId,
        parententityid: newPunch.CheckListId,
        responseObj: responseObj,
        apipath: newPunchItemUrl,
    };

    await offlineContentRepository.add(punchEntity);

    // Add empty attachment list for the punch item
    const punchAttachmentsUrl = `PunchListItem/Attachments?plantId=${plantId}&punchItemId=${newPunchItemId}&thumbnailSize=128&${apiVersion}`;
    const attachmentsResponseObj: Attachment[] = [];
    const attachmentsEntity: IEntity = {
        entitytype: EntityType.PunchAttachments,
        entityid: newPunchItemId,
        parententityid: newPunch.CheckListId,
        responseObj: attachmentsResponseObj,
        apipath: punchAttachmentsUrl,
    };
    await offlineContentRepository.add(attachmentsEntity);

    // Add the new punchitem to the punchlist and replace the object in the offline content database.
    const newPunchReview = {
        id: responseObj.id,
        status: completionStatus,
        description: responseObj.description,
        systemModule: responseObj.systemModule,
        tagDescription: responseObj.tagDescription,
        tagId: responseObj.tagId,
        tagNo: responseObj.tagNo,
        formularType: responseObj.formularType,
        responsibleCode: responseObj.responsibleCode,
        isRestrictedForUser: responseObj.isRestrictedForUser,
        cleared: false,
        rejected: false,
        verified: false,
        statusControlledBySwcr: responseObj.statusControlledBySwcr,
        attachmentCount: responseObj.attachmentCount,
        callOffNo: callOffNo,
    };

    checklistPunchlist.push(newPunchReview);
    checklistPunchlistEntity.responseObj = checklistPunchlist;

    offlineContentRepository.replaceEntity(checklistPunchlistEntity);
};
