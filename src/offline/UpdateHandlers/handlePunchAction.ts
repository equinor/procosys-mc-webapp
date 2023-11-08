import { OfflineContentRepository } from '../OfflineContentRepository';
import { EntityType } from '../../typings/enums';
import { PunchItem } from '../../services/apiTypes';
import { PunchAction } from '@equinor/procosys-webapp-components';
import { getStringBetween, updatePunchlists } from './utils';
import { OfflineUpdateRequest } from '../OfflineUpdateRequest';
import { OfflineUpdateRepository } from '../OfflineUpdateRepository';

const offlineContentRepository = new OfflineContentRepository();
const offlineUpdateRepository = new OfflineUpdateRepository();

/**
 * Update offline content database based on a post of punch action.
 */
export const handlePunchAction = async (
    offlinePostRequest: OfflineUpdateRequest
): Promise<void> => {
    const punchItemId = offlinePostRequest.bodyData;

    const punchAction = getStringBetween(
        offlinePostRequest.url,
        'PunchListItem/',
        '?'
    );

    const punchItemEntity = await offlineContentRepository.getEntityByTypeAndId(
        EntityType.PunchItem,
        Number(punchItemId)
    );

    const punch: PunchItem = punchItemEntity.responseObj;

    //Update offline punch item
    if (punch) {
        switch (punchAction) {
            case PunchAction.CLEAR:
                punch.clearedAt = '<updated when online>';
                punch.clearedByFirstName = '<offline';
                punch.clearedByLastName = 'user>';
                punch.clearedByUser = '<offline user email>';
                break;
            case PunchAction.UNCLEAR:
                punch.clearedAt = null;
                punch.clearedByFirstName = null;
                punch.clearedByLastName = null;
                punch.clearedByUser = null;
                break;
            case PunchAction.VERIFY:
                punch.verifiedAt = '<updated when online>';
                punch.verifiedByFirstName = '<offline';
                punch.verifiedByLastName = 'user>';
                punch.verifiedByUser = '<offline user email>';
                break;
            case PunchAction.UNVERIFY:
                punch.verifiedAt = null;
                punch.verifiedByFirstName = null;
                punch.verifiedByLastName = null;
                punch.verifiedByUser = null;
                break;
            case PunchAction.REJECT:
                punch.rejectedAt = '<updated when online>';
                punch.rejectedByFirstName = '<offline';
                punch.rejectedByLastName = 'user>';
                punch.rejectedByUser = '<offline user email>';
                punch.clearedAt = null;
                punch.clearedByFirstName = null;
                punch.clearedByLastName = null;
                punch.clearedByUser = null;
        }
    }
    punchItemEntity.responseObj = punch;
    await offlineContentRepository.replaceEntity(punchItemEntity);

    await updatePunchlists(punch);

    await offlineUpdateRepository.addUpdateRequest(
        punchItemId,
        EntityType.PunchItem,
        offlinePostRequest
    );
};
