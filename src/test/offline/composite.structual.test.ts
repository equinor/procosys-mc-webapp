import { Component, Composite, Leaf } from '../../offline/Composite';

describe('', () => {
    beforeAll(() => {});

    afterAll(() => {});

    test('Add leaf to component', () => {
        const composite = new Composite();
        composite.add(new Leaf());
        composite.add(new Leaf());
        composite.add(new Leaf());
        expect(composite.operation()).toBe('Branch(Leaf+Leaf+Leaf)');
    });
});
