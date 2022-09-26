import { db } from './db';
import { IStatus } from './status';

export class StatusRepository {
    async getStatus(): Promise<IStatus> {
        const result = await db.offlineStatus
            .where('name')
            .equals('offline')
            .first();
        return result as IStatus;
    }

    async addOfflineStatus(status: boolean): Promise<void> {
        localStorage.setItem('offline', status.toString());
        await db.offlineStatus.add({ name: 'offline', status: status });
    }

    async updateStatus(newStatus: boolean): Promise<void> {
        localStorage.setItem('offline', newStatus.toString());
        await db.offlineStatus.update('offline', { status: newStatus });
    }
}
