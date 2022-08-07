import procosysApiByFetchService, { db } from '../../../../src/database/db';

import { expect } from 'chai';
import 'chai/register-should';
import { Entity, EntityRepository } from '../../../../src/database/entity';


describe('Given a fetchAPI', async () => {

    it('test dummy', () => {
        true.should.be.true;
    });

    it('should add a new entity record in database', async () => {


        var reps = new EntityRepository();
        const index = await reps.add({ entityid: 12, entitytype: 'test', data: 'datadatadata' });

        //index.entityid.should.equal(entity.entityid);
    });

});
