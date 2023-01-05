import { HTTPError } from '../services/HTTPError';
import { ProcosysApiService } from '../services/procosysApi';
import { EntityType, OfflineStatus } from '../typings/enums';
import { OfflineUpdateRepository } from './OfflineUpdateRepository';
import {
    OfflineUpdateRequest,
    RequestType,
    SyncStatus,
} from './OfflineUpdateRequest';

import { OfflineSynchronizationErrors } from '../services/apiTypes';
import { getOfflineProjectIdfromLocalStorage } from './OfflineStatus';
import { StorageKey } from '@equinor/procosys-webapp-components';
import { db } from './db';
import { LocalStorage } from '../contexts/McAppContext';

const offlineUpdateRepository = new OfflineUpdateRepository();

/**
 * This function is called when offline mode is to be finished.
 * All updates  made in offline mode will be synchroinzed using the main-api. This
 * will be done by re-posting all POST, PUT and DELETE that was done while being offline.
 *
 * The updates will be grouped by entityId. The updates for an entity will be executed in the same sequence as they where posted.
 * When an update has been made, the update will be marked as synchronized, in the offline database.
 *
 * When all updates for an entity have been posted, a call will be posted to mark the entity as synchronized.
 * If main-api respond with an error code, the posting of updates for the current entity will be stopped.
 * The entity will be marked as synchronized even if there are errors. The posting of updates for other entities
 * will continue.
 *
 * If there are network issues, or the main-api is not accessable of some reason, the synchronization will continue, but the updates are not set to synchronized, and no
 * errors will be set. This function must then be called again later, to retry posting the remaining updates.
 *
 * When synchronization of all entities are done, error messages, if any, will be posted and stored in database.
 **/
export const syncronizeOfflineUpdatesWithBackend = async (
    api: ProcosysApiService
): Promise<void> => {
    console.log('syncronizeOfflineUpdatesWithBackend');

    const currentPlant = localStorage.getItem(StorageKey.PLANT);
    const currentProject = getOfflineProjectIdfromLocalStorage();

    if (!currentPlant || !currentProject) {
        throw Error(
            'Not able to synchronize because current plant or current project was not found on local storage.'
        );
    }

    const offlineUpdates = await offlineUpdateRepository.getUpdateRequests();

    const entitiesToUpdate = getListWithEntitiesToUpdate(offlineUpdates);

    //Syncronize updates for one entity at the time
    for (const entityToUpdate of entitiesToUpdate) {
        //Find all updates for the current entity
        const updatesForEntity = offlineUpdates.filter(
            (offlineUpdate) =>
                offlineUpdate.entityId == entityToUpdate.id &&
                offlineUpdate.entityType == entityToUpdate.type
        );

        //Perform updates for the given entity.
        //If an error occurs, further synchronization of this entity will be stopped and
        //the updates will be marked with 'error'.
        //If the update is already set to synchronized, or an error code is set, it will be skipped.
        for (let offlineUpdate of updatesForEntity) {
            //Reload the offlineUpdate in case there are changes (new entityid)
            offlineUpdate = await offlineUpdateRepository.getUpdateRequest(
                offlineUpdate.uniqueId
            );

            if (offlineUpdate.syncStatus == SyncStatus.NOT_SYNCHRONIZED) {
                try {
                    const id = await performOfflineUpdate(offlineUpdate, api);

                    if (id) {
                        //Backend has created a new ID. All updates for the entity must be updated.
                        for (const update of offlineUpdates) {
                            const updated = updateIdOnEntityRequest(
                                id.Id,
                                update,
                                offlineUpdate.temporaryId
                            );
                            await offlineUpdateRepository.updateOfflineUpdateRequest(
                                updated
                            );
                        }
                    }
                } catch (error) {
                    if (error instanceof HTTPError) {
                        //Main-api returned an error code.
                        await handleFailedUpdateRequest(offlineUpdate, error);
                        break; //skip further updates on current entity
                    } else {
                        throw Error(
                            'Error occured when calling update request.  ' +
                                error
                        );
                    }
                }
            } else if (offlineUpdate.syncStatus == SyncStatus.SYNCHRONIZED) {
                console.log(
                    'Offline update already syncronized for entity ' +
                        offlineUpdate.entityId
                );
            } else if (offlineUpdate.syncStatus == SyncStatus.ERROR) {
                console.log(
                    `Offline update already set to error-status:  ${offlineUpdate.errorCode} - ${offlineUpdate.errorMessage} `
                );
                break; //If an error occured we will skip further updates on this entity.
            } else {
                console.error(
                    'The offline update does not have the corret synchronization status. ',
                    offlineUpdate.syncStatus
                );
            }
        }

        //todo: Skal bare sette til syncronized, hvis alle updatesa er satt til syncronzied eller error. Setter jeg synchronized hvis det er error?
        await setEntityToSynchronized(updatesForEntity[0], api);
    }

    const errorsExists = await reportErrorsIfExists(
        currentPlant,
        currentProject,
        api
    );

    if (!errorsExists) {
        //The offline scope will be set to synchronized and database will be delete, only if there are no errors.
        await api.putOfflineScopeSynchronized(currentPlant, currentProject);
        await db.delete();
    }
};

