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
            .where('id')
            .equals(entityId)
            .first();
        return result as Entity;
    }

    async add(entity: Entity): Promise<EntityIndexes> {
        if ((await db.offlineContent) !== undefined) {
            return await db.offlineContent.add(entity); //Vi trenger ikke å oppgi keys når vi har 'inbound-keys' + autoinc
        }
        throw Error(`Entity ${entity.entityid} not added to database`);
    }

    //todo: Kanskje jeg skal ta bulkPut istedenfor, så er jeg sikker på at det ikke ligger dupliater
    async bulkAdd(entities: Entity[]): Promise<EntityIndexes> {
        console.log('Skal lagre entities: ', entities);
        if ((await db.offlineContent) !== undefined) {
            return await db.offlineContent.bulkAdd(entities);
        }
        throw Error(`Entities ${entities} not added to database.`);
    }

    async getByApiPath(apiPath: string): Promise<Entity> {
        const result = await db.offlineContent
            .where('apipath')
            .equals(apiPath)
            .first();
        if (result != undefined) {
            console.log('getByapiPath, har funnet objekt i db'); //, result);
        }
        return result as Entity;
    }
}

export { OfflineContentRepository };
