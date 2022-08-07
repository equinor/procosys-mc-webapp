import Dexie, { Table } from 'dexie';
import { Entity, EntityIndexes, IEntity } from './entity';
import { IStatus, Status } from './status';

export default class OfflineStorage extends Dexie {
    offlineStatus!: Table<IStatus>;
    offlineContent!: Table<IEntity, EntityIndexes>;
    static offlineContent: any;

    constructor() {
        super('offlineStorage');
        this.version(1).stores(
            {
                offlineStatus: 'name',
                offlineContent: '++id, entityid, entitytype',
            }
        );

        this!.offlineStatus.mapToClass(Status);
        this!.offlineContent.mapToClass(Entity);
    }
}

export const db = new OfflineStorage();