type EntityToUpdate = {
    id: number;
    type: EntityType;
};

/**
 * Make a distinct list of checklist, punch and work orders to synchronize based on a list of offline update requests.
 */
const getListWithEntitiesToUpdate = (
    offlineUpdates: OfflineUpdateRequest[]
): EntityToUpdate[] => {
    const entitiesToUpdate: EntityToUpdate[] = [];

    for (const offlineUpdate of offlineUpdates) {
        const entityExistInList = entitiesToUpdate.some(
            (entity) =>
                entity.id === offlineUpdate.entityId &&
                entity.type === offlineUpdate.entityType
        );
        if (
            !entityExistInList &&
            offlineUpdate.entityId &&
            offlineUpdate.entityType
        ) {
            entitiesToUpdate.push({
                id: offlineUpdate.entityId,
                type: offlineUpdate.entityType,
            });
        }
    }
    return entitiesToUpdate;
};

/**
 * The update request in the offline-database is updated with error message.
 */
const handleFailedUpdateRequest = async (
    offlineUpdate: OfflineUpdateRequest,
    error: HTTPError
): Promise<void> => {
    console.log('handleFailedUpdateRequest', offlineUpdate, error);
    offlineUpdate.errorCode = error.errorCode;
    offlineUpdate.errorMessage = error.errorMessage;
    await offlineUpdateRepository.updateOfflineUpdateRequest(offlineUpdate);
};

/**
 * This function will collect all errors reported during synchronization, and send to server.
 */
const reportErrorsIfExists = async (
    plantId: string,
    projectId: number,
    api: ProcosysApiService
): Promise<boolean> => {
    console.log('reportErrorsIfExists');
    const offlineSynchronizationErrors: OfflineSynchronizationErrors = {
        ProjectId: projectId,
        CheckListErrors: [],
        PunchListItemErrors: [],
    };
    const offlineUpdates = await offlineUpdateRepository.getUpdateRequests();

    for (const offlineUpdate of offlineUpdates) {
        if (OfflineUpdateRequest.hasError(offlineUpdate)) {
            if (offlineUpdate.entityType == EntityType.Checklist) {
                offlineSynchronizationErrors.CheckListErrors.push(
                    OfflineUpdateRequest.getErrorObject(offlineUpdate)
                );
            } else if (offlineUpdate.entityType == EntityType.PunchItem) {
                offlineSynchronizationErrors.PunchListItemErrors.push(
                    OfflineUpdateRequest.getErrorObject(offlineUpdate)
                );
            } else {
                console.error(
                    'Not able to report error with entity type ' +
                        offlineUpdate.entityType
                );
            }
            //todo: Work order is not yet handled.
        }
    }

    if (
        offlineSynchronizationErrors.CheckListErrors.length > 0 ||
        offlineSynchronizationErrors.PunchListItemErrors.length > 0
    ) {
        await api.postOfflineScopeSynchronizeErrors(
            plantId,
            offlineSynchronizationErrors
        );

        localStorage.setItem(
            LocalStorage.SYNCH_ERRORS,
            JSON.stringify(offlineSynchronizationErrors)
        );
        localStorage.setItem(
            LocalStorage.OFFLINE_STATUS,
            OfflineStatus.SYNC_FAIL.toString()
        );
        console.log('setting offline status to sync fail');
        return true;
    } else {
        localStorage.setItem(
            LocalStorage.OFFLINE_STATUS,
            OfflineStatus.ONLINE.toString()
        );
        localStorage.removeItem(LocalStorage.SYNCH_ERRORS); //just in case...
        return false;
    }
};

/**
 * Synchronize an update (POST,PUT or DELETE)
 */
