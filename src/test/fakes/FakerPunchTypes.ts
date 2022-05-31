import {
    PunchCategory,
    PunchPriority,
    PunchSort,
    CompletionStatus,
    NewPunch,
    PunchItemSavedSearchResult,
    PunchOrganization,
    PunchType,
    PunchPreview,
} from '../../services/apiTypes';

import {
    FakerId,
    FakerTagId,
    FakerTagNo,
    FakerDescription,
    FakerRandomBoolean,
    FakerResponsibleCode,
    FakerTitle,
    FakerTypeId,
    FakerSystemModule,
    FakerCallOffNo,
} from './fakerSimpleTypes';

import { FakerFormularType } from './fakerMCappTypes';
import FakerRandomEnum from './fakerRandomEnum';

export const FakerPunchItemSavedSearchResult =
    (): PunchItemSavedSearchResult => {
        return {
            id: FakerId(),
            status: FakerRandomEnum(CompletionStatus),
            description: FakerDescription(),
            tagNo: FakerTagNo(5),
            tagId: FakerTagId(),
            formulaType: FakerFormularType(10),
            responsibleCode: FakerResponsibleCode(5),
            isCleared: FakerRandomBoolean(),
            isVerified: FakerRandomBoolean(),
            statusControlledBySwcr: FakerRandomBoolean(),
            attachmentCount: 10,
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

export const FakerNewPunch = (): NewPunch => {
    return {
        CheckListId: FakerId(),
        CategoryId: FakerId(),
        Description: FakerDescription(),
        TypeId: FakerTypeId(),
        RaisedByOrganizationId: FakerId(),
        ClearingByOrganizationId: FakerId(),
        TemporaryFileIds: new Array<string>().concat('101', '102', '103'),
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

export const FakerPunchCategory = (): PunchCategory => {
    return {
        id: FakerId(),
        code: FakerRandomEnum(CompletionStatus),
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

export const FakePunchPreview = (): PunchPreview => {
    return {
        id: FakerId(),
        status: FakerRandomEnum(CompletionStatus),
        description: FakerDescription(),
        systemModule: FakerSystemModule(5),
        tagDescription: FakerDescription(),
        tagId: FakerTagId(),
        tagNo: FakerTagNo(5),
        formulaType: FakerFormularType(10),
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
