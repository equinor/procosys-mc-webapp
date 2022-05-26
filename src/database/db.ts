import Dexie, { Table } from 'dexie';
import { IStatus, Status } from './status';

export default class OfflineStorage extends Dexie {
    public readonly dbName: string = 'offlineStorage';
    offlineStatus!: Table<IStatus>;

    constructor() {
        super('offlineStorage');
        this.version(1).stores({
            offlineStatus: 'name',
        });

        this.offlineStatus.mapToClass(Status);
    }
}

export const db = new OfflineStorage();
