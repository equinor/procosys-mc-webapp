import { IEntity } from './IEntity';

export class Entity implements IEntity {
    entityid: number;
    entitytype: string;
    response: Response;

    constructor(entityid: number, entitytype: string, response: Response) {
        this.entityid = entityid;
        this.entitytype = entitytype;
        this.response = response;
    }
}
