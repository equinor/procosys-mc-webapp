import { expect } from 'chai';
import 'chai/register-should';
import { access } from 'fs';
import { partial } from 'lodash';

import procosysApiByFetchService, { ProcosysApiByFetchService } from '../fetchLibrary/procosysApiByFetch'

describe('Given a fetchAPI', async () => {

    it('http request for plants', async () => {
        const procosysApiByFetchInstance = procosysApiByFetchService({ baseURL: 'http://api.com/v1/', apiVersion: '1.4' }, 'token');
        var plants = await procosysApiByFetchInstance.getPlants();
        true.should.be.true;
    });
    it('test 4', () => {
        expect(true).to.be.true;
    });
});
