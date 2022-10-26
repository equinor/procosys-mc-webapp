import Dexie, { Table } from 'dexie';
import { Entity } from './Entity';
import { EntityIndexes } from './EntityIndexes';
import { IEntity } from './IEntity';
import { OfflineUpdateRequest } from './OfflineUpdateRequest';
import {
    applyEncryptionMiddleware,
    cryptoOptions,
    clearEncryptedTables,
    clearAllTables,
} from 'dexie-encrypted';

const nacl = require('tweetnacl');

export default class OfflineStorage extends Dexie {
    offlineContent!: Table<IEntity, EntityIndexes>;
    offlineUpdates!: Table<OfflineUpdateRequest>;
    static offlineContent: any;

    constructor() {
        super('ProCoSysMcAppDB');
        console.log('NÅ OPPRETTES DATABASE -construkctur');
    }

    /**
     * Initialize the database
     */
    async init(userPin: string): Promise<void> {
        if (this.isOpen()) {
            this.close();
        }
        this.version(1).stores({
            offlineContent: 'apipath, parententityid, entityid, entitytype',
            offlineUpdates: 'seqno++',
        });

        this?.offlineContent.mapToClass(Entity);
        this?.offlineUpdates.mapToClass(OfflineUpdateRequest);

        const secret = new Uint8Array(32);
        for (let i = 0; i < userPin.length; i++) {
            secret[i] = Number(userPin.charAt(i));
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

    public async reInitAndVerifyPin(userPin: string): Promise<boolean> {
        this.init(userPin);

        //Check that we are able to encrypt data from the database
        const testEntity = await db.offlineContent
            .where('entitytype')
            .equals('test')
            .first();

        if (testEntity && testEntity.responseObj == 'test') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clear tables if they exists.
     */
    public async clearTables(): Promise<void> {
        if (this.offlineContent) {
            await this.offlineContent.clear();
        }
        if (this.offlineUpdates) {
            await this.offlineUpdates.clear();
        }
    }

    /**
     * Creates new database. Must be called when a new database is to be created.
     */
    public async create(userPin: string): Promise<void> {
        this.clearTables();

        this.init(userPin);

        //Add a test row. Will be used to verify userpin.
        const testEntity: Entity = {
            apipath: 'test',
            responseObj: 'test',
            entitytype: 'test',
            entityid: 0,
            parententityid: 0,
        };
        await this.offlineContent.add(testEntity);
    }
}

export const db = new OfflineStorage();
