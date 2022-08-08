import da from "date-fns/esm/locale/da/index.js";
import { IEntity } from "./IEntity";


export class Entity implements IEntity {
    entityid: number;
    entitytype: string;
    data: string;

    constructor(entityid: number, entitytype: string, data: string) {
        this.entityid = entityid;
        this.entitytype = entitytype;
        this.data = data;
    }
}