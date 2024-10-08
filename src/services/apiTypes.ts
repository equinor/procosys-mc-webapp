import { ChecklistResponse } from '@equinor/procosys-webapp-components';
import * as tg from 'generic-type-guard';
import { IpoStatusEnum, OfflineScopeStatus } from '../typings/enums';

export type Entities =
    | Plant
    | Project
    | SearchResults
    | ChecklistPreview
    | PunchPreview
    | ChecklistResponse
    | PunchCategory
    | PunchType
    | PunchOrganization
    | NewPunch
    | PunchItem
    | Attachment
    | McPkgPreview
    | PunchSort
    | PunchPriority
    | Person
    | Tag
    | WoPreview
    | PoPreview
    | SavedSearch
    | PunchItemSavedSearchResult
    | ChecklistSavedSearchResult;

export enum CompletionStatus {
    OS = 'OS',
    PA = 'PA',
    PB = 'PB',
    OK = 'OK',
}

export type Project = {
    description: string;
    id: number;
    proCoSysGuid: string;
    title: string;
};

export interface Plant {
    id: string;
    title: string;
    slug: string;
    projects?: Project[];
}

export const isProject: tg.TypeGuard<Project> = new tg.IsInterface()
    .withProperties({
        description: tg.isString,
        id: tg.isNumber,
        proCoSysGuid: tg.isString,
        title: tg.isString,
    })
    .get();

export const isProjects = (project: unknown): tg.TypeGuard<Project[]> =>
    tg.isArray(isProject);

export const isPlant: tg.TypeGuard<Plant> = new tg.IsInterface()
    .withProperties({
        id: tg.isString,
        title: tg.isString,
        slug: tg.isString,
        projects: tg.isArray<Project>(isProject),
    })
    .get();

export const isPlants = (plant: unknown): tg.TypeGuard<Plant[]> =>
    tg.isArray(isPlant);

//SEARCH
export enum ApiSavedSearchType {
    CHECKLIST = 'Check Lists',
    PUNCH = 'Punch List Items',
}

export interface SavedSearch {
    id: number;
    name: string;
    description: string;
    type: ApiSavedSearchType;
}

export interface McPkgPreview {
    id: number;
    mcPkgNo: string;
    description: string;
    status: CompletionStatus;
    commPkgNo: string;
    phaseCode: string;
    phaseDescription: string;
    responsibleCode: string;
    responsibleDescription: string;
    commissioningHandoverStatus: string;
    operationHandoverStatus: string;
}

export interface WoPreview {
    id: number;
    workOrderNo: string;
    title: string;
    description: string;
    disciplineCode: string;
    disciplineDescription: string;
}

export interface TagPreview {
    id: number;
    tagNo: string;
    description: string;
    registerCode: string;
    tagFunctionCode: string;
    commPkgNo: string;
    mcPkgNo: string;
    callOffNo: string;
    punchaseOrderTitle: string;
    mccrResponsibleCode: string;
}

export interface PoPreview {
    callOffId: number;
    isPurchaseOrder: boolean;
    title: string;
    description: string;
    responsibleCode: string;
}

export interface IPOPreview {
    id: number;
    projectName: string;
    title: string;
    description: string;
    type: string;
}

export interface SearchResults {
    maxAvailable: number;
    items:
        | McPkgPreview[]
        | WoPreview[]
        | TagPreview[]
        | PoPreview[]
        | IpoDetails[];
}

export interface ChecklistSavedSearchResult {
    id: number;
    tagNo: string;
    tagDescription: string;
    responsibleCode: string;
    status: CompletionStatus;
    projectDescription: string;
    formularType: string;
    formularGroup: string;
    hasElectronicForm: boolean;
    attachmentCount: number;
    isSigned: boolean;
    isVerified: boolean;
    updatedAt: Date;
    updatedByUser: string;
    updatedByFirstName: string;
    updatedByLastName: string;
    proCoSysGuid: string;
}

export interface PunchItemSavedSearchResult {
    id: number;
    status: CompletionStatus;
    description: string;
    tagNo: string;
    tagId: number;
    formularType: string;
    responsibleCode: string;
    isCleared: boolean;
    isVerified: boolean;
    statusControlledBySwcr: boolean;
    attachmentCount: number;
    proCoSysGuid: string;
}

