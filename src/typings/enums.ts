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
