import { expect } from 'chai';
import 'chai/register-should';

import fakeFetch from 'fake-browser-fetch';

describe('Fetch mocking', () => {


    it('testing mocking fetch call', () => {
        // fakeFetch([{
        //     request: '/api/users',
        //     response: new Response(JSON.stringify({ name: "Ameer Jhan" })),
        //     // delay in milliseconds
        //     delay: 3000
        // }]);

        // fetch('/api/users').then(res => res.json()).then(data => {
        //     expect(data.name).to.equal('Ameer Jhan');
        // });
    });

    it('test 4', () => {
        expect(true).to.be.true;
    });
});
