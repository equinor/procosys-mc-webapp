import Dexie from 'dexie';
import { Status } from './status';
export default class OfflineStorage extends Dexie {
    constructor() {
        super('offlineStorage');
        this.dbName = 'offlineStorage';
        this.version(1).stores({
            offlineStatus: 'name',
        });
        this.offlineStatus.mapToClass(Status);
    }
}
export const db = new OfflineStorage();
//# sourceMappingURL=db.js.map