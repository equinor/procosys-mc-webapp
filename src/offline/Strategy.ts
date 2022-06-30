import { Attachment } from './../services/apiTypes';
import { CheckListSubTypes, PunchSubTypes, SubTypesAttachment } from './Entity';
import { Data } from '@microsoft/applicationinsights-common';
import { HttpMessage, IHttpMessage, IHttpRequestMessage } from './Http';
import { Person } from '../services/apiTypes';
import { ProcosysApiService } from '../services/procosysApi';

export type StrategyTypes =
    | CheckListSubTypes
    | PunchSubTypes
    | SubTypesAttachment;

export type ApiType = Attachment;
export interface IStrategy<ApiType> {
    service: ProcosysApiService;
    httpMessage: IHttpMessage<ApiType>;
    execute(): void;
    getExecutedDate(): Date | undefined;
    getExecutedBy(): Person | undefined;
}

class Strategy<StrategyTypes> implements IStrategy<ApiType> {
    readonly httpMessage: IHttpMessage<ApiType>;
    service: ProcosysApiService;
    executedDate: Date | undefined;
    executedBy: Person | undefined;

    constructor(service: ProcosysApiService) {
        this.httpMessage = new HttpMessage<Attachment>();
        this.service = service;
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