const performOfflineUpdate = async (
    offlineUpdate: OfflineUpdateRequest,
    api: ProcosysApiService
): Promise<any> => {
    console.log('synchronizeOfflineUpdate', offlineUpdate);

    let response: Response | null = null;
    const method = offlineUpdate.method.toUpperCase();
    let newEntityId;

    if (method == 'POST') {
        //Handle POST
        if (offlineUpdate.type == RequestType.Json) {
            //Handle json
            newEntityId = await api.postByFetch(
                offlineUpdate.url,
                offlineUpdate.bodyData
            );
        } else if (offlineUpdate.type == RequestType.Attachment) {
            //Handle attachment
            const bodyData = offlineUpdate.bodyData as Map<string, ArrayBuffer>;
            const fd = new FormData();

            for (const [key, value] of bodyData) {
                const blob = new Blob([value], {
                    type: offlineUpdate.mimeType,
                });
                fd.append(key, blob, key);
            }

            response = await api.postAttachmentByFetch(offlineUpdate.url, fd);
        } else {
            throw Error(
                'Not able to handle given offline update type. Offline update type: ' +
                    offlineUpdate.type
            );
        }
    } else if (method == 'PUT') {
        //Handle PUT
        response = await api.putByFetch(
            offlineUpdate.url,
            offlineUpdate.bodyData,
            { 'Content-Type': 'application/json' }
        );
    } else if (method == 'DELETE') {
        //Handle DELETE
        response = await api.deleteByFetch(
            offlineUpdate.url,
            offlineUpdate.bodyData
        );
    } else {
        throw Error('Not able to handle update request. Method is ' + method);
    }

    //Response is ok
    //Set offline update to be syncronized in browser database.
    offlineUpdate.syncStatus = SyncStatus.SYNCHRONIZED;
    offlineUpdate.errorCode = undefined; //remove in case eror code was set in previous synchroinzation.
    offlineUpdate.errorMessage = undefined;

    await offlineUpdateRepository.updateOfflineUpdateRequest(offlineUpdate);

    if (offlineUpdate.responseIsNewEntityId) {
        //todo: Her kan vi ha litt feilhådntering. Vi må ha en reposnse.id her.
        return newEntityId;
    }
};

/**
 * When all updates for an entity is posted, the entity must be set to synchronized, on the server side.
 */
const setEntityToSynchronized = async (
    update: OfflineUpdateRequest,
    api: ProcosysApiService
): Promise<void> => {
    if (!update.entityId) return;

    if (update.entityType == EntityType.Checklist) {
        await api.putOfflineScopeChecklistSynchronized(
            update.plantId,
            update.entityId
        );
    } else if (update.entityType == EntityType.PunchItem) {
        await api.putOfflineScopePunchlistItemSynchronized(
            update.plantId,
            update.entityId,
            update.responseIsNewEntityId
        );
    } else if (update.entityType == EntityType.WorkOrder) {
        // todo: endpoint does not exist.
    } else {
        console.error(
            `Not able to set offline update to synchronized. Entity type is not correct. EntityId=${update.entityId}. entityType=${update.entityType}`
        );
    }
};

/**
 * Update entityId for offline update request
 * The specific Post/PUT operation must be identified, and the specific variable in the body must be updated.
 */
const updateIdOnEntityRequest = (
    newId: number,
    offlineUpdate: OfflineUpdateRequest,
    temporaryId?: number
): OfflineUpdateRequest => {
    const method = offlineUpdate.method.toUpperCase();

    //Update body data
    if (method == 'PUT') {
        if (offlineUpdate.url.startsWith('PunchListItem/')) {
            //putUpdatePunch
            offlineUpdate.entityId = newId;
            offlineUpdate.bodyData.PunchItemId = newId.toString();
        }
    } else if (method == 'POST') {
        if (
            offlineUpdate.url.startsWith('CheckList/CustomItem/SetOk') ||
            offlineUpdate.url.startsWith('CheckList/CustomItem/Clear')
        ) {
            //postCustomClear and postCustomSetOK
            if (offlineUpdate.bodyData.CustomCheckItemId == temporaryId) {
                //Ensure that only the specific custom check item is updated (not all on the given checklist)
                offlineUpdate.bodyData.CustomCheckItemId = newId.toString();
            }
        } else if (
            offlineUpdate.url.startsWith('PunchListItem/Clear') ||
            offlineUpdate.url.startsWith('PunchListItem/Unclear') ||
            offlineUpdate.url.startsWith('PunchListItem/Reject') ||
            offlineUpdate.url.startsWith('PunchListItem/Verify') ||
            offlineUpdate.url.startsWith('PunchListItem/Unverify')
        ) {
            offlineUpdate.entityId = newId;
            offlineUpdate.bodyData = newId.toString();
        }
    } else if (method == 'DELETE') {
        if (offlineUpdate.url.startsWith('CheckList/CustomItem')) {
            //deleteCustomItem. Must ensure that this is an update for the specific custom check item that got the new Id.
            if (offlineUpdate.bodyData.CustomCheckItemId == temporaryId) {
                offlineUpdate.bodyData.CustomCheckItemId = newId.toString();
            }
        }
    } else {
        console.error(
            'Not able to update entityId for PUT (new entity where new id has been generated by server).',
            offlineUpdate.url
        );
    }

    return offlineUpdate;
};
