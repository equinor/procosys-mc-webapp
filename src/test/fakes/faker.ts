import {
    CommPkg,
    McPkgPreview,
    Person,
    PunchItemSavedSearchResult,
    SavedSearch,
    ChecklistPreview,
    PunchPreview,
    LoopTag,
    CustomCheckItem,
    PunchPriority,
    NewPunch,
    PunchItem,
    Attachment,
    ChecklistDetails,
    TagDetails,
    AdditionalTagField,
    Tag,
    ChecklistResponse,
    PunchCategory,
    PunchType,
    PunchOrganization,
    PunchSort,
    Plant,
    Project,
} from './../../services/apiTypes';
import { faker } from '@faker-js/faker';
import * as apiTypes from '../../services/apiTypes';
import {
    ChecklistSavedSearchResult,
    PoPreview,
    TagPreview,
    WoPreview,
} from '../../services/apiTypes';
import * as FakerDataLists from './fakerDataLists';
import FakerRandomEnum from './fakerRandomEnum';
import { FakerSyntax } from './fakerSyntax';
import {
    Cell,
    CheckItem,
    MetaTable,
    Row,
} from '@equinor/procosys-webapp-components/dist/typings/apiTypes';

export const TagSyntax = 'XXX-AA-XXXX-A-A-XX';
/**
 * One Alpha: [a-zA-Z]{1}
 * Two Alpha: [a-zA-Z]{2}
 * 'n' Alpha: [a-zA-Z]{n}
 *
 * One number: [0-9]{1}
 * Two number: [0-9]{2}
 * 'n' number: [0-9]{n}
 */
export const TagSyntaxRegex = new RegExp(
    '^[0-9]{3}-[a-zA-Z]{2}-[0-9]{4}-[a-zA-Z]{1}-[a-zA-Z]{1}-[0-9]{2}'
);
export const PurchaseOrderNo = 'XXX-XXX-AA-X';

const TagFunctionCodeSyntax = 'XXX-AAA-XXX';
const SystemCodeSyntax = 'XXX-XXX-XXX';

export const FakerId = (): number =>
    faker.datatype.number({ min: 1, max: 999999999 });

export const FakerIdWithIdCheck = (reservedIds: ReservedIds): number => {
    let id = FakerId();
    while (reservedIds.ids?.includes(id)) {
        id = FakerId();
    }
    return id;
};
export const FakerTitle = (): string => faker.lorem.paragraph(1);
export const FakerDescription = (): string => faker.lorem.paragraph(3);
export const FakerRandomBoolean = (): boolean => {
    return Math.random() > 0.5 ? true : false;
};
export const FakerCommPkgNo = (count: number): string => FakerAlphaCode(count);
export const FakerPurchaseOrderNo = (): string => FakerSyntax(PurchaseOrderNo);
export const FakerMcPkgNo = (count: number): string => FakerAlphaCode(count);
export const FakerCallOffNo = (count: number): string => FakerAlphaCode(count);
export const FakerDisciplineCode = (count: number) => FakerAlphaCode(count);
export const FakerAreaCode = (count: number) => FakerAlphaCode(count);
export const FakerEngineeringCodeCode = (count: number) =>
    FakerAlphaCode(count);
export const FakerContractorCode = (count: number) => FakerAlphaCode(count);
export const FakerSystemCode = (count: number) => FakerSyntax(SystemCodeSyntax);
export const FakerSystemModule = (count: number) => FakerAlphaCode(count);
export const FakerSystemId = (count: number) =>
    faker.datatype.number({ min: 1, max: 99999999 });
export const FakerWorkOrderNo = (count: number) => FakerAlphaCode(count);
export const FakerTagNo = (count: number) => FakerSyntax(TagSyntax);
export const FakerTagFunctionCode = () => FakerSyntax(TagFunctionCodeSyntax);
export const FakerTagId = () =>
    faker.datatype.number({ min: 1, max: 99999999 });
export const FakerMccrResponsibleCode = (count: number) =>
    FakerAlphaCode(count);
export const FakerResponsibleCode = (count: number) => FakerAlphaCode(count);
export const FakerFormularGroup = (count: number) => FakerAlphaCode(count);
export const FakerSequenceNumber = () =>
    faker.datatype.number({ min: 1, max: 99999999 });
export const FakerItemNo = (count: number) => FakerAlphaCode(count);
export const FakerTypeId = () =>
    faker.datatype.number({ min: 1, max: 99999999 });

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

