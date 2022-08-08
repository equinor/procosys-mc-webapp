import { db } from './db';
import { Entity } from './Entity';
import { EntityIndexes } from './IEntity';

class EntityRepository {
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
