import { EntityType } from '../typings/enums';
import { db } from './db';
import { Entity } from './Entity';
import { EntityIndexes } from './EntityIndexes';

class OfflineContentRepository {
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

    async getEntityByType(entityType: EntityType): Promise<Entity> {
        let result;
        if (entityType) {
            result = await db.offlineContent
                .where('entitytype')
                .equals(entityType)
                .first();
        } else {
            console.error(
                'Was not able to find entity in offline content database.',
                entityType
            );
            //todo: exception?
        }

        return result as Entity;
    }

    async getEntityByTypeAndId(
        entityType: EntityType,
        entityId: number
    ): Promise<Entity> {
        const result = await db.offlineContent
            .where('entitytype')
            .equals(entityType)
            .and((entity) => entity.entityid == entityId)
            .first();

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
            const oldEntity = await this.getByApiPath(entity.apipath);
            if (!oldEntity) {
                console.error(
                    `The entity to replace does not exist. urlPath: ${entity.apipath}`
                );
                throw Error(
                    `The entity to replace does not exist. urlPath: ${entity.apipath}`
                );
            }

            return await db.offlineContent.put(entity);
        }
        console.error(
            `Entity ${entity.entityid} not updated in database. Offline content database not available. Url path: ${entity.apipath}`
        );
        throw Error(
            `Entity ${entity.entityid} not updated in database. Offline content database not available. Url path: ${entity.apipath}`
        );
    }
}

export { OfflineContentRepository };