export const FakerSavedSearch = (
    type: apiTypes.ApiSavedSearchType
): SavedSearch => {
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
        status: FakerRandomEnum(apiTypes.CompletionStatus),
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
            status: FakerRandomEnum(apiTypes.CompletionStatus),
            projectDescription: FakerDescription(),
            formularType: FakerAlphaCode(10),
            formularGroup: FakerAlphaCode(4),
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

export const FakerFormularType = (count: number) => FakerAlphaCode(count);

export const FakerPunchItemSavedSearchResult =
    (): PunchItemSavedSearchResult => {
        return {
            id: FakerId(),
            status: FakerRandomEnum(apiTypes.CompletionStatus),
            description: FakerDescription(),
            tagNo: FakerTagNo(5),
            tagId: FakerTagId(),
            formularType: FakerFormularType(10),
            responsibleCode: FakerResponsibleCode(5),
            isCleared: FakerRandomBoolean(),
            isVerified: FakerRandomBoolean(),
            statusControlledBySwcr: FakerRandomBoolean(),
            attachmentCount: 10,
        };
    };

export const FakeCommPkg = (): CommPkg => {
    return {
        id: FakerId(),
        commPkgNo: FakerCommPkgNo(5),
        description: FakerDescription(),
        commStatus: FakerRandomEnum(apiTypes.CompletionStatus),
        mcStatus: FakerRandomEnum(apiTypes.CompletionStatus),
        mcPkgCount: 100,
        mcPkgsAcceptedByCommissioning: 100,
        mcPkgsAcceptedByOperation: 200,
        commissioningHandoverStatus: PickRandomFromList(
            FakerDataLists.CommissioningHandoverStatus()
        ),
        operationHandoverStatus: PickRandomFromList(
            FakerDataLists.OperationHandoverStatus()
        ),
        systemId: FakerSystemId(5),
    };
};

export const FakerChecklistPreview = (): ChecklistPreview => {
    return {
        id: FakerId(),
        tagId: FakerTagId(),
        tagNo: FakerTagNo(5),
        tagDescription: FakerDescription(),
        responsibleCode: FakerResponsibleCode(5),
        status: FakerRandomEnum(apiTypes.CompletionStatus),
        formularType: FakerFormularType(10),
        formularGroup: FakerFormularType(4),
        sheetNo: 100,
        subSheetNo: 200,
        isRestrictedForUser: FakerRandomBoolean(),
        hasElectronicForm: FakerRandomBoolean(),
        attachmentCount: 10,
        isSigned: FakerRandomBoolean(),
        isVerified: FakerRandomBoolean(),
    };
};

export const FakerListChecklistPreview = (
    count: number
): Array<ChecklistPreview> => {
    const options = new Array<ChecklistPreview>();
    for (let i = 0; i < count; i++) options.push(FakerChecklistPreview());
    return options;
};

export const FakePunchPreview = (): PunchPreview => {
    return {
        id: FakerId(),
        status: FakerRandomEnum(apiTypes.CompletionStatus),
        description: FakerDescription(),
        systemModule: FakerSystemModule(5),
        tagDescription: FakerDescription(),
        tagId: FakerTagId(),
        tagNo: FakerTagNo(5),
        formularType: FakerFormularType(10),
        responsibleCode: FakerResponsibleCode(5),
        isRestrictedForUser: FakerRandomBoolean(),
        cleared: FakerRandomBoolean(),
        rejected: FakerRandomBoolean(),
        verified: FakerRandomBoolean(),
        statusControlledBySwcr: FakerRandomBoolean(),
        attachmentCount: 100,
        callOffNo: FakerCallOffNo(5),
    };
};

export const FakePunchPreviewList = (count: number): Array<PunchPreview> => {
    const options = new Array<PunchPreview>();
    for (let i = 0; i < count; i++) options.push(FakePunchPreview());

    return options;
};

export const FakerColumnLabel = (): apiTypes.ColumnLabel => {
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
        valueDate: '10.06.2022',
        isValueDate: true,
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

export const FakerCheckItem = (): CheckItem => {
    return {
        id: FakerId(),
        sequenceNumber: FakerSequenceNumber().toString(),
        text: FakerTitle(),
        detailText: FakerTitle(),
        isHeading: FakerRandomBoolean(),
        hasImage: FakerRandomBoolean(),
        imageFileId: FakerId(),
        hasMetaTable: FakerRandomBoolean(),
        metaTable: FakeMetaTable(),
        isOk: FakerRandomBoolean(),
        isNotApplicable: FakerRandomBoolean(),
    };
};

export const FakerLoopTag = (): LoopTag => {
    return {
        tagId: FakerTagId(),
        tagNo: FakerTagNo(5),
    };
};

function LoopTags(count: number): Array<LoopTag> {
    const options = new Array<LoopTag>();
    for (let i = 0; i < count; i++) {
        options.push(FakerLoopTag());
    }
    return options;
}

export const FakerCustomCheckItem = (): CustomCheckItem => {
    return {
        id: FakerId(),
        itemNo: FakerItemNo(5),
        text: FakerTitle(),
        isOk: FakerRandomBoolean(),
    };
};

function CustomCheckItems(count: number): Array<CustomCheckItem> {
    const options = new Array<CustomCheckItem>();
    for (let i = 0; i < count; i++) {
        options.push(FakerCustomCheckItem());
    }
    return options;
}

export const FakerChecklistResponse = (id: number): ChecklistResponse => {
    return {
        loopTags: LoopTags(5),
        checkList: FakeChecklistDetails(id),
        checkItems: FakerDataLists.CheckItems(1),
        customCheckItems: CustomCheckItems(4),
    };
};

export const FakerPunchCategory = (): PunchCategory => {
    return {
        id: FakerId(),
        code: FakerRandomEnum(apiTypes.CompletionStatus),
        description: FakerTitle(),
    };
};

export const FakerPunchType = (): PunchType => {
    return {
        id: FakerId(),
        parentId: FakerId(),
        code: 'code',
        description: FakerTitle(),
    };
};

export const FakerPunchOrganization = (): PunchOrganization => {
    return {
        id: FakerId(),
        parentId: FakerId(),
        code: 'code',
        description: FakerTitle(),
    };
};

export const FakerPunchSort = (): PunchSort => {
    return {
        id: FakerId(),
        parentId: FakerId(),
        code: 'code',
        description: FakerTitle(),
    };
};

export const FakerPunchPriority = (): PunchPriority => {
    return {
        id: FakerId(),
        code: 'code',
        description: FakerDescription(),
    };
};

export const FakerNewPunch = (): NewPunch => {
    return {
        CheckListId: FakerId(),
        CategoryId: FakerId(),
        Description: FakerDescription(),
        TypeId: FakerTypeId(),
        RaisedByOrganizationId: FakerId(),
        ClearingByOrganizationId: FakerId(),
        TemporaryFileIds: new Array<string>().concat('101', '102', '103'),
        ActionByPerson: null,
        DueDate: null,
        Estimate: null,
    };
};

export const FakerFullname = () => faker.name.findName();
export const FakerBetweenDates = (from: Date, to: Date) => {
    return faker.date.between(from.toDateString(), to.toDateString());
};

export const FakerDatesBetween2021and2022 = () => {
    const from = new Date(2021, 1, 1);
    const to = new Date(2022, 12, 31);
    return faker.date.between(from.toDateString(), to.toDateString());
};

export const FakerRaisedByCode = () => {
    return FakerAlphaCode(5);
};
export const FakerTypeCode = () => {
    return FakerAlphaCode(5);
};

export const FakerClearingByCode = () => {
    return FakerAlphaCode(5);
};

const MAX_PRIORITY_LIMIT = 10;
export const FakerPriorityId = () =>
    faker.datatype.number({ min: 1, max: MAX_PRIORITY_LIMIT });

const PriorityCodes = (): Array<string> => {
    const options = new Array<string>();
    return options.concat([
        'PriorityCode A',
        'PriorityCode B',
        'PriorityCode C',
        'PriorityCode D',
    ]);
};

export const FakerPunchItem = (): PunchItem => {
    return {
        id: FakerId(),
        checklistId: FakerId(),
        formularType: FakerFormularType(10),
        status: FakerRandomEnum(apiTypes.CompletionStatus),
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
        status: FakerRandomEnum(apiTypes.CompletionStatus),
        systemModule: FakerSystemModule(5),
        formularType: FakerFormularType(10),
        formularGroup: FakerFormularGroup(5),
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

export const CreateProjectList = (count: number): Array<apiTypes.Project> => {
    const projects = new Array<apiTypes.Project>();
    for (let i = 0; i < count; i++) {
        projects.push(FakerProject());
    }
    return projects;
};

export const FakerPlant = (count: number): Plant => {
    return {
        id: FakerId().toString(),
        title: faker.lorem.paragraph(1),
        slug: 'slug',
        projects: CreateProjectList(count),
    };
};

export const FakerProject = (): Project => {
    return {
        description: FakerDescription(),
        id: FakerId(),
        title: FakerTitle(),
    };
};

export const FakerRegisterCode = (): string => {
    return faker.random.alphaNumeric(10);
};
export const FakerAlphaCode = (count: number): string => {
    return faker.random.alpha(count);
};

//Generic random picker in different lists
export const PickRandomFromList = <T>(list: Array<T>): T => {
    const index = randomIntFromInterval(0, list.length - 1);
    return list[index];
};

export const FakerTagDetailsWithIdCheck = (fn: ReservedIds): TagDetails => {
    return {
        id: FakerIdWithIdCheck(fn),
        tagNo: FakerSyntax(TagSyntax),
        description: FakerDescription(),
        registerCode: FakerAlphaCode(10),
        registerDescription: FakerDescription(),
        statusCode: PickRandomFromList(FakerDataLists.StatusCodes()),
        statusDescription: FakerDescription(),
        tagFunctionCode: PickRandomFromList(FakerDataLists.StatusCodes()),
        tagFunctionDescription: FakerDescription(),
        commPkgNo: FakerCommPkgNo(5),
        mcPkgNo: FakerMcPkgNo(5),
        purchaseOrderNo: FakerPurchaseOrderNo(),
        callOffNo: FakerCallOffNo(5),
        purchaseOrderTitle: FakerTitle(),
        projectDescription: FakerDescription(),
        sequence: faker.datatype.number.toString(),
        mountedOnTagNo: FakerSyntax(TagSyntax),
        remark: FakerTitle(),
        systemCode: FakerSystemCode(5),
        systemDescription: FakerDescription(),
        disciplineCode: FakerDisciplineCode(5),
        disciplineDescription: FakerDescription(),
        areaCode: FakerAreaCode(5),
        areaDescription: FakerDescription(),
        engineeringCodeCode: FakerEngineeringCodeCode(5),
        engineeringCodeDescription: FakerDescription(),
        contractorCode: FakerContractorCode(5),
        contractorDescription: FakerDescription(),
        hasPreservation: FakerRandomBoolean(),
        preservationMigrated: FakerRandomBoolean(),
    };
};

export const FakerTagDetails = (): TagDetails => {
    return {
        id: FakerId(),
        tagNo: FakerSyntax(TagSyntax),
        description: FakerDescription(),
        registerCode: FakerAlphaCode(10),
        registerDescription: FakerDescription(),
        statusCode: PickRandomFromList(FakerDataLists.StatusCodes()),
        statusDescription: FakerDescription(),
        tagFunctionCode: PickRandomFromList(FakerDataLists.StatusCodes()),
        tagFunctionDescription: FakerDescription(),
        commPkgNo: FakerCommPkgNo(5),
        mcPkgNo: FakerMcPkgNo(5),
        purchaseOrderNo: FakerPurchaseOrderNo(),
        callOffNo: FakerCallOffNo(5),
        purchaseOrderTitle: FakerTitle(),
        projectDescription: FakerDescription(),
        sequence: faker.datatype.number.toString(),
        mountedOnTagNo: FakerSyntax(TagSyntax),
        remark: FakerTitle(),
        systemCode: FakerSystemCode(5),
        systemDescription: FakerDescription(),
        disciplineCode: FakerDisciplineCode(5),
        disciplineDescription: FakerDescription(),
        areaCode: FakerAreaCode(5),
        areaDescription: FakerDescription(),
        engineeringCodeCode: FakerEngineeringCodeCode(5),
        engineeringCodeDescription: FakerDescription(),
        contractorCode: FakerContractorCode(5),
        contractorDescription: FakerDescription(),
        hasPreservation: FakerRandomBoolean(),
        preservationMigrated: FakerRandomBoolean(),
    };
};

export const FakerAdditionalTagField = (): AdditionalTagField => {
    const labels = new Array<string>().concat(
        'Label 1',
        'Label 2',
        'Label 3',
        'Label 4',
        'Label 5'
    );
    const types = new Array<string>().concat('Type 1', 'Type 2');
    const values = new Array<string>().concat('Label 1', 'Label 2');
    const units = new Array<string>().concat('unit 1', 'unit 2', 'unit 3');

    return {
        id: FakerId(),
        label: PickRandomFromList(labels),
        value: PickRandomFromList(values),
        type: PickRandomFromList(types),
        unit: PickRandomFromList(units),
    };
};

function AdditionalTagFields(count: number): Array<AdditionalTagField> {
    const options = new Array<AdditionalTagField>();
    for (let i = 0; i < count; i++) options.push(FakerAdditionalTagField());
    return options;
}

export type ReservedIds = {
    ids: number[] | undefined;
};

export const FakerTagWithIdCheck = (fn: ReservedIds): Tag => {
    return {
        tag:
            fn === undefined
                ? FakerTagDetails()
                : FakerTagDetailsWithIdCheck(fn),
        additionalFields: AdditionalTagFields(
            faker.datatype.number({ min: 0, max: 20 })
        ),
    };
};

export const FakerTag = (): Tag => {
    return {
        tag: FakerTagDetails(),
        additionalFields: AdditionalTagFields(
            faker.datatype.number({ min: 2, max: 20 })
        ),
    };
};

function randomIntFromInterval(min: number, max: number): number {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function ColumnLabels(): apiTypes.ColumnLabel[] {
    throw new Error('Function not implemented.');
}

function Rows(): Row[] {
    throw new Error('Function not implemented.');
}
