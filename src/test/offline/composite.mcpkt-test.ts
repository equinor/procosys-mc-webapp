import { LeafOperationType } from './../../offline/Composite';
import { Component, Composite } from '../../offline/Composite';
import { Leaf } from '../../offline/Leaf';

describe('Composite and leaf testing', () => {
    beforeAll(() => {});

    afterAll(() => {});

    test('Add leaf to component', () => {
        const operationType: LeafOperationType = { type: 'op-type' };
        const composite = new Composite();
        composite.add(new Leaf(operationType));
        composite.add(new Leaf(operationType));
        composite.add(new Leaf(operationType));
        expect(composite.operation()).toBe(
            'Branch(Leaf:op-type+Leaf:op-type+Leaf:op-type)'
        );
    });
    test('Add leaf to component', () => {
        const operationType: LeafOperationType = { type: 'op-type' };
        const mcPkt = new Composite();
        mcPkt.add(new Leaf(operationType));
        
        expect(mcPkt.operation()).toBe(
            'Branch(Leaf:op-type+Leaf:op-type+Leaf:op-type)'
        );
    });
});
