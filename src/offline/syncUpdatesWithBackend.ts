import { HTTPError } from '../services/HTTPError';
import { ProcosysApiService } from '../services/procosysApi';
import { EntityType } from '../typings/enums';
import { OfflineUpdateRepository } from './OfflineUpdateRepository';
import {
    OfflineUpdateRequest,
    RequestType,
    SyncStatus,
} from './OfflineUpdateRequest';

import { OfflineSynchronizationErrors } from '../services/apiTypes';
import { getOfflineProjectIdfromLocalStorage } from './OfflineStatus';
import { StorageKey } from '@equinor/procosys-webapp-components';

const offlineUpdateRepository = new OfflineUpdateRepository();

/**
 * This function is called when offline mode is to be finished.
 * All updates  made in offline mode will be synchroinzed using the main-api. This
 * will be done by re-posting all POST, PUT and DELETE that was done while being offline.
 *
 * The updates will be grouped by entityId. The updates for an entity will be executed in the same sequence as they where posted.
 * When an update has been made, the update will be marked as synchronized, in the offline database.
 *
 * When all updates for an entity has been re-posted, a call will be posted to mark the entity as synchronized.
 * If main-api respond with an error code, the re-posting of updates for the current entity will be stopped.
 * The entity will be marked as synchronized even if there are errors. The re-posting of updates for other entities
 * will continue.
 *
 * If there are network issues, or the main-api is not accessable of some reason, the synchronization will stop.
 * This function can then be called again, to restart the synchronization.
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

    console.log(
        'ER I syncronizeOfflineUpdatesWithBackend, har jeg plant og project',
        currentPlant,
        currentProject
    );

    const offlineUpdates = await offlineUpdateRepository.getUpdateRequests();

    type EntityToUpdate = {
        id: number;
        type: EntityType;
    };

    //Make a distinct list of checklist, punch and work orders to synchronize.
    const entitiesToUpdate: EntityToUpdate[] = [];

    for (const offlineUpdate of offlineUpdates) {
        console.log('skal evaluere', offlineUpdate);
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

    console.log('liste med objekter som skal oppdateres:', entitiesToUpdate);
    for (const entityToUpdate of entitiesToUpdate) {
        //Syncronize all updates for the the given entity.

        //Find all updates for the current entity
        const updatesForEntity = offlineUpdates.filter(
            (offlineUpdate) =>
                offlineUpdate.entityId == entityToUpdate.id &&
                offlineUpdate.entityType == entityToUpdate.type
        );

        console.log(
            'Skal gjøre oppdateringer for entity. ',
            entityToUpdate,
            updatesForEntity
        );

        //Perform updates for the given entity.
        //If an error occurs, further synchronization of this entity will be stopped and
        //the updates will be marked with 'error'.
        //If the update is already set to synchronized, or an error code is set, it will be skipped.
        let newEntityId;
        for (const offlineUpdate of updatesForEntity) {
            if (
                offlineUpdate.syncStatus == SyncStatus.NOT_SYNCHRONIZED &&
                !offlineUpdate.errorCode
            ) {
                if (newEntityId) {
                    //A previous POST for the entity returned a new entityId generated by backend.
                    //The id for the update request for this entity must be updated.
                    updateEntityId(newEntityId, offlineUpdate);
                }
                try {
                    const id = await synchronizeOfflineUpdate(
                        offlineUpdate,
                        api
                    );

                    if (id) {
                        //If id is returned it means that backend has created a new ID, that must be used for subsequent updates for this entity.
                        //TODO: To be able to retry synchronization, we should update all request on this entity, with the new id.
                        newEntityId = id.Id;
                    }
                } catch (error) {
                    break; //When an error occures, further synchronization of this entity should stop.
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
    }
    await reportErrorsIfExists(currentPlant, currentProject, api);

    //Note: Currently the offline scope will be set to synchronized, regardless of any errors.
    await api.putOfflineScopeSynchronized(currentPlant, currentProject);
};

/**
 * The update request is updated with error message.
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
): Promise<void> => {
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
            'SynchErrors',
            JSON.stringify(offlineSynchronizationErrors)
        );
    }
};

/**
 * Synchronize an update (POST,PUT or DELETE)
 */
