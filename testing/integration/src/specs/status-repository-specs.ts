import * as should from 'should';
import * as chai from 'chai';
import 'chai/register-should';
import { StatusRepository } from '../../../../src/database/StatusRepository';
import { db } from '../../../../src/database/db';
import { stat } from 'fs/promises';
import { IStatus } from '../../../../src/database/status';
import { off } from 'process';

describe('Given a StatusRepository', () => {
    before(function () {
        // runs once before the first test in this block
    });

    after(function () {
        // runs once after the last test in this block
    });

    beforeEach(function () {});

    afterEach(function () {
        // runs after each test in this block
    });

    const offlineMode: boolean | undefined = undefined;

    it('should be possible to set offline mode', async () => {
        const statusRepository = new StatusRepository();
        await statusRepository.addOfflineStatus(true);
        statusRepository
            .getStatus()
            .then((status) => {
                chai.expect(status.status).to.be.true;
            })
            .catch((error) => console.log(error));
    });

    it('should be possible to go back from offline mode', async () => {
        const statusRepository = new StatusRepository();
        await statusRepository.addOfflineStatus(true);

        const status1 = (await statusRepository.getStatus()) as IStatus;
        const status2 = await statusRepository.addOfflineStatus(false);

        const status3 = (await statusRepository.getStatus()) as IStatus;

        status3.status.should.be.equal(status1.status);
    });
});
