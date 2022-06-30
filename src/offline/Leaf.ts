import { server } from './../test/setupServer';
import { Attachment } from './../services/apiTypes';
import { Component, LeafOperationType } from './Composite';
import { IStrategy, AttachmentStrategy } from './Strategy';
import { ProcosysApiService } from '../services/procosysApi';

export class Leaf extends Component {
    readonly operationType: LeafOperationType;
    readonly procosysApiService: ProcosysApiService;
    constructor(operationType: LeafOperationType, service: ProcosysApiService) {
        super();
        this.operationType = operationType;
        this.procosysApiService = service;
    }

    public operation(): string {
        // return 'Leaf';
        return `Leaf:${this.operationType.type}`;
    }
}

export class GetCheckListAttachmentsLeaf extends Leaf {
    strategy: IStrategy<Attachment>;
    constructor(service: ProcosysApiService) {
        super({ type: 'CheckListOperationType' }, service);
        this.strategy = new AttachmentStrategy();
    }

    public operation(): string {
        // return 'Leaf';
        return `Leaf:${this.operationType.type}`;
    }
}
