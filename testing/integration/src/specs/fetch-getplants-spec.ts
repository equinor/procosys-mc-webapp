import { expect } from 'chai';
import 'chai/register-should';
import { access } from 'fs';
import { partial } from 'lodash';


// import { ProcosysApiByFetchServices } from '@mc-app-services'
import * as api from 'C:\Appl/Source/Equinor/procosys-mc-webapp/src/services';
import * as utils from 'C:/Appl/Source/Equinor/procosys-mc-webapp/src/util/*';
import * as utils from 'C:/Appl/Source/Equinor/procosys-mc-webapp/src/util/*';




import { ProcosysApiByFetchServices } from '@mc-app-services';


describe('Given a fetchAPI', () => {
    //const api = procosysApiByFetchServices;

    const myapi = api;
    const myutils = utils;
    it('http request for plants', () => {
        true.should.be.true;
    });
    it('test 4', () => {
        expect(true).to.be.true;
    });
});
