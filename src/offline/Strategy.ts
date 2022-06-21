import { Data } from '@microsoft/applicationinsights-common';
import { Person } from '../services/apiTypes';
import { IHttpMessage } from './Http';

export interface IStrategy<T> {
    httpMessage: IHttpMessage<T>;
    execute(): void;
    getExecutedDate(): Date | undefined;
    getExecutedBy(): Person | undefined;
}

class GetEntityStrategy<T> implements IStrategy<T> {
    readonly httpMessage: IHttpMessage<T>;
    executedDate: Date | undefined;
    executedBy: Person | undefined;

    constructor(httpMessage: IHttpMessage<T>) {
        this.httpMessage = httpMessage;
    }
    getExecutedDate(): Date | undefined {
        return this.executedDate;
    }
    getExecutedBy(): Person | undefined {
        return this.executedBy;
    }

    async execute(): Promise<IHttpMessage<T>> {
        return await this.httpMessage.executeRequestMessage();
    }

    getHash(): string {
        return this.httpMessage.getHash();
    }
}
