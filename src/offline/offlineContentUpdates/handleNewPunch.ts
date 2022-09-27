import { IEntity } from '../IEntity';
import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import {
    Attachment,
    NewPunch,
    PunchItem,
    PunchPreview,
} from '../../services/apiTypes';
import {
    generateRandomId,
    getCompletionStatusByCategory,
    getPunchOrganizationById,
    getPunchPriorityById,
    getPunchSortingById,
    getPunchTypeById,
} from './utils';

const offlineContentRepository = new OfflineContentRepository();

/**
 * Update offline content database based on a post of new punch.
 */
export const handleNewPunch = async (
    requestUrl: string,
    params: URLSearchParams,
    newPunch: NewPunch
): Promise<void> => {
    const plantId = params.get('plantId');

    //Get checklist punchlist
    const checklistPunchlistEntity = await offlineContentRepository.getEntity(
        EntityType.ChecklistPunchlist,
        newPunch.CheckListId
    );

    const checklistPunchlist: PunchPreview[] =
        checklistPunchlistEntity.responseObj;

    const mainEntityId = checklistPunchlistEntity.parententityid; //MC,Tag,PO or WO

    //Get main punchlist
    const mainPunchlistEntity = await offlineContentRepository.getEntity(
        EntityType.Punchlist,
        mainEntityId
    );
    const mainPunchList: PunchPreview[] = mainPunchlistEntity.responseObj;

    //Get some information about tag
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

    //Construct url for new PunchlistItem
    const newPunchItemId = generateRandomId();
    const apiVersion = 'api-version=4.1'; //hvor får vi denne fra?
    //const host = 'https://pcs-main-api-dev.azurewebsites.net';
    const newPunchItemUrl = `PunchListItem?plantId=${plantId}&punchItemId=${newPunchItemId}&${apiVersion}`;

    //Create respons object and add new punch item to database
    const completionStatus = await getCompletionStatusByCategory(
        newPunch.CategoryId
    );

    const raisedByOrganization = await getPunchOrganizationById(
        newPunch.RaisedByOrganizationId
    );

    const clearingByOrganization = await getPunchOrganizationById(
        newPunch.ClearingByOrganizationId
    );
    const type = newPunch.TypeId
        ? await getPunchTypeById(newPunch.TypeId)
        : null;
    const priority = newPunch.PriorityId
        ? await getPunchPriorityById(newPunch.PriorityId)
        : null;
    const sorting = newPunch.SortingId
        ? await getPunchSortingById(newPunch.SortingId)
        : null;

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
        clearingByCode: clearingByOrganization?.code ?? '',
        clearingByDescription: clearingByOrganization?.description ?? '',
        description: newPunch.Description,
        dueDate: newPunch.DueDate,
        estimate: newPunch.Estimate,
        formularType: '',
        id: newPunchItemId,
        isRestrictedForUser: false, //??
        materialEta: null,
        materialNo: null,
        materialRequired: false, //??
        priorityCode: priority ? priority.code : null,
        priorityDescription: priority ? priority.description : null,
        priorityId: priority ? priority.id : null,
        raisedByCode: raisedByOrganization?.code ?? '',
        raisedByDescription: raisedByOrganization?.description ?? '',
        rejectedAt: null,
        rejectedByFirstName: null,
        rejectedByLastName: null,
        rejectedByUser: null,
        responsibleCode: '',
        responsibleDescription: '',
        sorting: sorting ? sorting.description : null,
        status: completionStatus,
        statusControlledBySwcr: false,
        systemModule: '',
        tagDescription: tagDescription,
        tagId: tagId,
        tagNo: tagNo,
        typeCode: type ? type.code : '',
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

    // Add empty attachment list for the new punch item
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

    // Add the new punch item to the checklist punchlist and replace the object in the offline content database.
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

    //Add the new punch item to the main punchlist and replace the object in the offline content database
    mainPunchList.push(newPunchReview);
    mainPunchlistEntity.responseObj = mainPunchList;
    offlineContentRepository.replaceEntity(mainPunchlistEntity);
};
