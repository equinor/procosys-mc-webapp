import faker from '@faker-js/faker';
import {
    AdditionalTagField,
    LoopTag,
    Tag,
    TagDetails,
} from '../../services/apiTypes';
import { TagSyntax } from '../fakerConstants';
import { StatusCodes } from './fakerDataLists';
import {
    FakerAlphaCode,
    FakerAreaCode,
    FakerCallOffNo,
    FakerCommPkgNo,
    FakerContractorCode,
    FakerDescription,
    FakerDisciplineCode,
    FakerEngineeringCodeCode,
    FakerId,
    FakerIdWithIdCheck,
    FakerMcPkgNo,
    FakerPurchaseOrderNo,
    FakerRandomBoolean,
    FakerSystemCode,
    FakerTagId,
    FakerTagNo,
    FakerTitle,
    PickRandomFromList,
    ReservedIds,
} from './fakerSimpleTypes';
import { FakerSyntax } from './fakerSyntaxTypes';

export const FakerLoopTag = (): LoopTag => {
    return {
        tagId: FakerTagId(),
        tagNo: FakerTagNo(5),
    };
};
export function LoopTags(count: number): Array<LoopTag> {
    const options = new Array<LoopTag>();
    for (let i = 0; i < count; i++) {
        options.push(FakerLoopTag());
    }
    return options;
}

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

export function AdditionalTagFields(count: number): Array<AdditionalTagField> {
    const options = new Array<AdditionalTagField>();
    for (let i = 0; i < count; i++) options.push(FakerAdditionalTagField());
    return options;
}

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

export function FakerTagDetails(): TagDetails {
    return {
        id: FakerId(),
        tagNo: FakerSyntax(TagSyntax),
        description: FakerDescription(),
        registerCode: FakerAlphaCode(10),
        registerDescription: FakerDescription(),
        statusCode: PickRandomFromList(StatusCodes()),
        statusDescription: FakerDescription(),
        tagFunctionCode: PickRandomFromList(StatusCodes()),
        tagFunctionDescription: FakerDescription(),
        commPkgNo: FakerCommPkgNo(5),
        mcPkgNo: FakerMcPkgNo(5),
        purchaseOrderNo: FakerPurchaseOrderNo(5),
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
}
export const FakerTagDetailsWithIdCheck = (fn: ReservedIds): TagDetails => {
    return {
        id: FakerIdWithIdCheck(fn),
        tagNo: FakerSyntax(TagSyntax),
        description: FakerDescription(),
        registerCode: FakerAlphaCode(10),
        registerDescription: FakerDescription(),
        statusCode: PickRandomFromList(StatusCodes()),
        statusDescription: FakerDescription(),
        tagFunctionCode: PickRandomFromList(StatusCodes()),
        tagFunctionDescription: FakerDescription(),
        commPkgNo: FakerCommPkgNo(5),
        mcPkgNo: FakerMcPkgNo(5),
        purchaseOrderNo: FakerPurchaseOrderNo(5),
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
