import Dexie, { Table } from 'dexie';
import { Entity } from './Entity';
import { EntityIndexes } from './EntityIndexes';
import { IEntity } from './IEntity';
import { IStatus, Status } from './status';

export default class OfflineStorage extends Dexie {
    offlineStatus!: Table<IStatus>;
    offlineContent!: Table<IEntity, EntityIndexes>;
    static offlineContent: any;

    constructor() {
        super('ProCoSysMcAppDB');
        this.version(1).stores({
            offlineStatus: 'name',
            offlineContent: 'entityid, entitytype, apipath',
        });

        this?.offlineStatus.mapToClass(Status);
        this?.offlineContent.mapToClass(Entity);
    }
}

export const db = new OfflineStorage();
