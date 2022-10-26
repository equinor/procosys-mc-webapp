import { PunchAction } from '@equinor/procosys-webapp-components';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';
import { handleNewPunch } from './offlineContentUpdates/handleNewPunch';
import {
    handleDeleteCheckListAttachment,
    handleDeletePunchAttachment,
    handleDeleteWorkOrderAttachment,
    handlePostChecklistAttachment,
    handlePostPunchAttachment,
    handlePostWorkOrderAttachment,
} from './offlineContentUpdates/handleAttachment';
import { handlePunchAction } from './offlineContentUpdates/handlePunchAction';
import { handleUpdatePunch } from './offlineContentUpdates/handleUpdatePunch';
import {
    handleChecklistItemPostClear,
    handleChecklistItemPostSetNA,
    handleChecklistItemPostSetOK,
    handleChecklistPutMetaTableCell,
} from './offlineContentUpdates/handleChecklistItem';
import {
    handleChecklistPostCustomCheckItem,
    handleChecklistPostSign,
    handleChecklistPostUnSign,
    handleChecklistPostUnVerify,
    handleChecklistPostVerify,
    handleChecklistPutComment,
} from './offlineContentUpdates/handleChecklist';
import {
    handleCustomChecklistItemDelete,
    handleCustomChecklistItemPostClear,
    handleCustomChecklistItemPostSetOK,
} from './offlineContentUpdates/handleCustomChecklistItem';

//************************************************************************************
// The functions here will handle update of offline database, on POST, PUT and DELETE.
//************************************************************************************

/**
 * When a POST/PUT/DELETE fetch is intercepted, and we are in offline mode, this method will be called, and will handle
 * necessary updates of the offline content database.
 *
 * Most of the update fetches returned void. However there are some fetches that might return e.g. a new generated id on an item.
 * Whatever json response that needs to be given, must be returned from this function.
 * @param offlinePostRequest  The intercepted fetch request object.
 */
export const updateOfflineContentDatabase = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void | any> => {
    console.log('updateOfflineContentDatabase', offlinePostRequest);
    const dummyUrl = new URL('http://dummy.no' + offlinePostRequest.url); //todo: Better way to find searchParams?
    const searchParams = dummyUrl.searchParams;
    const bodyData = offlinePostRequest.bodyData;

    const method = offlinePostRequest.method.toUpperCase();
    const url = offlinePostRequest.url;

    if (method == 'POST') {
        if (url.startsWith('PunchListItem?plantId')) {
            await handleNewPunch(
                offlinePostRequest.url,
                searchParams,
                bodyData
            );
        } else if (
            url.startsWith(`PunchListItem/${PunchAction.CLEAR}`) ||
            url.startsWith(`PunchListItem/${PunchAction.REJECT}`) ||
            url.startsWith(`PunchListItem/${PunchAction.UNCLEAR}`) ||
            url.startsWith(`PunchListItem/${PunchAction.UNVERIFY}`) ||
            url.startsWith(`PunchListItem/${PunchAction.VERIFY}`)
        ) {
            await handlePunchAction(offlinePostRequest.url, bodyData);
        } else if (url.startsWith('PunchListItem/Attachment')) {
            await handlePostPunchAttachment(searchParams, bodyData);
        } else if (url.startsWith('CheckList/Item/SetOk')) {
            await handleChecklistItemPostSetOK(bodyData);
        } else if (url.startsWith('CheckList/Item/SetNA')) {
            await handleChecklistItemPostSetNA(bodyData);
        } else if (url.startsWith('CheckList/Item/Clear')) {
            await handleChecklistItemPostClear(bodyData);
        } else if (url.startsWith('CheckList/MC/Sign')) {
            await handleChecklistPostSign(bodyData);
        } else if (url.startsWith('CheckList/MC/Unsign')) {
            await handleChecklistPostUnSign(bodyData);
        } else if (url.startsWith('CheckList/MC/Verify')) {
            await handleChecklistPostVerify(bodyData);
        } else if (url.startsWith('CheckList/MC/Unverify')) {
            await handleChecklistPostUnVerify(bodyData);
        } else if (url.startsWith('CheckList/CustomItem?plantId')) {
            return await handleChecklistPostCustomCheckItem(bodyData);
        } else if (url.startsWith('CheckList/CustomItem/SetOk')) {
            await handleCustomChecklistItemPostSetOK(bodyData);
        } else if (url.startsWith('CheckList/CustomItem/Clear')) {
            await handleCustomChecklistItemPostClear(bodyData);
        } else if (url.startsWith('CheckList/Attachment')) {
            await handlePostChecklistAttachment(searchParams, bodyData);
        } else if (url.startsWith('WorkOrder/Attachment')) {
            await handlePostWorkOrderAttachment(searchParams, bodyData);
        }
    } else if (method == 'PUT') {
        //putUpdatePunch
        if (url.startsWith('PunchListItem/')) {
            await handleUpdatePunch(bodyData);
        } else if (url.startsWith('CheckList/MC/Comment')) {
            await handleChecklistPutComment(bodyData);
        } else if (
            url.startsWith('CheckList/Item/MetaTableCell') ||
            url.startsWith('CheckList/Item/MetaTableCellDate')
        ) {
            await handleChecklistPutMetaTableCell(bodyData);
        }
    } else if (method == 'DELETE') {
        if (url.startsWith('CheckList/CustomItem?plantId')) {
            await handleCustomChecklistItemDelete(bodyData);
        } else if (url.startsWith('WorkOrder/Attachment')) {
            await handleDeleteWorkOrderAttachment(bodyData);
        } else if (url.startsWith('PunchListItem/Attachment')) {
            await handleDeletePunchAttachment(bodyData);
        } else if (url.startsWith('CheckList/Attachment')) {
            await handleDeleteCheckListAttachment(bodyData);
        }
    } else {
        console.error(
            'No handler was found to handle offline updates for ',
            offlinePostRequest.url
        );
    }
};
