import procosysApiByFetchService, { db } from '../../../../src/database/db';

import { expect } from 'chai';
import 'chai/register-should';


describe('Given a fetchAPI', async () => {

    it('test dummy', () => {
        true.should.be.true;
    });

    it('should add a new entity record in database', async () => {
        db.offlineContent.add({ entityid: 12, entitytype: 'test', data: 'datadatadata' }, { entityid: 12, entitytype: 'test' })
        true.should.be.true;
    });

});
