import {
    ChecklistResponse,
    FetchOperationProps,
    IEntity,
} from '@equinor/procosys-webapp-components';
import { EntityType, OfflineStatus } from '../typings/enums';
import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';
import { OfflineContentRepository } from './OfflineContentRepository';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';
import { updateOfflineDatabase as updateOfflineDatabase } from './updateOfflineDatabase';
import { getOfflineStatusfromLocalStorage } from './OfflineStatus';

const offlineContentRepository = new OfflineContentRepository();

export const handleFetchGet = async (
    endpoint: string,
    getOperation?: FetchOperationProps
): Promise<any> => {
    const url = removeBaseUrlFromUrl(endpoint);
    if (getOfflineStatusfromLocalStorage() == OfflineStatus.OFFLINE) {
        if (url.includes('CheckList/CustomItem/NextItemNo')) {
            //Handle special case. Later: We should try to find a better way to handle this, to avoid this special handling.
            return await handleCustomCheckItemNextItemNo(endpoint);
        }

        // Try to get the response from offline content database.
        const entity = await offlineContentRepository.getByApiPath(url);
        if (entity) {
            if (url.includes('/Attachment?')) {
                const arrayBuffer = entity.responseObj as ArrayBuffer;
                //const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
                const blob = new Blob([arrayBuffer]);
                return new Response(blob);
            } else {
                const blob = new Blob([JSON.stringify(entity.responseObj)]);
                return new Response(blob);
            }
        } else {
            console.error(
                'Offline-mode. Entity for given url is not found in local database. Will try to fetch.',
                endpoint
            );
            return await fetch(endpoint, getOperation);
        }
    } else {
        return await fetch(endpoint, getOperation);
    }
};

export const handleFetchUpdate = async (
    endpoint: string,
    fetchOperation: FetchOperationProps,
    contentType: string
): Promise<Response> => {
    if (getOfflineStatusfromLocalStorage() == OfflineStatus.OFFLINE) {
        const offlinePostRequest =
            await OfflineUpdateRequest.buildOfflineRequestObject(
                fetchOperation,
                endpoint,
                contentType
            );

        const data = await updateOfflineDatabase(offlinePostRequest);
        if (data) {
            const res = new Response(JSON.stringify(data), {
                headers: {
                    'content-Type': 'application/json',
                },
            });
            return res;
        } else {
            return new Response();
        }
    } else {
        return await fetch(endpoint, fetchOperation);
    }
};

/**
 * Handle fetch events that are not calls to procosys apis.
 */
export const handleOtherFetchEvents = async (
    event: FetchEvent
): Promise<Response> => {
    console.error(
        'We are in offline mode, and should not need to perform any fetch.',
        event.request.url
    );
    return await fetch(event.request);
};

/**
 * Return the next sequence number for custom check event.
 */
const handleCustomCheckItemNextItemNo = async (
    fullUrlStr: string
): Promise<Response> => {
    const url = new URL(fullUrlStr);
    const checklistId = url.searchParams.get('checkListId');

    const checklistEntity: IEntity =
        await offlineContentRepository.getEntityByTypeAndId(
            EntityType.Checklist,
            Number(checklistId)
        );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    let highestNumber = 0;
    if (checklist) {
        if (checklist.customCheckItems.length > 0) {
            checklist.customCheckItems.forEach((item) => {
                const seqNo = Number(item.itemNo);
                if (seqNo > highestNumber) {
                    highestNumber = seqNo;
                }
            });
        } else {
            checklist.checkItems.forEach((item) => {
                const seqNo = Number(item.sequenceNumber);
                if (seqNo > highestNumber) {
                    highestNumber = seqNo;
                }
            });
        }
    }
    highestNumber++;
    const seqNoStr = String(highestNumber).padStart(2, '0');
    return new Response(`"${seqNoStr}"`);
};
