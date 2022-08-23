import { expect } from 'chai';
import 'chai/register-should';

describe('Given even more tests', () => {
    it('test 3', () => {
        true.should.be.true;
    });
    it('test 4', () => {
        expect(true).to.be.true;
    });
});
