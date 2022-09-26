import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { handleNewPunch } from './handleNewPunch';

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
    if (
        offlinePostRequest.method.toLowerCase() == 'post' &&
        offlinePostRequest.url.startsWith('PunchListItem?plantId')
    ) {
        await handleNewPunch(offlinePostRequest.url, searchParams, bodyData);
    } else {
        console.error(
            'No handler was found to handle offline updates for ',
            offlinePostRequest.url
        );
    }
};