// IPO

export interface OutstandingIposType {
    items: OutstandingIpo[];
}

export interface OutstandingIpo {
    invitationId: number;
    description: string;
    organization: string;
}

export interface IpoDetails {
    projectName: string;
    title: string;
    description: string;
    location: string;
    type: string;
    status: IpoStatusEnum;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
        userName: string;
        azureOid: string;
        email: string;
        rowVersion: string;
    };
    startTimeUtc: Date;
    endTimeUtc: Date;
    canEdit: boolean;
    canCancel: boolean;
    canDelete: boolean;
    rowVersion: string;
    participants: IpoParticipant[];
    mcPkgScope: [
        {
            mcPkgNo: string;
            description: string;
            commPkgNo: string;
            system: string;
        }
    ];
    commPkgScope: [
        {
            commPkgNo: string;
            description: string;
            status: string;
            system: string;
        }
    ];
}

export interface IpoParticipant {
    id: number;
    organization: IpoOrganization;
    sortKey: number;
    signedBy: {
        id: number;
        firstName: string;
        lastName: string;
        userName: string;
        azureOid: string;
        email: string;
        rowVersion: string;
    };
    signedAtUtc: Date;
    note: string;
    attended: boolean;
    isAttendedTouched: boolean;
    isSigner: boolean;
    canEditAttendedStatusAndNote: boolean;
    externalEmail: {
        externalEmail: string;
        response: string;
    };
    person: {
        response: string;
        firstName: string;
        lastName: string;
        userName: string;
        azureOid: string;
        email: string;
    };
    functionalRole: {
        code: string;
        email: string;
        persons: [
            {
                response: string;
                id: number;
                firstName: string;
                lastName: string;
                userName: string;
                azureOid: string;
                email: string;
                required: boolean;
                rowVersion: string;
            }
        ];
        response: string;
    };
    rowVersion: string;
}

export type IpoOrganization =
    | 'Commissioning'
    | 'ConstructionCompany'
    | 'Contractor'
    | 'Operation'
    | 'TechnicalIntegrity'
    | 'Supplier'
    | 'External';
// COMM PKG AND LISTS

export interface CommPkg {
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
}

export interface ChecklistPreview {
    id: number;
    tagId: number;
    tagNo: string;
    tagDescription: string;
    mcPkgId?: number;
    mcPkgNo?: string;
    responsibleCode: string;
    status: CompletionStatus;
    formularType: string;
    formularGroup: string;
    sheetNo?: number;
    subSheetNo?: number;
    isRestrictedForUser: boolean;
    hasElectronicForm: boolean;
    attachmentCount: number;
    isSigned: boolean;
    isVerified: boolean;
    proCoSysGuid: string;
}
export interface PunchPreview {
    id: number;
    proCoSysGuid: string;
    status: CompletionStatus;
    description: string;
    systemModule: string;
    tagDescription: string;
    tagId: number;
    tagNo: string;
    mcPkgId?: number;
    mcPkgNo?: string;
    formularType: string;
    responsibleCode: string;
    isRestrictedForUser: boolean;
    cleared: boolean;
    rejected: boolean;
    verified: boolean;
    statusControlledBySwcr: boolean;
    attachmentCount: number;
    callOffNo?: string;
}

