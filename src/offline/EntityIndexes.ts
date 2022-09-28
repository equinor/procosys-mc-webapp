import { IEntity } from './IEntity';

export type EntityIndexes = Pick<
    IEntity,
    'apipath' | 'entityid' | 'entitytype' | 'parententityid'
>;
