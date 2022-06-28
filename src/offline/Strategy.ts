import { CheckListSubTypes, PunchSubTypes, SubTypesAttachment } from './Entity';
import { Data } from '@microsoft/applicationinsights-common';
import { Person } from '../services/apiTypes';
import { IHttpMessage } from './Http';

export type StrategyTypes =
    | CheckListSubTypes
    | PunchSubTypes
    | SubTypesAttachment;

export interface IStrategy<StrategyTypes> {
    httpMessage: IHttpMessage<StrategyTypes>;
    execute(): void;
    getExecutedDate(): Date | undefined;
    getExecutedBy(): Person | undefined;
}

class Strategy<StrategyTypes> implements IStrategy<StrategyTypes> {
    readonly httpMessage: IHttpMessage<StrategyTypes>;
    executedDate: Date | undefined;
    executedBy: Person | undefined;

    constructor(httpMessage: IHttpMessage<StrategyTypes>) {
        this.httpMessage = httpMessage;
    }
    getExecutedDate(): Date | undefined {
        return this.executedDate;
    }
    getExecutedBy(): Person | undefined {
        return this.executedBy;
    }

    async execute(): Promise<IHttpMessage<StrategyTypes>> {
        return await this.httpMessage.executeRequestMessage();
    }

    getHash(): string {
        return this.httpMessage.getHash();
    }
}
