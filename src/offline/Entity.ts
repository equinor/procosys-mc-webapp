import { SearchType } from '../typings/enums';
import { IEntity } from './IEntity';

export class Entity implements IEntity {
    apipath: string;
    responseObj: any;
    entitytype: string;
    entityid?: number;
    parententityid?: number;
    searchType?: SearchType;

    constructor(
        apipath: string,
        responseObj: any,
        entitytype: string,
        entityid?: number,
        parententityid?: number,
        searchType?: SearchType
    ) {
        this.apipath = apipath;
        this.responseObj = responseObj;
        this.entitytype = entitytype;
        this.entityid = entityid;
        this.parententityid = parententityid;
        this.searchType = searchType;
    }
}
