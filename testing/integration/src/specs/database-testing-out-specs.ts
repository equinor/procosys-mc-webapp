import { expect } from 'chai';
import 'chai/register-should';
import { EntityRepository } from '../../../../src/database/EntityRepository';
import { db } from '../../../../src/database/db';
import 'dexie-export-import';
import { ExportOptions, ExportProgress } from 'dexie-export-import/dist/export';
import { IEntity } from '../../../../src/database/IEntity';
import { EntityIndexes } from '../../../../src/database/EntityIndexes';

describe('Given a fetchAPI', async () => {
    const backupProgress = (progress: ExportProgress): boolean => {
        console.log('progress:', progress.completedRows);
        return true;
    };

    let dbBackup: Blob;

    const option: ExportOptions = {
        noTransaction: true,
        numRowsPerChunk: 100,
        prettyJson: true,
        // filter?: (table: string, value: any, key?: any) => boolean;
        progressCallback: (progress: ExportProgress): boolean => {
            console.log('progress:', progress.completedRows);
            return true;
        },
    };

    before(async () => {
        dbBackup = await db.export(option);
    });

    after(async () => {
        await db.import(dbBackup);
    });

    it('should add a new entity record in database', async () => {
        const reps = new EntityRepository();
        const entity: IEntity = {
            entityid: 12,
            entitytype: 'test',
            data: 'datadatadata',
        };
        const seqId: EntityIndexes = await reps.Add(entity);
        console.log(seqId);

        expect(seqId).to.be.greaterThan(0);
    });
});
