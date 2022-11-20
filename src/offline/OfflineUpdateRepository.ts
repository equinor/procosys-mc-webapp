import { EntityType } from '../typings/enums';
import { db } from './db';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';

class OfflineUpdateRepository {
    async getUpdateRequests(): Promise<OfflineUpdateRequest[]> {
        const result = await db.offlineUpdates.toArray();
        db.offlineUpdates.orderBy(['seqno']);
        return result as OfflineUpdateRequest[];
    }

    /**
     * Add new update request.
     * The entityId should be id for either checklist, punch or work order.
     * When the updates later are sent to main-api, they will be grouped by entityid.
     */
    async addUpdateRequest(
        entityId: number,
        entityType: EntityType,
        offlineUpdateRequest: OfflineUpdateRequest
    ): Promise<void> {
        console.log(
            'addUpdateRequest - lagrer i database',
            offlineUpdateRequest
        );
        offlineUpdateRequest.entityId = Number(entityId);
        offlineUpdateRequest.entityType = entityType;

        if (db.offlineUpdates !== undefined) {
            await db.offlineUpdates.add(offlineUpdateRequest);
        } else {
            throw Error(
                'Offline database is not initialized. Not able to store updates.'
            );
        }
    }

    /**
     * Update the offline update request.
     */
    async updateOfflineUpdateRequest(
        offlineUpdateRequest: OfflineUpdateRequest
    ): Promise<void> {
        if (db.offlineUpdates !== undefined) {
            const oldOfflineUpdate = await db.offlineUpdates
                .where('uniqueId')
                .equals(offlineUpdateRequest.uniqueId)
                .first();

            if (!oldOfflineUpdate) {
                throw Error(
                    `The offline update request to update was not found. UniqueId=${offlineUpdateRequest.uniqueId}, url path=${offlineUpdateRequest.url}`
                );
            }

            await db.offlineUpdates.put(offlineUpdateRequest);
        } else {
            throw Error(
                `Entity ${offlineUpdateRequest.entityId} - ${offlineUpdateRequest.description}  not updated in database. Offline content database not available.`
            );
        }
    }
}
export { OfflineUpdateRepository };
