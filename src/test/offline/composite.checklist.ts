import { LeafOperationType } from './../../offline/Composite';
import { Component, Composite } from '../../offline/Composite';
import { Leaf } from '../../offline/Leaf';

describe('Should be able to create a CheckList', () => {
    const operationType: LeafOperationType = {
        type: 'op-type-attachments',
    };

    const mcPkt = new Composite();
    const mcPktAttachments = new Composite();
    const workMcPktAttachements = new Leaf(operationType);
    mcPktAttachments.add(workMcPktAttachements);

    const checkList = new Composite();
    const checkListItem1 = new Composite();
    const work1 = new Leaf(operationType);
    const checkListItem2 = new Composite();
    const work2 = new Leaf(operationType);
    const checkListItem3 = new Composite();
    const work3 = new Leaf(operationType);

    checkList.add(checkListItem1);
    checkList.add(checkListItem2);
    checkList.add(checkListItem3);

    mcPkt.setParent(checkList);

    beforeAll(() => {});

    afterAll(() => {});

    test('Add leaf to component', () => {
        checkList.add(new Leaf(operationType));

        expect(checkList.operation()).toBe('Branch(op-type-attachments)');
    });

    test('Add Attachments to a CheckList', () => {});
});
