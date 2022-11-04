import { offline } from '@equinor/eds-icons';
import { ProcosysApiService } from '../services/procosysApi';
import { OfflineUpdateRepository } from './OfflineUpdateRepository';
import { OfflineUpdateRequest, RequestType } from './OfflineUpdateRequest';

export const syncronizeOfflineUpdatesWithBackend = async (
    api: ProcosysApiService
): Promise<void> => {
    /**
     * Syncronize an update
     */
    const syncronizeOfflineUpdate = async (
        offlineUpdate: OfflineUpdateRequest
    ): Promise<any> => {
        console.log('syncronizeOfflineUpdate', offlineUpdate);
        let response: Response | null = null;

        const method = offlineUpdate.method.toUpperCase();

        let newEntityId;
        try {
            if (method == 'POST') {
                //Handle POST
                console.log('syncronizeOfflineUpdate - POST');
                if (offlineUpdate.type == RequestType.Json) {
                    console.log('skal post json');
                    newEntityId = await api.postByFetch(
                        offlineUpdate.url,
                        offlineUpdate.bodyData
                    );
                } else if (offlineUpdate.type == RequestType.Attachment) {
                    response = await api.postAttachmentByFetch(
                        offlineUpdate.url,
                        offlineUpdate.bodyData
                    );
                } else {
                    console.error(
                        'Not able to syncronize offline update with type ' +
                            offlineUpdate.type
                    );
                }
            } else if (method == 'PUT') {
                //Handle PUT
                console.log('syncronizeOfflineUpdate - PUT');
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
                console.error(
                    'Not able to handle update request. Method is ' + method
                );
                return;
            }
        } catch (error) {
            console.error('Not able to syncronize entity.');
            //todo: feilhåndtering
            return;
        }

        //Response is ok
        //Set offline update to be syncronized
        offlineUpdate.syncronized = true;
        offlineUpdateRepository.updateOfflineUpdate(offlineUpdate);

        if (offlineUpdate.responseIsNewEntityId) {
            //todo: Her kan vi ha litt feilhådntering. Vi må ha en reposnse.id her.
            console.log('offlineupadte har new entity id: ', newEntityId);
            return newEntityId;
        }
    };

    /**
     * Update entityId for remaining updates for entity.
     * This is necessary when backend has generated a new id for the entity (a new entity was created offline)
     */
    const updateEntityId = (
        newEntityId: number,
        offlineUpdate: OfflineUpdateRequest
    ): void => {
        console.log('SKAL OPPDATERE ENTITYID', newEntityId, offlineUpdate);
        console.log('SKAL OPPDATERE ENTITYID string', newEntityId.toString());
        const method = offlineUpdate.method.toUpperCase();
        if (method == 'PUT') {
            if (offlineUpdate.url.startsWith('PunchListItem/')) {
                //putUpdatePunch
                offlineUpdate.bodyData.PunchItemId = newEntityId.toString();
            }
        }
    };

    // Syncronze all updates with backend.
    console.log('SyncUpdatesWithBackend');
    const offlineUpdateRepository = new OfflineUpdateRepository();

    const offlineUpdates =
        await offlineUpdateRepository.getRequestsOrderedByEntityAndSeq();

    //Get a distinct set of entities to syncronize
    const entitiesToUpdate = new Set<number>();
    for (const offlineUpdate of offlineUpdates) {
        entitiesToUpdate.add(offlineUpdate.entityid ?? 0);
    }

    console.log('HER ER LISTEN OVER ENTITIES TO UPDATE', entitiesToUpdate);

    for (const entityIdToUpdate of entitiesToUpdate) {
        //Syncronize updates for the specific entity

        console.log(
            'syncUpdatesWithBackend entityid to update: ',
            entityIdToUpdate
        );

        //Find all updates for the current entity
        const updatesForEntity = offlineUpdates.filter(
            (offlineUpdate) => offlineUpdate.entityid == entityIdToUpdate
        );

        console.log(
            'her er listen over entites som skal synces',
            updatesForEntity
        );

        let entityId = entityIdToUpdate;

        for (const offlineUpdate of updatesForEntity) {
            if (!offlineUpdate.syncronized) {
                if (offlineUpdate.entityid != entityId) {
                    //Previous updates for the entity returned an entityId generated by backend
                    console.log(
                        'JA, ENTITYID ER IKKE LIK FORRIGE ENTITY',
                        offlineUpdate.entityid,
                        entityId
                    );
                    updateEntityId(entityId, offlineUpdate);
                    console.log(
                        'hvordsan ser update ut etter uopdateIntityId',
                        offlineUpdate
                    );
                }
                const id = await syncronizeOfflineUpdate(offlineUpdate);
                if (id) {
                    console.log('har jeg fått ny entityid', id);
                    entityId = id.Id;
                }
            } else {
                console.log(
                    'Offline update already syncronized for entity ' +
                        offlineUpdate.entityid
                );
            }
        }
    }
};
