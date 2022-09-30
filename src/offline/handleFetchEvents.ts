import { ChecklistResponse } from '../services/apiTypes';
import { EntityType } from '../typings/enums';
import IsOfflineMode from '../utils/isOfflineMode';
import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';
import { addUpdateRequestToDatabase } from './addUpdateRequestToDatabase';
import { IEntity } from './IEntity';
import { OfflineContentRepository } from './OfflineContentRepository';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';
import { updateOfflineContentDatabase } from './updateOfflineDatabase';

const offlineContentRepository = new OfflineContentRepository();

export const handleFetchGET = async (event: FetchEvent): Promise<any> => {
    //console.log('handleFetchGET', event.request.url);
    const url = removeBaseUrlFromUrl(event.request.url);

    if (await IsOfflineMode()) {
        if (url.includes('CheckList/CustomItem/NextItemNo')) {
            //Handle special case. Later: We should try to find a better way to handle this, to avoid this special handling.
            return handleCustomCheckItemNextItemNo(event.request.url);
        }

        // Try to get the response from offline content database.
        const entity = await offlineContentRepository.getByApiPath(url);
        if (entity) {
            //todo: Ta bort log
            // console.log(
            //     'handleFetchGET: Returnerer objekt fra database. ' +
            //         event.request.url,
            //     entity.responseObj
            // );
            const blob = new Blob([JSON.stringify(entity.responseObj)]);
            return new Response(blob);
        } else {
            console.error(
                'Offline-mode. Entity for given url is not found in local database. Will try to fetch.',
                event.request.url
            );
            return await fetch(event.request);
        }
    } else {
        return await fetch(event.request);
    }
};

export const handleFetchUpdate = async (
    event: FetchEvent
): Promise<Response> => {
    if (await IsOfflineMode()) {
        // console.log('handleFetchupdate. Offline mode.', event.request.url);

        const offlinePostRequest = await OfflineUpdateRequest.build(
            event.request
        );
        console.log(
            'handleFetchupdaee, offlinepostrequest',
            offlinePostRequest
        );
        await updateOfflineContentDatabase(offlinePostRequest);
        await addUpdateRequestToDatabase(offlinePostRequest);

        return new Response();
    } else {
        // console.log('handleFetchUpdate. Online mode', event.request.url);
        return await fetch(event.request);
    }
};

export const handleOtherFetchEvents = async (
    event: FetchEvent
): Promise<Response> => {
    if (await IsOfflineMode()) {
        console.error(
            'We are in offline mode, and should not need to perform any fetch.',
            event.request.url
        );
        return await fetch(event.request);
    } else {
        // console.log('handleFetchUpdate. Online mode', event.request.url);
        return await fetch(event.request);
    }
};

/**
 * Return the next sequence number for custom check event.
 */
const handleCustomCheckItemNextItemNo = async (
    fullUrlStr: string
): Promise<Response> => {
    const url = new URL(fullUrlStr);
    const checklistId = url.searchParams.get('checkListId');

    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
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
