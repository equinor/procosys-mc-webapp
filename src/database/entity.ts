import Dexie, { Table } from 'dexie';

export interface IEntity {
    entityid: number;
    entitytype: string;
    // response: Response
    // request: Request
    data: string;
}

export class Entity implements IEntity {
    entityid!: number;
    entitytype!: string;
    data!: string;
    // response!: Response;
    // request!: Request;
}

export type EntityIndexes = Pick<IEntity, 'entityid' | 'entitytype'>;

import db from './db';
export class EntityRepository {
    async getById(id: number): Promise<Entity> {
        let result = await db.offlineContent.where('id').equals(id).first();
        return result as Entity;
    }

    async getByEntityId(entityId: number): Promise<Entity> {
        const result = await db.offlineContent
            .where('id')
            .equals(entityId)
            .first();
        return result as Entity;
    }

    async add(entity: Entity): Promise<EntityIndexes> {
        return await db.offlineContent.add(entity, entity as EntityIndexes);
    }
}
