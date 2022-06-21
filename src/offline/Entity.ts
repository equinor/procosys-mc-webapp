import { PkceCodes } from '@azure/msal-common';
import {
    ChecklistPreview,
    McPkgPreview,
    PoPreview,
    TagPreview,
    WoPreview,
} from '../services/apiTypes';
import { IStrategy } from './Strategy';

export interface IVisitor {
    visit(visitor: IVisitor): void;
}




export type EntityType = McPkgPreview | TagPreview | WoPreview | PoPreview;
export class Entity<T, EntityType> implements IWorker<T>, IVisitor {
    strategies: Array<IStrategy<EntityType>> | undefined;

    constructor(strategies: Array<IStrategy<EntityType>>) {
        this.strategies = strategies;
    }

    visit(visitor: IVisitor): void {
        visitor.visit(this);
    }
    doWork(): void {
        throw new Error('Method not implemented.');
    }
    addWork<S>(strategy: IStrategy<S>): void {
        throw new Error('Method not implemented.');
    }
}

export abstract class McPkg<McPkgPreview> extends Entity<
    McPkgPreview,
    ChecklistPreview
> {
    constructor(strategies: Array<IStrategy<ChecklistPreview>>) {
        super(strategies);
    }
}
