import { db } from './db';
import { Entity } from './Entity';
import { EntityIndexes } from './EntityIndexes';

class EntityRepository {
    delete(testEnityId: number): Promise<number> {
        return db.offlineContent.where('entityid').equals(testEnityId).delete();
    }

    async find(entityid: number): Promise<Entity | undefined> {
        return await db.offlineContent
            .where('entityid')
            .equals(entityid)
            .first();
    }

    async getById(id: number): Promise<Entity> {
        const result = await db.offlineContent.where('id').equals(id).first();
        return result as Entity;
    }

    async getByEntityId(entityId: number): Promise<Entity> {
        const result = await db.offlineContent
            .where('id')
            .equals(entityId)
            .first();
        return result as Entity;
    }

    async Add(entity: Entity): Promise<EntityIndexes> {
        if ((await db.offlineContent) !== undefined) {
            return await db.offlineContent.put(entity, entity as EntityIndexes);
        }
        throw Error(`Entity ${entity.entityid} not added to database`);
    }
}

export { EntityRepository };
