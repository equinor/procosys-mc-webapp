import { IEntity } from '@equinor/procosys-webapp-components';

export type EntityIndexes = Pick<
    IEntity,
    'apipath' | 'entityid' | 'entitytype' | 'parententityid' | 'searchtype'
>;
