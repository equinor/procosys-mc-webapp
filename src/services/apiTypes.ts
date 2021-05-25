export enum CompletionStatus {
    OS = 'OS',
    PA = 'PA',
    PB = 'PB',
    OK = 'OK',
}

export type Project = {
    description: string;
    id: number;
    title: string;
};

export interface Plant {
    id: string;
    title: string;
    slug: string;
    projects?: Project[];
}

//SEARCH
export interface McPkgPreview {
    id: number;
    mcPkgNo: string;
    description: string;
    status: CompletionStatus;
    commPkgNo: string;
    phaseCode: string;
    responsibleCode: string;
    commissioningHandoverStatus: string;
    operationHandoverStatus: string;
}

export type SearchResults = {
    maxAvailable: number;
    items: McPkgPreview[];
};

// COMM PKG AND LISTS

export type CommPkg = {
    id: number;
    commPkgNo: string;
    description: string;
    commStatus: CompletionStatus;
    mcStatus: CompletionStatus;
    mcPkgCount: number;
    mcPkgsAcceptedByCommissioning: number;
    mcPkgsAcceptedByOperation: number;
    commissioningHandoverStatus: string;
    operationHandoverStatus: string;
    systemId: number;
};

export type ChecklistPreview = {
    id: number;
    tagNo: string;
    tagDescription: string;
    responsibleCode: string;
    status: CompletionStatus;
    formularType: string;
    formularGroup: string;
    isRestrictedForUser: boolean;
    hasElectronicForm: boolean;
    attachmentCount: number;
    isSigned: boolean;
    isVerified: boolean;
};

export type PunchPreview = {
    id: number;
    status: CompletionStatus;
    description: string;
    systemModule: string;
    tagDescription: string;
    tagId: number;
    tagNo: string;
    formularType: string;
    responsibleCode: string;
    isRestrictedForUser: boolean;
    cleared: boolean;
    rejected: boolean;
    verified: boolean;
    statusControlledBySwcr: boolean;
    attachmentCount: number;
    callOffNo?: string;
};

// CHECKLIST
export interface ChecklistDetails {
    id: number;
    tagNo: string;
    tagDescription: string;
    responsibleCode: string;
    responsibleDescription: string;
    status: CompletionStatus;
    systemModule: string;
    formularType: string;
    formularGroup: string;
    comment: string;
    signedByUser: string;
    signedByFirstName: string;
    signedByLastName: string;
    signedAt: Date;
    updatedAt: Date;
    updatedByUser: string;
    updatedByFirstName: string;
    updatedByLastName: string;
    isRestrictedForUser: boolean;
    hasElectronicForm: boolean;
}

export interface ColumnLabel {
    id: number;
    label: string;
}

export interface Cell {
    value: string;
    unit: string;
    columnId: number;
}

export interface Row {
    id: number;
    label: string;
    cells: Cell[];
}

export interface MetaTable {
    info: string;
    columnLabels: ColumnLabel[];
    rows: Row[];
}

export interface CheckItem {
    id: number;
    sequenceNumber: string;
    text: string;
    detailText: string;
    isHeading: boolean;
    hasImage: boolean;
    imageFileId: number;
    hasMetaTable: boolean;
    metaTable: MetaTable;
    isOk: boolean;
    isNotApplicable: boolean;
}

// TODO: change to match the mc and/or preservation checklist instead of comm
export interface ChecklistResponse {
    checkList: ChecklistDetails;
    checkItems: CheckItem[];
}

export interface PunchCategory {
    id: number;
    code: string;
    description: string;
}

export interface PunchType {
    id: number;
    parentId: number;
    code: string;
    description: string;
}

export interface PunchOrganization {
    id: number;
    parentId: number;
    code: string;
    description: string;
}

export interface NewPunch {
    CheckListId: number;
    CategoryId: number;
    Description: string;
    TypeId: number;
    RaisedByOrganizationId: number;
    ClearingByOrganizationId: number;
    TemporaryFileIds: string[];
}

export interface PunchItem {
    id: number;
    checklistId: number;
    formularType: string;
    status: string;
    description: string;
    typeCode: string;
    typeDescription: string;
    raisedByCode: string;
    raisedByDescription: string;
    clearingByCode: string;
    clearingByDescription: string;
    clearedAt?: null;
    clearedByUser?: null;
    clearedByFirstName?: null;
    clearedByLastName?: null;
    verifiedAt?: null;
    verifiedByUser?: null;
    verifiedByFirstName?: null;
    verifiedByLastName?: null;
    rejectedAt?: null;
    rejectedByUser?: null;
    rejectedByFirstName?: null;
    rejectedByLastName?: null;
    dueDate?: null;
    estimate?: null;
    priorityId?: null;
    priorityCode?: null;
    priorityDescription?: null;
    actionByPerson: number;
    actionByPersonFirstName?: null;
    actionByPersonLastName?: null;
    materialRequired: boolean;
    materialEta?: null;
    materialNo?: null;
    systemModule: string;
    tagDescription: string;
    tagId: number;
    tagNo: string;
    responsibleCode: string;
    responsibleDescription: string;
    sorting?: null;
    statusControlledBySwcr: boolean;
    isRestrictedForUser: boolean;
    attachmentCount: number;
}

export interface Attachment {
    id: number;
    uri: string;
    title: string;
    createdAt: Date;
    classification: string;
    mimeType: string;
    thumbnailAsBase64: string;
    hasFile: boolean;
    fileName: string;
}
