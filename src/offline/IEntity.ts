import { SearchType } from '../typings/enums';

export interface IEntity {
    apipath: string;
    responseObj: any;
    entitytype: string;
    entityid?: number;
    parententityid?: number;
    searchtype?: SearchType;
}
