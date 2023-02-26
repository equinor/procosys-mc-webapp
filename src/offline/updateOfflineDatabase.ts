import { PunchAction } from '@equinor/procosys-webapp-components';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';
import { handleNewPunch } from './UpdateHandlers/handleNewPunch';
import {
    handleDeleteCheckListAttachment,
    handleDeletePunchAttachment,
    handleDeleteWorkOrderAttachment,
    handlePostChecklistAttachment,
    handlePostPunchAttachment,
    handlePostWorkOrderAttachment,
} from './UpdateHandlers/handleAttachment';
import { handlePunchAction } from './UpdateHandlers/handlePunchAction';
import { handleUpdatePunch } from './UpdateHandlers/handleUpdatePunch';
import {
    handleChecklistItemPostClear,
    handleChecklistItemPostSetNA,
    handleChecklistItemPostSetOK,
    handleChecklistPutMetaTableCell,
} from './UpdateHandlers/handleChecklistItem';
import {
    handleChecklistPostCustomCheckItem,
    handleChecklistPostSign,
    handleChecklistPostUnSign,
    handleChecklistPostUnVerify,
    handleChecklistPostVerify,
    handleChecklistPutComment,
} from './UpdateHandlers/handleChecklist';
import {
    handleCustomChecklistItemDelete,
    handleCustomChecklistItemPostClear,
    handleCustomChecklistItemPostSetOK,
} from './UpdateHandlers/handleCustomChecklistItem';
import { handlePostComment } from './UpdateHandlers/handleComments';

//************************************************************************************
// The functions here will handle update of offline database, on POST, PUT and DELETE.
//************************************************************************************

/**
 * When a POST/PUT/DELETE fetch is intercepted, and we are in offline mode, this method will be called.
 * Necessary updates to the offline content database will done, and the request will be added to offlineUpdatesDatabase.
 *
 * Most of the update-fetches are implemented to return void. However there are some fetches that might return e.g. a new generated id on an item.
 * Whatever json response that needs to be given, must be returned from this function.
 * @param offlinePostRequest  The intercepted fetch request object.
 */
export const updateOfflineDatabase = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void | any> => {
    const dummyUrl = new URL('http://dummy.no' + offlinePostRequest.url); //todo: Better way to find searchParams?
    const searchParams = dummyUrl.searchParams;
    //const bodyData = offlinePostRequest.bodyData;

    const method = offlinePostRequest.method.toUpperCase();
    const url = offlinePostRequest.url;

    // TODO: add handler for postTempPunchAttachment

    if (method == 'POST') {
        if (url.startsWith('PunchListItem?plantId')) {
            return await handleNewPunch(offlinePostRequest, searchParams);
        } else if (
            url.startsWith(`PunchListItem/${PunchAction.CLEAR}`) ||
            url.startsWith(`PunchListItem/${PunchAction.REJECT}`) ||
            url.startsWith(`PunchListItem/${PunchAction.UNCLEAR}`) ||
            url.startsWith(`PunchListItem/${PunchAction.UNVERIFY}`) ||
            url.startsWith(`PunchListItem/${PunchAction.VERIFY}`)
        ) {
            await handlePunchAction(offlinePostRequest);
        } else if (url.startsWith('PunchListItem/Attachment')) {
            await handlePostPunchAttachment(offlinePostRequest, searchParams);
        } else if (url.startsWith('CheckList/Item/SetOk')) {
            await handleChecklistItemPostSetOK(offlinePostRequest);
        } else if (url.startsWith('CheckList/Item/SetNA')) {
            await handleChecklistItemPostSetNA(offlinePostRequest);
        } else if (url.startsWith('CheckList/Item/Clear')) {
            await handleChecklistItemPostClear(offlinePostRequest);
        } else if (url.startsWith('CheckList/MC/Sign')) {
            await handleChecklistPostSign(offlinePostRequest);
        } else if (url.startsWith('CheckList/MC/Unsign')) {
            await handleChecklistPostUnSign(offlinePostRequest);
        } else if (url.startsWith('CheckList/MC/Verify')) {
            await handleChecklistPostVerify(offlinePostRequest);
        } else if (url.startsWith('CheckList/MC/Unverify')) {
            await handleChecklistPostUnVerify(offlinePostRequest);
        } else if (url.startsWith('CheckList/CustomItem?plantId')) {
            return await handleChecklistPostCustomCheckItem(offlinePostRequest);
        } else if (url.startsWith('CheckList/CustomItem/SetOk')) {
            await handleCustomChecklistItemPostSetOK(offlinePostRequest);
        } else if (url.startsWith('CheckList/CustomItem/Clear')) {
            await handleCustomChecklistItemPostClear(offlinePostRequest);
        } else if (url.startsWith('CheckList/Attachment')) {
            await handlePostChecklistAttachment(
                offlinePostRequest,
                searchParams
            );
        } else if (url.startsWith('Checklist/Comment')) {
            await handlePostComment(offlinePostRequest, searchParams);
        } else if (url.startsWith('WorkOrder/Attachment')) {
            await handlePostWorkOrderAttachment(
                offlinePostRequest,
                searchParams
            );
        }
    } else if (method == 'PUT') {
        //putUpdatePunch
        if (url.startsWith('PunchListItem/')) {
            await handleUpdatePunch(offlinePostRequest);
        } else if (url.startsWith('CheckList/MC/Comment')) {
            await handleChecklistPutComment(offlinePostRequest);
        } else if (
            url.startsWith('CheckList/Item/MetaTableCell') ||
            url.startsWith('CheckList/Item/MetaTableCellDate')
        ) {
            await handleChecklistPutMetaTableCell(offlinePostRequest);
        }
    } else if (method == 'DELETE') {
        if (url.startsWith('CheckList/CustomItem?plantId')) {
            await handleCustomChecklistItemDelete(offlinePostRequest);
        } else if (url.startsWith('WorkOrder/Attachment')) {
            await handleDeleteWorkOrderAttachment(offlinePostRequest);
        } else if (url.startsWith('PunchListItem/Attachment')) {
            await handleDeletePunchAttachment(offlinePostRequest);
        } else if (url.startsWith('CheckList/Attachment')) {
            await handleDeleteCheckListAttachment(offlinePostRequest);
        }
    } else {
        console.error(
            'No handler was found to handle offline updates for ',
            offlinePostRequest.url
        );
    }
};
