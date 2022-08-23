import { expect } from 'chai';
import 'chai/register-should';
import { EntityRepository } from '../../../../src/database/EntityRepository';
import { db } from '../../../../src/database/db';
import 'dexie-export-import';
import { ExportOptions, ExportProgress } from 'dexie-export-import/dist/export';
import { IEntity } from '../../../../src/database/IEntity';
import { EntityIndexes } from '../../../../src/database/EntityIndexes';
import { deleteDBs } from './delete-dbs';

describe('Given a Entity database repository', async () => {
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
        // dbBackup = await db.export(option);
    });

    after(async () => {
        // await db.close();
        // console.log('Deleting database');
        // await deleteDBs(['offlineStorage']);
        // await db;
        // await db.import(dbBackup);
    });

    const testEnityId = 12;

    it('should be able to add a new Entity record into database', async () => {
        const reps = new EntityRepository();
        const entity: IEntity = {
            entityid: testEnityId,
            entitytype: 'test',
            data: 'datadatadata',
        };
        const seqId: EntityIndexes = await reps.Add(entity);
        console.log(seqId);

        expect(seqId).to.be.greaterThan(0);
    });

    it('should be able find a record in database', async () => {
        const reps = new EntityRepository();
        const searchingForEntity = await reps.find(testEnityId);
        expect(searchingForEntity).to.not.be.undefined;
        if (searchingForEntity !== undefined) {
            expect(searchingForEntity.entityid).to.be.equal(testEnityId);
        }
    });

    it('should be able to delete a record in database', async () => {
        const reps = new EntityRepository();
        const deletedId = await reps.delete(testEnityId);
        expect(deletedId).to.be.equal(1);
        const searchResult = await reps.find(testEnityId);
        expect(searchResult).to.be.undefined;
    });
});

/*
Hi my name is: Dan and I have a family of people that are members of the database
*/
