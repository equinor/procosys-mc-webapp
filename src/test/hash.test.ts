import { hashGenerator2 } from "../routing/hash";
import { describe, expect, it } from '@jest/globals'


describe('hashGenerator2 testing', () => {
    it('should return a hash', () => {
        const hash = hashGenerator2('/test', ['n', 'm']);
        expect(hash).toBe(-2114169182);
    });

    it('should return a hash when args contains string of digits and values', () => {
        const hash = hashGenerator2('/test', ['n', '10', 'm', '20']);
        expect(hash).toBe(2132228991);
    });
})

describe('Performance testing', () => {
    it('should measure the time generating a number of hashes', () => {
        let startTime = performance.now();
        for (var i = 0; i < 1000; i++) {
            hashGenerator2('/api/test', ['n', '10', 'm', '20']);
        };
        let endTime = performance.now()
        let consumedTime = endTime - startTime;
        expect(consumedTime).toBeLessThan(1000);
    });

});