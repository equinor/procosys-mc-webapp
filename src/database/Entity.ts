import { AuthConfigResponse } from '../services/appConfiguration';
import { IEntity } from './IEntity';

export class Entity implements IEntity {
    apipath: string;
    entityid: number;
    entitytype: string;
    responseObj: any;

    constructor(
        apipath: string,
        entityid: number,
        entitytype: string,
        responseObj: any
    ) {
        this.apipath = apipath;
        this.entityid = entityid;
        this.entitytype = entitytype;
        this.responseObj = responseObj;
    }
}