export interface PunchPreview {
    id: number;
    proCoSysGuid: string;
    status: CompletionStatus;
    description: string;
    systemModule: string;
    tagDescription: string;
    tagId: number;
    tagNo: string;
    formularType: string; // Not in Comm punches
    responsibleCode: string; // Not in Comm punches
    isRestrictedForUser: boolean;
    cleared: boolean;
    rejected: boolean;
    verified: boolean; // Not in Comm punches
    statusControlledBySwcr: boolean;
    attachmentCount: number; // Not in Comm punches
    callOffNo?: string; // Not in Comm punches
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

export interface LoopTag {
    tagId: number;
    tagNo: string;
}

export interface CustomCheckItem {
    id: number;
    itemNo: string;
    text: string;
    isOk: boolean;
}

export interface PunchCategory {
    id: number;
    code: CompletionStatus;
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

export interface PunchSort {
    id: number;
    parentId: number;
    code: string;
    description: string;
}

export interface PunchPriority {
    id: number;
    code: string;
    description: string;
}

type DateTimeString = string; // Assuming ISO 8601 format for dates

export interface NewPunch {
    checkListGuid: string;
    projectGuid: string;
    category: string;
    description: string;
    typeGuid: string;
    raisedByOrgGuid: string;
    clearingByOrgGuid: string;
    sortingGuid?: string;
    priorityGuid?: string;
    actionByPersonOid?: string;
    dueTimeUtc?: DateTimeString;
    estimate?: number;
    temporaryFileIds?: string[];
}

export interface PunchItem {
    id: number;
    checklistId: number;
    formularType: string;
    status: CompletionStatus;
    description: string;
    typeCode: string;
    typeDescription: string;
    raisedByCode: string;
    raisedByDescription: string;
    clearingByCode: string;
    clearingByDescription: string;
    clearedAt: string | null;
    clearedByUser: string | null;
    clearedByFirstName: string | null;
    clearedByLastName: string | null;
    verifiedAt: string | null;
    verifiedByUser: string | null;
    verifiedByFirstName: string | null;
    verifiedByLastName: string | null;
    rejectedAt: string | null;
    rejectedByUser: string | null;
    rejectedByFirstName: string | null;
    rejectedByLastName: string | null;
    dueDate: string | null;
    estimate: number | null;
    priorityId: number | null;
    priorityCode: string | null;
    priorityDescription: string | null;
    actionByPerson: number | null;
    actionByPersonFirstName: string | null;
    actionByPersonLastName: string | null;
    materialRequired: boolean;
    materialEta: string | null;
    materialNo: string | null;
    systemModule: string;
    tagDescription: string;
    tagId: number;
    tagNo: string;
    responsibleCode: string;
    responsibleDescription: string;
    sorting: string | null;
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
    parentGuid: string;
    guid: string;
    fullBlobPath: string;
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

export interface TagDetails {
    id: number;
    tagNo: string;
    description: string;
    registerCode: string;
    registerDescription: string;
    statusCode: string;
    statusDescription: string;
    tagFunctionCode: string;
    tagFunctionDescription: string;
    commPkgNo: string;
    mcPkgNo: string;
    purchaseOrderNo: string;
    callOffNo: string;
    purchaseOrderTitle: string;
    projectDescription: string;
    sequence: string;
    mountedOnTagNo: string;
    remark: string;
    systemCode: string;
    systemDescription: string;
    disciplineCode: string;
    disciplineDescription: string;
    areaCode: string;
    areaDescription: string;
    engineeringCodeCode: string;
    engineeringCodeDescription: string;
    contractorCode: string;
    contractorDescription: string;
    hasPreservation: boolean;
    preservationMigrated: boolean;
}

export interface AdditionalTagField {
    id: number;
    label: string;
    value: string;
    type: string;
    unit: string;
}
export interface Tag {
    tag: TagDetails;
    additionalFields: AdditionalTagField[];
}

export interface Person {
    id: number;
    azureOid: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface McPkgBookmark {
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

export interface TagBookmark {
    id: number;
    tagNo: string;
    description: string;
}

export interface Bookmarks {
    openDefinition: {
        offlineAt?: Date;
        status: OfflineScopeStatus;
    };
    bookmarkedMcPkgs: McPkgBookmark[];
    bookmarkedPurchaseOrders: PoPreview[];
    bookmarkedTags: TagBookmark[];
    bookmarkedWorkOrders: WoPreview[];
}

export interface EntityId {
    Id: number;
}

export interface LowerCaseEntityId {
    id: number;
}

export interface OfflineSynchronizationError {
    Id: number;
    Url: string;
    Method: string;
    ErrorMsg: string;
    ErrorCode: number;
}

export interface OfflineSynchronizationErrors {
    ProjectId: number;
    CheckListErrors: OfflineSynchronizationError[];
    PunchListItemErrors: OfflineSynchronizationError[];
}
