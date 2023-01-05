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
    SavedSearches = 'SavedSearches',
    SavedSearchResults = 'SavedSearchRessults',
}

export enum SavedSearchType {
    CHECKLIST = 'checklist',
    PUNCH = 'punch',
}

export enum SearchType {
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
    IPO = 'IPO',
}

export enum OfflineStatus {
    ONLINE,
    OFFLINE,
    SYNCHING,
    SYNC_FAIL,
}
