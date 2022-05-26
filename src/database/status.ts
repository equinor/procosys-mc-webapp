export interface IStatus {
    name: string;
    status: boolean;
}

export class Status implements IStatus {
    name!: string;
    status!: boolean;
}
