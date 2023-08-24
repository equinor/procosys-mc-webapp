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

export enum SavedSearchType {
    CHECKLIST = 'checklist',
    PUNCH = 'punch',
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
