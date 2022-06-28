import { LeafOperationType } from './../../offline/Composite';
import { Component, Composite } from '../../offline/Composite';
import { Leaf } from '../../offline/Leaf';

describe('Should be able to create a CheckList', () => {
    const operationType: LeafOperationType = {
        type: 'op-type-attachments',
    };
    const checkList = new Composite();
    
    beforeAll(() => {});

    afterAll(() => {});

    test('Add leaf to component', () => {
        checkList.add(new Leaf(operationType));

        expect(checkList.operation()).toBe('Branch(op-type-attachments)');
    });

    test('Add Attachments to a CheckList', () => {
        
    });
});
