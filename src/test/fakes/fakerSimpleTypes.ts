import { faker } from '@faker-js/faker';
import { TagFunctionCodeSyntax, TagSyntax } from '../fakerConstants';
import {
    PunchItem,
    Attachment,
    ChecklistDetails,
    Plant,
    Project,
    ColumnLabel,
    Row,
    CompletionStatus,
} from './../../services/apiTypes';

import * as FakerDataLists from './fakerDataLists';
import FakerRandomEnum from './fakerRandomEnum';
import { FakerSyntax } from './fakerSyntaxTypes';

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
export const FakerPurchaseOrderNo = (count: number): string =>
    FakerSyntax('XXX-XXX-AA-X');
export const FakerMcPkgNo = (count: number): string => FakerAlphaCode(count);
export const FakerCallOffNo = (count: number): string => FakerAlphaCode(count);
export const FakerDisciplineCode = (count: number): string =>
    FakerAlphaCode(count);
export const FakerAreaCode = (count: number): string => FakerAlphaCode(count);
export const FakerEngineeringCodeCode = (count: number): string =>
    FakerAlphaCode(count);
export const FakerContractorCode = (count: number): string =>
    FakerAlphaCode(count);
export const FakerSystemCode = (count: number): string =>
    FakerSyntax('XXX-XXX-AA-X');
export const FakerSystemModule = (count: number): string =>
    FakerAlphaCode(count);
export const FakerSystemId = (count: number): number =>
    faker.datatype.number({ min: 1, max: 99999999 });
export const FakerWorkOrderNo = (count: number): string =>
    FakerAlphaCode(count);
export const FakerTagNo = (count: number): string => FakerSyntax(TagSyntax);
export const FakerTagFunctionCode = (): string =>
    FakerSyntax(TagFunctionCodeSyntax);
export const FakerTagId = (): number =>
    faker.datatype.number({ min: 1, max: 99999999 });
export const FakerMccrResponsibleCode = (count: number): string =>
    FakerAlphaCode(count);
export const FakerResponsibleCode = (count: number): string =>
    FakerAlphaCode(count);
export const FakerFormulaGroup = (count: number): string =>
    FakerAlphaCode(count);
export const FakerSequenceNumber = (): number =>
    faker.datatype.number({ min: 1, max: 99999999 });
export const FakerItemNo = (count: number): string => FakerAlphaCode(count);
export const FakerTypeId = (): number =>
    faker.datatype.number({ min: 1, max: 99999999 });

export const FakerFullname = (): string => faker.name.findName();
export const FakerBetweenDates = (from: Date, to: Date): Date => {
    return faker.date.between(from.toDateString(), to.toDateString());
};

export const FakerDatesBetween2021and2022 = (): Date => {
    const from = new Date(2021, 1, 1);
    const to = new Date(2022, 12, 31);
    return faker.date.between(from.toDateString(), to.toDateString());
};

export const FakerRaisedByCode = (): string => {
    return FakerAlphaCode(5);
};
export const FakerTypeCode = (): string => {
    return FakerAlphaCode(5);
};

export const FakerClearingByCode = (): string => {
    return FakerAlphaCode(5);
};

const MAX_PRIORITY_LIMIT = 10;
export const FakerPriorityId = (): number =>
    faker.datatype.number({ min: 1, max: MAX_PRIORITY_LIMIT });

export const PriorityCodes = (): Array<string> => {
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
        formulaType: FakerFormulaType(10),
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
        formularType: FakerFormulaType(10),
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

export const CreateProjectList = (count: number): Array<Project> => {
    const projects = new Array<Project>();
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
export type ReservedIds = {
    ids: number[] | undefined;
};

export const randomIntFromInterval = (min: number, max: number): number => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const ColumnLabels = (): ColumnLabel[] => {
    throw new Error('Function not implemented.');
};

export const Rows = (): Row[] => {
    throw new Error('Function not implemented.');
};
function PurchaseOrderNo(PurchaseOrderNo: any): string {
    throw new Error('Function not implemented.');
}

function SystemCodeSyntax(SystemCodeSyntax: any): string {
    throw new Error('Function not implemented.');
}
function FakerFormulaType(arg0: number): string {
    throw new Error('Function not implemented.');
}
