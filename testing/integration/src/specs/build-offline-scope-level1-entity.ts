import { expect } from 'chai';
import 'chai/register-should';

var makeRequest = require('./make-request');
var fetchMock = require('fetch-mock');

// Fetch-mock for simulating the main api - http://www.wheresrhys.co.uk/fetch-mock/


describe('Given even more tests', () => {

    beforeAll(() => {
        fetchMock.get('http://pcs-main-api/getEntityDetails/', { hello: 'world' }, {
            delay: 1000, // fake a slow network
            headers: {
                user: 'me' // only match requests with certain headers
            }
        });

    });
    it('test 3', () => {
        true.should.be.true;
    });
    it('test 4', () => {
        expect(true).to.be.true;
    });
});
