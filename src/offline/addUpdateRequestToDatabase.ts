import { OfflineUpdateRepository } from './OfflineUpdateRepository';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';

export const addUpdateRequestToDatabase = async (
    offlineUpdateRequest: OfflineUpdateRequest
): Promise<void> => {
    console.log('addUpdateRequestToDatabase', offlineUpdateRequest.url);
    const repository = new OfflineUpdateRepository();
    repository.add(offlineUpdateRequest);
};
