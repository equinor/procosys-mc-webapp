import Dexie, { Table } from 'dexie';
import { Entity } from './Entity';
import { EntityIndexes } from './EntityIndexes';
import { IEntity } from './IEntity';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';
import { IStatus, Status } from './status';
import {
    applyEncryptionMiddleware,
    cryptoOptions,
    clearAllTables,
} from 'dexie-encrypted';

const nacl = require('tweetnacl');

export default class OfflineStorage extends Dexie {
    offlineStatus!: Table<IStatus>;
    offlineContent!: Table<IEntity, EntityIndexes>;
    offlineUpdates!: Table<OfflineUpdateRequest>;
    static offlineContent: any;

    constructor() {
        super('ProCoSysMcAppDB');
        console.log('NÅ OPPRETTES DATABASE');

        this.version(4).stores({
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

const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

applyEncryptionMiddleware(
    db,
    keyPair.publicKey,
    {
        offlineStatus: cryptoOptions.NON_INDEXED_FIELDS,
        offlineContent: cryptoOptions.NON_INDEXED_FIELDS,
        offlineUpdates: cryptoOptions.NON_INDEXED_FIELDS,
    },
    clearAllTables
);
