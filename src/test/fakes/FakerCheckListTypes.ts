import {
    CheckItem,
    ChecklistPreview,
    ChecklistResponse,
    CustomCheckItem,
} from '../../services/apiTypes';
import * as FakerDataLists from './fakerDataLists';
import {
    FakerId,
    FakerTitle,
    FakerItemNo,
    FakerRandomBoolean,
    FakerSequenceNumber,
    FakerResponsibleCode,
    FakerTagId,
    FakerTagNo,
    FakerDescription,
} from './fakerSimpleTypes';
import { FakeChecklistDetails, FakeMetaTable } from './fakerMCappTypes';
import { LoopTags } from './FakerTagTypes';
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

export const FakerChecklistPreview = (): ChecklistPreview => {
    return {
        id: FakerId(),
        tagId: FakerTagId(),
        tagNo: FakerTagNo(5),
        tagDescription: FakerDescription(),
        responsibleCode: FakerResponsibleCode(5),
        status: FakerRandomEnum(FakerDataLists.CompletionStatus),
        formularType: FakerFormulaType(10),
        formularGroup: FakerFormulaType(4),
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
function FakerRandomEnum(
    CompletionStatus: () => string[]
): import('../../services/apiTypes').CompletionStatus {
    throw new Error('Function not implemented.');
}

function FakerFormulaType(arg0: number): string {
    throw new Error('Function not implemented.');
}
