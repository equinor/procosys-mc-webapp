import Dexie, { Table } from 'dexie';

export default interface IEntity {
    entityid: number;
    entitytype: string;
    // response: Response
    // request: Request
    data: string;
}

export type EntityIndexes = Pick<IEntity, 'entityid' | 'entitytype'>;
