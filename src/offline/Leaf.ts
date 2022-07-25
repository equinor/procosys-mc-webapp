import { server } from './../test/setupServer';
import { Attachment } from './../services/apiTypes';
import { Component, LeafOperationType } from './Composite';
import { IStrategy, AttachmentStrategy } from './Strategy';
import { ProcosysApiService } from '../services/procosysApi';

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

export class AttachmentLeaf extends Leaf {
    strategy: IStrategy<Attachment>;
    constructor() {
        super({ type: 'CheckListOperationType' });
        this.strategy = new AttachmentStrategy();
    }

    public operation(): string {
        const strategyResult = this.strategy.execute();
        return `AttachmentLeaf:${this.operationType.type}`;
    }
}
