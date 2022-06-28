import { Attachment } from './../services/apiTypes';
import { Component, LeafOperationType } from './Composite';
import { IStrategy, AttachmentStrategy } from './Strategy';

export class Leaf extends Component {
    readonly operationType: LeafOperationType;
    constructor(operationType: LeafOperationType) {
        super();
        this.operationType = operationType;
    }

    public operation(): string {
        // return 'Leaf';
        return `Leaf:${this.operationType.type}`;
    }
}

export class GetCheckListAttachmentsLeaf extends Leaf {
    strategy: IStrategy<Attachment>;
    constructor() {
        super({ type: 'CheckListOperationType' });
        this.strategy = new AttachmentStrategy();

    }

    public operation(): string {
        // return 'Leaf';
        return `Leaf:${this.operationType.type}`;
    }
}
