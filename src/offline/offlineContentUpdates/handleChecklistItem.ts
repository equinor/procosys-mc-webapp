import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { ChecklistResponse } from '../../services/apiTypes';
import { IEntity } from '../IEntity';

const offlineContentRepository = new OfflineContentRepository();

type Dto = {
    CheckListId: string;
    CheckItemId: number;
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistItemPostSetOK = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
    );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const checkitem = checklist.checkItems.find(
        (item) => item.id === dto.CheckItemId
    );

    if (checkitem) {
        checkitem.isOk = true;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistItemPostSetNA = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
    );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const checkitem = checklist.checkItems.find(
        (item) => item.id === dto.CheckItemId
    );

    if (checkitem) {
        checkitem.isNotApplicable = true;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

/**
 * Update offline content database based on a post of set ok on checklist item
 */
export const handleChecklistItemPostClear = async (dto: Dto): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
    );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    const checkitem = checklist.checkItems.find(
        (item) => item.id === dto.CheckItemId
    );

    if (checkitem) {
        checkitem.isNotApplicable = false;
        checkitem.isOk = false;
        await offlineContentRepository.replaceEntity(checklistEntity);
    }
};

type ChecklistMetatableCell = {
    CheckListId: number;
    CheckItemId: number;
    ColumnId: number;
    RowId: number;
    Value: string;
};

/**
 * Update offline content database based on a put meta table cell
 */
export const handleChecklistPutMetaTableCell = async (
    dto: ChecklistMetatableCell
): Promise<void> => {
    const checklistEntity: IEntity = await offlineContentRepository.getEntity(
        EntityType.Checklist,
        Number(dto.CheckListId)
    );

    const checklist: ChecklistResponse = checklistEntity.responseObj;

    if (checklist) {
        const checkitem = checklist.checkItems.find(
            (item) => item.id === dto.CheckItemId
        );
        if (checkitem && checkitem.metaTable) {
            const row = checkitem.metaTable.rows.find(
                (item) => item.id === dto.RowId
            );
            if (row && row.cells) {
                const cell = row.cells.find(
                    (item) => item.columnId === dto.ColumnId
                );
                if (cell) {
                    if (cell.isValueDate) {
                        cell.valueDate = dto.Value;
                    } else {
                        cell.value = dto.Value;
                    }
                    await offlineContentRepository.replaceEntity(
                        checklistEntity
                    );
                } else {
                    console.error(
                        'Was not able to find cell in metatable.',
                        dto,
                        checkitem.metaTable
                    );
                }
            } else {
                console.error(
                    'Was not able to find row in metatable, or row.cells.',
                    dto,
                    checkitem.metaTable
                );
            }
        } else {
            console.error(
                'Was not able to find checkitem or checkitem metaTable.',
                dto,
                checkitem?.metaTable
            );
        }
    } else {
        console.error('Was not able to find checklist.', dto.CheckListId);
    }
};
