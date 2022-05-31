// import { faker } from '@faker-js/faker';
import { FakerAlphaCode } from './fakerSimpleTypes';
import { FindSubPatterns } from './findSubPatterns';

/* Custom made syntax faker: 
Create and template for target syntax e.g. "XX-AAA-XXA-XXXXX" 
X will be replaced with a random number [0..9]
XX will be replaced with a random number [10..99]
XXX will be replaced with a random number [100..999]

A will be replaced with an alpha char like [A..Z]
AA  will be replaced with a sequence of alpha chars like [A..Z][A..Z]
AAA will be replaced with a sequence of alpha chars like [A..Z][A..Z][A..Z]
*/
export const FakerSyntax = (syntax = 'XX-AAA-XXA-XXXXX'): string => {
    const subPatterns: Array<string> = syntax.split('-');
    const results: Array<string> = [];

    subPatterns.forEach((subString) => {
        const discoveredPatterns = FindSubPatterns(subString);
        discoveredPatterns.forEach((pattern) => {
            const num = pattern.length - 1;
            if (pattern.startsWith('X')) {
                results.push(randomFixedInteger(num).toString());
            } else if (pattern.startsWith('A')) {
                results.push(FakerAlphaCode(num));
            }
        });
    });
    let result = '';
    for (let i = 0; i < results.length; i++) {
        if (i < results.length - 1) result += `${results[i]}-`;
        else result += `${results[i]}`;
    }

    return result;
};

const randomFixedInteger = (length: number): number => {
    return Math.floor(
        Math.pow(10, length - 1) +
            Math.random() *
                (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
};
