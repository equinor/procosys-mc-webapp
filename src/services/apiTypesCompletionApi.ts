type Guid = string;
type DateTimeString = string; // ISO 8601 date time string

interface OrganizationDetail {
    guid: Guid;
    code: string;
    description: string;
}

interface PriorityAndSorting {
    guid: Guid;
    code: string;
    description: string;
}

export interface PunchOrganization {
    id: number;
    parentId: number;
    code: string;
    description: string;
}

export interface LibrayTypes {
    guid: string;
    libraryType: string;
    code: string;
    description: string;
}

export interface Document {
    guid: Guid;
    no: string;
    title: string;
    revisionNo: string;
    revisionId: number;
    documentId: number;
    documentNo: string;
    relationType: DocumentRelationType;
    attachments: DocumentAttachment[];
}

export interface DocumentData {
    guid: Guid;
    no: string;
}

export enum DocumentRelationType {
    BOUNDARY = 'Boundary',
    OTHER = 'Other',
}

export interface DocumentAttachment {
    id: number;
    guid: string;
    rowVersion: string;
    fileName: string;
    title: string;
    mimeType: string;
    fileId: number;
    sortKey: number;
    uri?: string;
}

export interface SWCR {
    guid: Guid;
    no: number;
}

export type NewPunchItem = Pick<PunchItem, 'category' | 'description'> & {
    clearingByOrgGuid: string;
    raisedByOrgGuid: string;
};

export interface PunchItem {
    [index: string]: any;
    guid: Guid;
    projectName: string;
    itemNo: number;
    category: string;
    description: string;
    createdBy: User;
    createdAtUtc: DateTimeString;
    modifiedBy: User;
    modifiedAtUtc: DateTimeString;
    isReadyToBeCleared: boolean;
    isReadyToBeUncleared: boolean;
    clearedBy: User;
    clearedAtUtc: DateTimeString;
    isReadyToBeRejected: boolean;
    rejectedBy: User;
    rejectedAtUtc: DateTimeString;
    isReadyToBeVerified: boolean;
    isReadyToBeUnverified: boolean;
    verifiedBy: User;
    verifiedAtUtc: DateTimeString;
    raisedByOrg: OrganizationDetail;
    clearingByOrg: OrganizationDetail;
    priority: PriorityAndSorting;
    sorting: PriorityAndSorting;
    type: PriorityAndSorting;
    actionBy: User;
    dueTimeUtc: DateTimeString;
    estimate: number;
    externalItemNo: string;
    materialRequired: boolean;
    materialETAUtc: DateTimeString;
    materialExternalNo: string;
    workOrder: WorkOrder;
    originalWorkOrder: WorkOrder;
    document: Document;
    swcr: SWCR;
    rowVersion: string;
    attachments?: Attachment[];
    attachmentCount: number;
}

export interface TagInfo {
    Responsible: string;
    FormType: string;
    TagDescription: string;
    TagNo: string;
    CheckListGuid: string;
}

interface User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    officePhoneNo: null;
    mobilePhoneNo: null;
    isVoided: boolean;
    nameAndUserNameAsString: string;
    fullName: string;
    fullNameFormal: string;
}

export interface Attachment extends AttachmentData {
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

export interface AttachmentData {
    parentGuid: string;
    guid: string;
    fullBlobPath: string;
    sasUri?: string;
    fileName: string;
    description: string;
    labels: string[];
    createdBy: {
        guid: string;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
    } | null;
    createdAtUtc: string | null;
    modifiedBy: {
        guid: string;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
    } | null;
    modifiedAtUtc: string | null;
    rowVersion: string;
}

export type MessageType = {
    [index: string]: any;
    show: boolean;
    text?: string;
};
export type PunchContextType = {
    punchGuid: string;
    fetchPunch: (
        guid: string,
        showLoading?: boolean,
        skipCalls?: SkipCallsType
    ) => Promise<unknown>;
    punchData: PunchItem;
    setPunchData: (p: PunchItem) => void;
    labels: { picture: string[]; comment: string[] };
    isNewPunch: boolean;
    tagInfo: TagInfo;
    setViewType: (l: viewType) => void;
    setMessage: (e: MessageType) => void;
    viewType: viewType;
    deleteModalOpen: boolean;
    setDeleteModalOpen: (e: boolean) => void;
};

export type viewType = 'column' | 'list';

export type Person = {
    id: number;
    azureOid: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
};
export type WorkOrder = {
    no: string;
    guid: string;
};
export type OptionsType = {
    label: string;
    value: string;
    libraryType?: string;
    code?: string;
}[];

export type SkipCallsType = {
    attachments?: boolean;
    comments?: boolean;
    punch?: boolean;
};
