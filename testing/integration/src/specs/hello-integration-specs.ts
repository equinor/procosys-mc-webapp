import { expect } from 'chai';
import 'chai/register-should';

describe('Given some basic prof of concepts', () => {
    it('test 1', () => {
        true.should.be.true;
    });
    it('test 2', () => {
        expect(true).to.be.true;
    });
});
