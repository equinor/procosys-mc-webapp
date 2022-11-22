import { db } from './db';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';

class OfflineUpdateRepository {
    async getRequestsOrderedByEntityAndSeq(): Promise<OfflineUpdateRequest[]> {
        const result = await db.offlineUpdates.toArray();
        db.offlineUpdates.orderBy(['entityid', 'seqno']);
        return result as OfflineUpdateRequest[];
    }

    /**
     * Add new update request
     */
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

    /**
     * Update the offline update request.
     *
     * todo: må ha en unik nøkkel, jeg må ha en get metode, og en replace metode.
     * Må oppdatere sync f.eks.
     */
    async updateOfflineUpdate(
        offlineUpdateRequest: OfflineUpdateRequest
    ): Promise<void> {
        if (db.offlineUpdates !== undefined) {
            const oldOfflineUpdate = db.offlineUpdates
                .where('uniqueId')
                .equals(offlineUpdateRequest.uniqueId);

            if (!oldOfflineUpdate) {
                console.error(
                    'The offline update request to update does not exist.',
                    offlineUpdateRequest
                );
                throw Error(
                    `The offline update request to update does not exist. urlPath: ${offlineUpdateRequest.url}`
                );
            }

            //return await db.offlineUpdates.put(offlineUpdateRequest);
        }
        console.error(
            `Entity ${offlineUpdateRequest} not updated in database. Offline content database not available.`
        );
        throw Error(`Entity ${offlineUpdateRequest} not updated in database.`);
    }
}
export { OfflineUpdateRepository };
