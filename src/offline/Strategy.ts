import { Attachment } from './../services/apiTypes';
import { CheckListSubTypes, PunchSubTypes, SubTypesAttachment } from './Entity';
import { Data } from '@microsoft/applicationinsights-common';
import { IHttpMessage, IHttpRequestMessage } from './Http';
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

class Strategy<StrategyTypes> implements IStrategy<ApiType> {
    readonly httpMessage: IHttpMessage<ApiType>;
    executedDate: Date | undefined;
    executedBy: Person | undefined;

    constructor(httpMessage: IHttpMessage<ApiType>) {
        this.httpMessage = httpMessage;
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

export class AttachmentStrategy extends Strategy<Attachment> {
    constructor() {}
}
