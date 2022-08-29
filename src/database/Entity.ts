import { IEntity } from './IEntity';

export class Entity implements IEntity {
    apipath: string;
    entityid: number;
    entitytype: string;
    responseObj: string | Blob;

    constructor(
        apipath: string,
        entityid: number,
        entitytype: string,
        responseObj: string | Blob
    ) {
        this.apipath = apipath;
        this.entityid = entityid;
        this.entitytype = entitytype;
        this.responseObj = responseObj;
    }
}
