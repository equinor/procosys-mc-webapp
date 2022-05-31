import { faker } from '@faker-js/faker';
import { ColumnLabels, PriorityCodes, Rows } from './fakerSimpleTypes';
import {
    ApiSavedSearchType,
    Attachment,
    Cell,
    ChecklistDetails,
    ChecklistSavedSearchResult,
    ColumnLabel,
    CompletionStatus,
    McPkgPreview,
    MetaTable,
    Person,
    PoPreview,
    PunchItem,
    Row,
    SavedSearch,
    TagPreview,
    WoPreview,
} from '../../services/apiTypes';
import * as FakerDataLists from './fakerDataLists';
import {
    FakerId,
    FakerTitle,
    FakerTagId,
    FakerTagNo,
    FakerDescription,
    FakerRandomBoolean,
    FakerMcPkgNo,
    FakerCommPkgNo,
    PickRandomFromList,
    FakerWorkOrderNo,
    FakerDisciplineCode,
    FakerBetweenDates,
    FakerCallOffNo,
    FakerClearingByCode,
    FakerDatesBetween2021and2022,
    FakerFormulaGroup,
    FakerFullname,
    FakerMccrResponsibleCode,
    FakerPriorityId,
    FakerRaisedByCode,
    FakerResponsibleCode,
    FakerSystemModule,
    FakerTagFunctionCode,
    FakerTypeCode,
} from './fakerSimpleTypes';
import FakerRandomEnum from './fakerRandomEnum';

export const FakerPerson = (): Person => {
    return {
        id: FakerId(),
        azureOid: faker.datatype.uuid(),
        username: faker.name.findName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
    };
};

export const FakerSavedSearch = (type: ApiSavedSearchType): SavedSearch => {
    return {
        id: FakerId(),
        name: faker.name.findName(),
        description: FakerDescription(),
        type: type,
    };
};

export const FakerMcPkgPreview = (id: number): McPkgPreview => {
    return {
        id: id,
        mcPkgNo: FakerMcPkgNo(5),
        description: FakerDescription(),
        status: FakerRandomEnum(CompletionStatus),
        commPkgNo: FakerCommPkgNo(5),
        phaseCode: PickRandomFromList(FakerDataLists.PhaseCodes()),
        phaseDescription: FakerDescription(),
        responsibleCode: PickRandomFromList(FakerDataLists.ResponsibleCodes()),
        responsibleDescription: FakerDescription(),
        commissioningHandoverStatus: PickRandomFromList(
            FakerDataLists.CommissioningHandoverStatus()
        ),
        operationHandoverStatus: PickRandomFromList(
            FakerDataLists.OperationHandoverStatus()
        ),
    };
};

export const FakerWoPreview = (): WoPreview => {
    return {
        id: FakerId(),
        workOrderNo: FakerWorkOrderNo(5),
        title: FakerTitle(),
        description: FakerDescription(),
        disciplineCode: FakerDisciplineCode(5),
        disciplineDescription: FakerDescription(),
    };
};

export const FakerTagPreview = (): TagPreview => {
    return {
        id: FakerId(),
        tagNo: FakerTagNo(5),
        description: FakerDescription(),
        registerCode: FakerRegisterCode(),
        tagFunctionCode: FakerTagFunctionCode(),
        commPkgNo: FakerCommPkgNo(5),
        mcPkgNo: FakerMcPkgNo(5),
        callOffNo: FakerCallOffNo(5),
        punchaseOrderTitle: FakerTitle(),
        mccrResponsibleCode: FakerMccrResponsibleCode(5),
    };
};

export const FakerPoPreview = (): PoPreview => {
    return {
        callOffId: FakerId(),
        isPurchaseOrder: FakerRandomBoolean(),
        title: FakerTitle(),
        description: FakerDescription(),
        responsibleCode: FakerResponsibleCode(5),
    };
};

export const FakerChecklistSavedSearchResult =
    (): ChecklistSavedSearchResult => {
        return {
            id: FakerId(),
            tagNo: FakerTagNo(5),
            tagDescription: FakerDescription(),
            responsibleCode: FakerResponsibleCode(5),
            status: FakerRandomEnum(CompletionStatus),
            projectDescription: FakerDescription(),
            formulaType: FakerAlphaCode(10),
            formulaGroup: FakerAlphaCode(4),
            hasElectronicForm: FakerRandomBoolean(),
            attachmentCount: 10,
            isSigned: FakerRandomBoolean(),
            isVerified: FakerRandomBoolean(),
            updatedAt: faker.date.past(1),
            updatedByUser: faker.name.findName(),
            updatedByFirstName: faker.name.firstName(),
            updatedByLastName: faker.name.firstName(),
        };
    };

