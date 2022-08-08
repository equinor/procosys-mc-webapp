import IEntity from './IEntity';

export class Entity implements IEntity {
    entityid!: number;
    entitytype!: string;
    data!: string;
}
