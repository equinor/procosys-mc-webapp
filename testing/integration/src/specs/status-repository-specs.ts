import * as should from 'should';
import * as chai from 'chai';
import 'chai/register-should';
import { StatusRepository } from '../../../../src/database/StatusRepository';
import { db } from '../../../../src/database/db';
import { stat } from 'fs/promises';
import { IStatus } from '../../../../src/database/status';
import { off } from 'process';

describe('Given a StatusRepository', () => {
    const statusRepository = new StatusRepository();
    const setOfflineMode = async (status: boolean) => {
        await statusRepository.addOfflineStatus(status);
    };

    before(function () {
        // runs once before the first test in this block
    });

    after(function () {
        // runs once after the last test in this block
    });

    beforeEach(function () {
        // runs before each test in this block
    });

    afterEach(function () {
        // runs after each test in this block
    });

    const offlineMode: boolean | undefined = undefined;

    it('should be possible to set offline mode', async () => {
        await statusRepository.addOfflineStatus(true);
        statusRepository
            .getStatus()
            .then((status) => {
                chai.expect(status.status).to.be.true;
            })
            .catch((error) => console.log(error));
    });

    it('should be possible to go back from offline mode', async () => {
        await statusRepository.addOfflineStatus(true);
        const offlineMode1: IStatus | undefined =
            await statusRepository.getStatus();
        const offlineMode2: IStatus | undefined =
            await statusRepository.getStatus();

        offlineMode1.status.should.be.equal(offlineMode2.status);

        await statusRepository.addOfflineStatus(false);

        statusRepository
            .getStatus()
            .then((status) => {
                const offlineMode2 = status;
                offlineMode2.status.should.be.false;
                offlineMode2.status.should.be.equal(offlineMode1.status);
            })
            .catch((error) => {
                console.log(error);
            });
    });
});