export const FakerPunchItem = (): PunchItem => {
    return {
        id: FakerId(),
        checklistId: FakerId(),
        formulaType: FakerFormularType(10),
        status: FakerRandomEnum(CompletionStatus),
        description: FakerDescription(),
        typeCode: FakerTypeCode(),
        typeDescription: FakerDescription(),
        raisedByCode: FakerRaisedByCode(),
        raisedByDescription: FakerDescription(),
        clearingByCode: FakerClearingByCode(),
        clearingByDescription: FakerDescription(),
        clearedAt: FakerBetweenDates(
            new Date(2022, 1, 1),
            new Date(2022, 1, 9)
        ).toDateString(),
        clearedByUser: FakerFullname(),
        clearedByFirstName: faker.name.firstName(),
        clearedByLastName: faker.name.lastName(),
        verifiedAt: 'somewhere',
        verifiedByUser: FakerFullname(),
        verifiedByFirstName: faker.name.firstName(),
        verifiedByLastName: faker.name.lastName(),
        rejectedAt: 'somewhere',
        rejectedByUser: FakerFullname(),
        rejectedByFirstName: faker.name.firstName(),
        rejectedByLastName: faker.name.lastName(),
        dueDate: new Date(2022, 1, 1).toDateString(),
        estimate: 100,
        priorityId: FakerPriorityId(),
        priorityCode: PickRandomFromList(PriorityCodes()),
        priorityDescription: FakerDescription(),
        actionByPerson: FakerId(),
        actionByPersonFirstName: faker.name.firstName(),
        actionByPersonLastName: faker.name.lastName(),
        materialRequired: FakerRandomBoolean(),
        materialEta: 'future',
        materialNo: 'future',
        systemModule: FakerSystemModule(5),
        tagDescription: FakerDescription(),
        tagId: FakerTagId(),
        tagNo: FakerTagNo(5),
        responsibleCode: FakerResponsibleCode(5),
        responsibleDescription: FakerDescription(),
        sorting: null,
        statusControlledBySwcr: FakerRandomBoolean(),
        isRestrictedForUser: FakerRandomBoolean(),
        attachmentCount: 100,
    };
};

export const FakerAttachment = (): Attachment => {
    return {
        id: FakerId(),
        uri: faker.internet.url(),
        title: FakerTitle(),
        createdAt: FakerDatesBetween2021and2022(),
        classification: 'future',
        mimeType: 'future',
        thumbnailAsBase64: '2323321',
        hasFile: true,
        fileName: 'filename.txt',
    };
};

export const FakeChecklistDetails = (id: number): ChecklistDetails => {
    return {
        id: id,
        tagNo: FakerTagNo(5),
        tagDescription: FakerDescription(),
        tagId: FakerTagId(),
        mcPkgNo: FakerMcPkgNo(5),
        responsibleCode: FakerResponsibleCode(5),
        responsibleDescription: FakerDescription(),
        status: FakerRandomEnum(CompletionStatus),
        systemModule: FakerSystemModule(5),
        formularType: FakerFormularType(10),
        formularGroup: FakerFormulaGroup(5),
        comment: FakerTitle(),
        signedByUser: faker.name.firstName(),
        signedByFirstName: faker.name.firstName(),
        signedByLastName: faker.name.lastName(),
        signedAt: faker.date.past(2),
        verifiedByUser: faker.name.findName(),
        verifiedByFirstName: faker.name.firstName(),
        verifiedByLastName: faker.name.lastName(),
        verifiedAt: faker.date.past(1),
        updatedAt: faker.date.past(1),
        updatedByUser: faker.name.findName(),
        updatedByFirstName: faker.name.firstName(),
        updatedByLastName: faker.name.lastName(),
        isRestrictedForUser: FakerRandomBoolean(),
        hasElectronicForm: FakerRandomBoolean(),
        attachmentCount: 10,
    };
};

export const FakerRegisterCode = (): string => {
    return faker.random.alphaNumeric(10);
};
export const FakerAlphaCode = (count: number): string => {
    return faker.random.alpha(count);
};

export const FakerFormularType = (count: number): string =>
    FakerAlphaCode(count);

export const FakerColumnLabel = (): ColumnLabel => {
    return {
        id: FakerId(),
        label: FakerTitle(),
    };
};

export const FakerCell = (): Cell => {
    return {
        value: FakerTitle(),
        unit: 'unit',
        columnId: faker.datatype.number({ min: 5, max: 1000 }),
    };
};

function CreateCells(): Array<Cell> {
    const options = new Array<Cell>();
    options.push(FakerCell());
    options.push(FakerCell());
    options.push(FakerCell());
    return options;
}

export const FakeRow = (): Row => {
    return {
        id: FakerId(),
        label: FakerTitle(),
        cells: CreateCells(),
    };
};

export const FakeMetaTable = (): MetaTable => {
    return {
        info: FakerTitle(),
        columnLabels: ColumnLabels(),
        rows: Rows(),
    };
};
