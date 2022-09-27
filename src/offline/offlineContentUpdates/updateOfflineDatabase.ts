import { PunchAction } from '@equinor/procosys-webapp-components';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { handleNewPunch } from './handleNewPunch';
import { handlePunchAction } from './handlePunchAction';
import { handleUpdatePunch } from './handleUpdatePunch';

//*****************************************************************************
// The functions here will handle update of offline database, on POST and PUT.
//*****************************************************************************
/**
 * When a POST/PUT/DELETE fetch is intercepted, and we are in offline mode, this method will be called, and will handle
 * necessary updates of the offline content database.
 * @param offlinePostRequest  The intercepted fetch request object.
 */
export const updateOfflineContentDatabase = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    console.log('updateOfflineContentDatabase', offlinePostRequest);
    const dummyUrl = new URL('http://dummy.no' + offlinePostRequest.url); //todo: Better way to find searchParams?
    const searchParams = dummyUrl.searchParams;
    const bodyData = offlinePostRequest.bodyData;

    const method = offlinePostRequest.method.toUpperCase();
    const url = offlinePostRequest.url;

    if (method == 'POST') {
        if (url.startsWith('PunchListItem?plantId')) {
            //postNewPunch
            await handleNewPunch(
                offlinePostRequest.url,
                searchParams,
                bodyData
            );
        } else if (
            //postPunchAction
            url.startsWith(`PunchListItem/${PunchAction.CLEAR}`) ||
            url.startsWith(`PunchListItem/${PunchAction.REJECT}`) ||
            url.startsWith(`PunchListItem/${PunchAction.UNCLEAR}`) ||
            url.startsWith(`PunchListItem/${PunchAction.UNVERIFY}`) ||
            url.startsWith(`PunchListItem/${PunchAction.VERIFY}`)
        ) {
            await handlePunchAction(offlinePostRequest.url, bodyData);
        }
    } else if (method == 'PUT') {
        //putUpdatePunch
        if (url.startsWith('PunchListItem/')) {
            await handleUpdatePunch(
                offlinePostRequest.url,
                searchParams,
                bodyData
            );
        }
    } else {
        console.error(
            'No handler was found to handle offline updates for ',
            offlinePostRequest.url
        );
    }
};
