import { Attachment } from './../services/apiTypes';
import { CheckListSubTypes, PunchSubTypes, SubTypesAttachment } from './Entity';
import { HttpMessage, IHttpMessage, IHttpRequestMessage } from './Http';
import { Person } from '../services/apiTypes';

export type StrategyTypes =
    | CheckListSubTypes
    | PunchSubTypes
    | SubTypesAttachment;

export type ApiType = Attachment;

export interface IStrategy<ApiType> {
    httpMessage: IHttpMessage<ApiType>;
    execute(): void;
    getExecutedDate(): Date | undefined;
    getExecutedBy(): Person | undefined;
}

class Strategy<ApiType> implements IStrategy<ApiType> {
    readonly httpMessage: IHttpMessage<ApiType>;
    executedDate: Date | undefined;
    executedBy: Person | undefined;

    constructor() {
        this.httpMessage = new HttpMessage<ApiType>();
    }

    getExecutedDate(): Date | undefined {
        return this.executedDate;
    }

    getExecutedBy(): Person | undefined {
        return this.executedBy;
    }

    async execute(): Promise<IHttpMessage<ApiType>> {
        return await this.httpMessage.executeRequestMessage();
    }

    getHash(): string {
        return this.httpMessage.getHash();
    }
}

export class AttachmentStrategy<Attachment> extends Strategy<Attachment> {
    constructor() {
        super();
    }

    async execute(): Promise<IHttpMessage<Attachment>> {
        return await this.httpMessage.executeRequestMessage();
    }
}
