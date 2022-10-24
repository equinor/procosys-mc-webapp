import Dexie, { Table } from 'dexie';
import { Entity } from './Entity';
import { EntityIndexes } from './EntityIndexes';
import { IEntity } from './IEntity';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';
import { IStatus, Status } from './status';
import {
    applyEncryptionMiddleware,
    cryptoOptions,
    clearEncryptedTables,
} from 'dexie-encrypted';

const nacl = require('tweetnacl');

export default class OfflineStorage extends Dexie {
    offlineStatus!: Table<IStatus>;
    offlineContent!: Table<IEntity, EntityIndexes>;
    offlineUpdates!: Table<OfflineUpdateRequest>;
    static offlineContent: any;

    constructor() {
        super('ProCoSysMcAppDB');
        console.log('NÅ OPPRETTES DATABASE -construkctur');
    }

    public async init(userSecret: string): Promise<void> {
        if (this.isOpen()) {
            this.close();
        }
        this.version(4).stores({
            offlineStatus: 'name',
            offlineContent: 'apipath, parententityid, entityid, entitytype',
            offlineUpdates: 'seqno++',
        });

        this?.offlineStatus.mapToClass(Status);
        this?.offlineContent.mapToClass(Entity);
        this?.offlineUpdates.mapToClass(OfflineUpdateRequest);

        console.log('NÅ legger vi på krytering - init');
        const secret = new Uint8Array(32);
        for (let i = 0; i < userSecret.length; i++) {
            secret[i] = Number(userSecret.charAt(i));
        }
        const keyPair = nacl.sign.keyPair.fromSeed(secret);
        applyEncryptionMiddleware(
            db,
            keyPair.publicKey,
            {
                offlineContent: cryptoOptions.NON_INDEXED_FIELDS,
                offlineUpdates: cryptoOptions.NON_INDEXED_FIELDS,
            },
            clearEncryptedTables
        );
        if (!this.isOpen()) {
            await this.open();
        }
    }
}

export const db = new OfflineStorage();
