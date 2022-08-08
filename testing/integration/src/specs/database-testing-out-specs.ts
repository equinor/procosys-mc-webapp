import { expect } from 'chai';
import 'chai/register-should';
import { EntityRepository } from '../../../../src/database/EntityRepository';

describe('Given a fetchAPI', async () => {
    it('test dummy', () => {
        true.should.be.true;
    });

    it('should add a new entity record in database', async () => {
        const reps = new EntityRepository();
        const index = await reps.Add({
            entityid: 12,
            entitytype: 'test',
            data: 'datadatadata',
        });

        //index.entityid.should.equal(entity.entityid);
    });
});
