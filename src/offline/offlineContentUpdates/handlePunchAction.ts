import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { PunchItem } from '../../services/apiTypes';
import { PunchAction } from '@equinor/procosys-webapp-components';
import { getStringBetween, updatePunchlists } from './utils';

const offlineContentRepository = new OfflineContentRepository();

/**
 * Update offline content database based on a post of punch action.
 */
export const handlePunchAction = async (
    requestUrl: string,
    punchItemId: string
): Promise<void> => {
    const punchAction = getStringBetween(requestUrl, 'PunchListItem/', '?');

    const punchItemEntity = await offlineContentRepository.getEntity(
        EntityType.PunchItem,
        Number(punchItemId)
    );

    const punch: PunchItem = punchItemEntity.responseObj;

    //Update offline punch item
    if (punch) {
        switch (punchAction) {
            case PunchAction.CLEAR:
                punch.clearedAt = '<updated when online>';
                punch.clearedByFirstName = '<offline user>';
                punch.clearedByLastName = '<offline user>';
                break;
            case PunchAction.UNCLEAR:
                punch.clearedAt = null;
                punch.clearedByFirstName = null;
                punch.clearedByLastName = null;
                break;
            case PunchAction.VERIFY:
                punch.verifiedAt = '<updated when online>';
                punch.verifiedByFirstName = '<offline user>';
                punch.verifiedByLastName = '<offline user>';
                break;
            case PunchAction.UNVERIFY:
                punch.verifiedAt = null;
                punch.verifiedByFirstName = null;
                punch.verifiedByLastName = null;
                break;
            case PunchAction.REJECT:
                punch.rejectedAt = '<updated when online>';
                punch.rejectedByFirstName = '<offline user>';
                punch.rejectedByLastName = '<offline user>';
        }
    }
    punchItemEntity.responseObj = punch;
    offlineContentRepository.replaceEntity(punchItemEntity);

    updatePunchlists(punch);
};