const synchronizeOfflineUpdate = async (
    offlineUpdate: OfflineUpdateRequest,
    api: ProcosysApiService
): Promise<any> => {
    console.log('synchronizeOfflineUpdate', offlineUpdate);

    let response: Response | null = null;
    const method = offlineUpdate.method.toUpperCase();
    let newEntityId;

    try {
        if (method == 'POST') {
            //Handle POST
            console.log('synchronizeOfflineUpdate - POST');
            if (offlineUpdate.type == RequestType.Json) {
                console.log('SYNC: SKAL POSTE');
                newEntityId = await api.postByFetch(
                    offlineUpdate.url,
                    offlineUpdate.bodyData
                );
                console.log(
                    'synchronizeOfflineUpdate - etter postbyfetch',
                    newEntityId
                );
            } else if (offlineUpdate.type == RequestType.Attachment) {
                const bodyData = offlineUpdate.bodyData as Map<
                    string,
                    ArrayBuffer
                >;
                const fd = new FormData();

                for (const [key, value] of bodyData) {
                    const blob = new Blob([value]); // , { type: 'image/jpeg' }); //todo: type
                    fd.append(key, blob);
                }

                response = await api.postAttachmentByFetch(
                    offlineUpdate.url,
                    fd
                );
            } else {
                throw Error(
                    'Not able to handle given offline update type. Offline update type: ' +
                        offlineUpdate.type
                );
            }
        } else if (method == 'PUT') {
            //Handle PUT
            console.log('syncronizeOfflineUpdate - PUT ');
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
            throw Error(
                'Not able to handle update request. Method is ' + method
            );
        }

        //Response is ok
        //Set offline update to be syncronized, both in browser database and backend
        offlineUpdate.syncStatus = SyncStatus.SYNCHRONIZED;
        await offlineUpdateRepository.updateOfflineUpdateRequest(offlineUpdate);

        if (offlineUpdate.entityId) {
            if (offlineUpdate.entityType == EntityType.Checklist) {
                await api.putOfflineScopeChecklistSynchronized(
                    offlineUpdate.plantId,
                    offlineUpdate.entityId
                );
            } else if (offlineUpdate.entityType == EntityType.PunchItem) {
                await api.putOfflineScopePunchlistItemSynchronized(
                    offlineUpdate.plantId,
                    offlineUpdate.entityId,
                    offlineUpdate.responseIsNewEntityId
                );
            } else if (offlineUpdate.entityType == EntityType.WorkOrder) {
                // todo: endpoint does not exist.
            } else {
                console.error(
                    'Not able to set offline update to synchronized. Entity type is not correct.',
                    offlineUpdate
                );
            }
        }

        if (offlineUpdate.responseIsNewEntityId) {
            //todo: Her kan vi ha litt feilhådntering. Vi må ha en reposnse.id her.
            console.log('offlineupadte har new entity id: ', newEntityId);
            return newEntityId;
        }
    } catch (error) {
        console.error('Not able to syncronize entity.', error);
        if (error instanceof HTTPError) {
            //Main-api returned an error code.
            await handleFailedUpdateRequest(offlineUpdate, error);
        }
        throw Error('Error occured when calling update request.  ' + error);
    }
};

/**
 * Update entityId for remaining updates for entity.
 * This is necessary when backend has generated a new id for the entity (a new entity was created offline).
 * The specific PUT operation must be identified, and the specific variable in the body must be updated.
 */
const updateEntityId = (
    newEntityId: number,
    offlineUpdate: OfflineUpdateRequest
): void => {
    const method = offlineUpdate.method.toUpperCase();

    if (method == 'PUT') {
        if (offlineUpdate.url.startsWith('PunchListItem/')) {
            //putUpdatePunch
            offlineUpdate.bodyData.PunchItemId = newEntityId.toString();
            return;
        }
    }

    if (method == 'POST') {
        if (
            offlineUpdate.url.startsWith('CheckList/CustomItem/SetOk') ||
            offlineUpdate.url.startsWith('CheckList/CustomItem/Clear')
        ) {
            //postCustomClear and postCustomSetOK
            offlineUpdate.bodyData.CustomCheckItemId = newEntityId.toString();
            return;
        }
    }

    console.error(
        'Not able to update entityId for PUT (new entity where new id has been generated by server).',
        offlineUpdate.url
    );
};
