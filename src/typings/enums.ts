export enum UpdatePunchEndpoint {
    Category = 'SetCategory',
    Description = 'SetDescription',
    RaisedBy = 'SetRaisedBy',
    ClearingBy = 'SetClearingBy',
    ActionByPerson = 'SetActionByPerson',
    DueDate = 'setDueDate',
    Type = 'SetType',
    Sorting = 'SetSorting',
    Priority = 'SetPriority',
    Estimate = 'setEstimate',
}

export enum EntityType {
    ChecklistPunchlist = 'ChecklistPunchlist',
    AuthConfig = 'AuthConfig',
    AppConfig = 'AppConfig',
    Bookmarks = 'Bookmarks',
    Permissions = 'Permissions',
    Plants = 'Plants',
    Projects = 'Projects',
    PunchCategories = 'PunchCategories',
    PunchOrganization = 'PunchOrganization',
    PunchPriorities = 'PunchPriorities',
    PunchSorts = 'PunchSorts',
    PunchTypes = 'PunchTypes',
    EntityDetails = 'EntityDetails',
    Punchlist = 'Punchlist',
    Checklists = 'Checklists',
    WorkOrder = 'WorkOrder',
    WorkOrderAttachments = 'WorkOrderAttachments',
    WorkOrderAttachment = 'WorkOrderAttachment',
    Checklist = 'Checklist',
    Tag = 'Tag',
    PunchItem = 'PunchItem',
    PunchAttachments = 'PunchAttachments',
    PunchAttachment = 'PunchAttachment',
    ChecklistAttachments = 'ChecklistAttachments',
    ChecklistAttachment = 'ChecklistAttachment',
    PunchComments = 'PunchComments',
}

export enum SavedSearchType {
    CHECKLIST = 'checklist',
    PUNCH = 'punch',
}

export enum OfflineStatus {
    ONLINE,
    OFFLINE,
    SYNCHING,
    SYNC_FAIL,
    CANCELLING,
}

export enum OfflineScopeStatus {
    UNDER_PLANNING = 'UnderPlanning',
    IS_OFFLINE = 'IsOffline',
}

// IPO
export enum IpoStatusEnum {
    CANCELED = 'Canceled',
    PLANNED = 'Planned',
    COMPLETED = 'Completed',
    ACCEPTED = 'Accepted',
}

export enum IpoOrganizationsEnum {
    Commissioning = 'Commissioning',
    ConstructionCompany = 'ConstructionCompany',
    Contractor = 'Contractor',
    Operation = 'Operation',
    TechnicalIntegrity = 'TechnicalIntegrity',
    Supplier = 'Supplier',
    External = 'External',
}

// Browser stores
export enum LocalStorage {
    LOGIN_TRIES = 'loginTries',
    OFFLINE_PROJECT_ID = 'offlineProjectId',
    OFFLINE_STATUS = 'offlineStatus',
    SYNCH_ERRORS = 'SynchErrors',
    SW_UPDATE = 'serviceWorkerUpdate',
}

export enum SessionStorage {
    SEARCH_TYPE = 'searchType',
    SEARCH_QUERY = 'searchQuery',
    SECONDARY_QUERY = 'secondaryQuery',
}
