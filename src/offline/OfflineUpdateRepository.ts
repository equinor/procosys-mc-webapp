import { db } from './db';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';

class OfflineUpdateRepository {
    async getAllRequests(): Promise<OfflineUpdateRequest[]> {
        const result = await db.offlineUpdates.toArray();
        return result as OfflineUpdateRequest[];
    }

    async add(offlineUpdateRequest: OfflineUpdateRequest): Promise<void> {
        if (db.offlineUpdates !== undefined) {
            console.log(
                'Injector: Legger til post request i db',
                offlineUpdateRequest
            );
            await db.offlineUpdates.add(offlineUpdateRequest);
        } else {
            throw Error(
                'Offline database is not initialized. Not able to store updates.'
            );
        }
    }
}

export { OfflineUpdateRepository };
