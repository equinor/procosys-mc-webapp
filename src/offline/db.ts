import Dexie, { Table } from 'dexie';
import { Entity } from './Entity';
import { EntityIndexes } from './EntityIndexes';
import { IEntity } from './IEntity';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';
import { IStatus, Status } from './status';

export default class OfflineStorage extends Dexie {
    offlineStatus!: Table<IStatus>;
    offlineContent!: Table<IEntity, EntityIndexes>;
    offlineUpdates!: Table<OfflineUpdateRequest>;
    static offlineContent: any;

    constructor() {
        super('ProCoSysMcAppDB');
        this.version(1).stores({
            offlineStatus: 'name',
            offlineContent: 'apipath, parententityid, entityid, entitytype',
            offlineUpdates: 'seqno++',
        });

        this?.offlineStatus.mapToClass(Status);
        this?.offlineContent.mapToClass(Entity);
        this?.offlineUpdates.mapToClass(OfflineUpdateRequest);
    }
}

export const db = new OfflineStorage();
