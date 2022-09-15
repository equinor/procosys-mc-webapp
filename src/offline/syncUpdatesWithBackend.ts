import { ProcosysApiService } from '../services/procosysApi';
import { OfflineUpdateRepository } from './OfflineUpdateRepository';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';

export const syncUpdatesWithBackend = async (
    api: ProcosysApiService
): Promise<void> => {
    console.log('SyncUpdatesWithBackend');
    const offlineUpdateRepository = new OfflineUpdateRepository();
    const allOfflineUpdates = await offlineUpdateRepository.getAllRequests();
    allOfflineUpdates.forEach((updateRequest: OfflineUpdateRequest) => {
        console.log('syncUpdatesWithBackend: ', updateRequest);
        if (updateRequest.method.toLowerCase() == 'post') {
            api.postByFetch(
                updateRequest.url,
                updateRequest.bodyData,
                updateRequest.additionalHeaders
            );
        } else if (updateRequest.method.toLowerCase() == 'put') {
            api.putByFetch(updateRequest.url, updateRequest.bodyData);
        } else if (updateRequest.method.toLowerCase() == 'delete') {
            api.deleteByFetch(updateRequest.url, updateRequest.bodyData);
        }
    });
};
