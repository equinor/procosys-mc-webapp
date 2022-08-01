import { LeafOperationType } from './../../offline/Composite';
import { Component, Composite } from '../../offline/Composite';
import { AttachmentLeaf, Leaf } from '../../offline/Leaf';

describe('Composite and leaf testing', () => {
    beforeAll(() => { });

    afterAll(() => { });

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

    // test('Add a Composite to another Composite', () => {
    //     const operationType1: LeafOperationType = { type: 'op-type1' };
    //     const operationType2: LeafOperationType = { type: 'op-type2' };

    //     const composite1 = new Composite();
    //     composite1.add(new AttachmentLeaf());

    //     const composite2 = new Composite();
    //     composite2.add(new Leaf(operationType2));

    //     composite1.add(composite2);

    //     expect(composite1.operation()).toBe(
    //         'Branch(Leaf:op-type1+Branch(Leaf:op-type2))'
    //     );
    // });
});
