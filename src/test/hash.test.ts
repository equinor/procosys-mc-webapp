import { HashGenerator } from '../routing/hash';

describe('Testing the hash generator', () => {
    it('should return a hash', () => {
        const hash = HashGenerator('/test' + ['n', 'm']);
        expect(hash).toBe(-1114736178);
    });

    it('should return a hash when args contains string of digits and values', () => {
        const hash = HashGenerator('/test' + ['n', '10', 'm', '20']);
        expect(hash).toBe(753165291);
    });

    it('should generate the same hash when content is the same', () => {
        const hash1 = HashGenerator('/test' + ['n', 'm']);
        expect(hash1).toBe(-1114736178);

        const hash2 = HashGenerator('/test' + ['n', 'm']);
        expect(hash2).toBe(-1114736178);

        expect(hash1).toBe(hash2);
    });

    it('should return a different hash when paramters is swapped', () => {
        const hash1 = HashGenerator('/test' + ['n', 'm']);
        const hash2 = HashGenerator('/test' + ['m', 'n']);
        expect(hash1).not.toBe(hash2);
    });
});

describe('Performance testing', () => {
    it('should measure the time generating a number of hashes', () => {
        const startTime = performance.now();
        for (let i = 0; i < 1000; i++) {
            HashGenerator('/api/test' + ['n', '10', 'm', '20']);
        }
        const endTime = performance.now();
        const consumedTime = endTime - startTime;
        expect(consumedTime).toBeLessThan(1000);
    });
});
