import { EntityType } from '../typings/enums';
import { db } from './db';
import { Entity } from './Entity';
import { EntityIndexes } from './EntityIndexes';

class OfflineContentRepository {
    async cleanOfflineContent(): Promise<void> {
        db.offlineContent.clear();
    }

    async getById(id: number): Promise<Entity> {
        const result = await db.offlineContent.where('id').equals(id).first();
        return result as Entity;
    }

    async getByEntityId(entityId: number): Promise<Entity> {
        const result = await db.offlineContent
            .where('entityid')
            .equals(entityId)
            .first();
        return result as Entity;
    }

    async getByApiPath(apiPath: string): Promise<Entity> {
        const result = await db.offlineContent
            .where('apipath')
            .equals(apiPath)
            .first();
        return result as Entity;
    }

    async getEntity(
        entityType: EntityType,
        entityId?: number
    ): Promise<Entity> {
        let result = undefined;
        if (entityId) {
            result = await db.offlineContent
                .where('entitytype')
                .equals(entityType)
                .and((entity) => entity.entityid == entityId)
                .first();
        } else {
            result = await db.offlineContent
                .where('entitytype')
                .equals(entityType)
                .first();
        }

        return result as Entity;
    }

    async add(entity: Entity): Promise<EntityIndexes> {
        if (db.offlineContent !== undefined) {
            return await db.offlineContent.add(entity);
        }
        throw Error(`Entity ${entity.entityid} not added to database`);
    }

    async bulkAdd(entities: Entity[]): Promise<EntityIndexes> {
        if (db.offlineContent !== undefined) {
            return await db.offlineContent.bulkAdd(entities);
        }
        throw Error(`Entities ${entities} not added to database.`);
    }

    /**
     * Replaces the entity in the offline database, given that only the responseObj has changes.
     */
    async replaceEntity(entity: Entity): Promise<EntityIndexes> {
        if (db.offlineContent !== undefined) {
            return await db.offlineContent.put(entity);
        }
        throw Error(`Entity ${entity} not updated in database.`);
    }
}

export { OfflineContentRepository };
