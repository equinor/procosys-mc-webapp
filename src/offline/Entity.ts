import {
    Attachment,
    CheckItem,
    ChecklistDetails,
    CustomCheckItem,
    NewPunch,
    PunchCategory,
    PunchItem,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
} from './../services/apiTypes';
import { Attachments, Checklist } from '@equinor/procosys-webapp-components';
import { PkceCodes } from '@azure/msal-common';
import {
    ChecklistPreview,
    McPkgPreview,
    PoPreview,
    TagPreview,
    WoPreview,
} from '../services/apiTypes';
import { IStrategy, StrategyTypes } from './Strategy';
import { IWorker } from './Worker';
import { IVisitor } from './Visitor';

export type EntityTypes = McPkgPreview | TagPreview | WoPreview | PoPreview;

export type CheckListSubTypes =
    | CheckItem
    | CustomCheckItem
    | ChecklistPreview
    | ChecklistDetails
    | Attachment;
export type PunchSubTypes =
    | PunchCategory
    | PunchType
    | PunchOrganization
    | PunchSort
    | PunchPriority
    | NewPunch
    | PunchItem;

export type ApiType = Attachment;
export type SubTypesAttachment = Attachment;

export class Entity<EntityTypes, CheckListSubTypes>
    implements IWorker<StrategyTypes>, IVisitor
{
    strategies: Array<IStrategy<StrategyTypes>> | undefined;

    constructor(strategies: Array<IStrategy<StrategyTypes>>) {
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
    EntityTypes,
    CheckListSubTypes
> {
    constructor(strategies: Array<IStrategy<ChecklistPreview>>) {
        super(strategies);
    }
}
