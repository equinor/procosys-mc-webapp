import { IEntity } from './IEntity';

export class Entity implements IEntity {
    entityid: number;
    entitytype: string;
    apipath: string;
    responseObj: string | Blob;

    constructor(
        entityid: number,
        entitytype: string,
        apipath: string,
        responseObj: string | Blob
    ) {
        this.entityid = entityid;
        this.entitytype = entitytype;
        this.apipath = apipath;
        this.responseObj = responseObj;
    }
}
