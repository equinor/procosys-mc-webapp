import { OfflineUpdateRepository } from './OfflineUpdateRepository';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';

export const addRequestToOfflineUpdatesDb = async (
    entityId: number,
    offlineUpdateRequest: OfflineUpdateRequest
): Promise<void> => {
    offlineUpdateRequest.entityid = entityId;
    console.log('addRequestToOfflineUpdatesDb', offlineUpdateRequest);
    const repository = new OfflineUpdateRepository();
    repository.add(offlineUpdateRequest);
};
