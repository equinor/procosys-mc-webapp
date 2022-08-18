import {
    Attachment,
    Bookmarks,
    ChecklistPreview,
    ChecklistResponse,
    Entities,
    McPkgPreview,
    Person,
    PoPreview,
    PunchItem,
    PunchPreview,
    Tag,
    TagPreview,
    WoPreview,
} from '../services/apiTypes';

import procosysApiService, {
    ProcosysApiService,
} from '../services/procosysApi';
import {
    isArrayofPerson,
    isArrayOfType,
    isChecklistResponse,
    isCorrectDetails,
    isCorrectSavedSearchResults,
    isOfType,
} from '../services/apiTypeGuards';
import { SearchType } from '../typings/enums';
import { db } from './db';
import { OfflineContentRepository } from './OfflineContentRepository';
import { Entity } from './Entity';
import { IEntity } from './IEntity';

const buildOfflineScope = async (
    api: ProcosysApiService,
    bookmarks: Bookmarks
): Promise<void> => {
    const controller = new AbortController();
    const abortSignal = controller.signal;
    const offlineContentRepository = new OfflineContentRepository();
    const offlineEntities: Entity[] = [];

    let currentResponseObj = '' as string | Blob;
    let currentApiPath = '';

    const cbFunc = (
        responseObj: string | Blob,
        apiPath: string
    ): string | Blob => {
        currentResponseObj = responseObj;
        currentApiPath = apiPath;
        return responseObj;
    };

    api.setCallbackFunction(cbFunc);

    //Common data
    //--------------------
    await api.getPunchCategories(bookmarks.plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchCategories',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    await api.getPunchOrganizations(bookmarks.plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchOrganization',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    await api.getPunchPriorities(bookmarks.plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchPriorities',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    await api.getPunchSorts(bookmarks.plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchSorts',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    await api.getPunchTypes(bookmarks.plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchTypes',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    for (const mcPkg of bookmarks.bookmarkedMcPkgs) {
        //todo: Bygge følgende generelt for alle seawrchtypes.

        //TODO: legg inn getPlants og getProjnects, kun med det ene prosjekte.
        //Entity Details
        await api.getEntityDetails(
            bookmarks.plantId,
            SearchType.MC,
            mcPkg.id.toString()
        );

        offlineEntities.push({
            entityid: mcPkg.id,
            entitytype: SearchType.MC,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
        });

        //Get punch list
        await api.getPunchList(
            bookmarks.plantId,
            SearchType.MC,
            mcPkg.id.toString()
        );

        offlineEntities.push({
            entityid: mcPkg.id,
            entitytype: SearchType.MC,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
        });

        //Get scope
        const scope = await api.getScope(
            bookmarks.plantId,
            SearchType.MC,
            mcPkg.id.toString()
        );

        offlineEntities.push({
            entityid: mcPkg.id,
            entitytype: SearchType.MC,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
        });

        //For all checklists
        for (const checklist of scope) {
            //Get checklist
            const checklistResp: ChecklistResponse = await api.getChecklist(
                bookmarks.plantId,
                checklist.id.toString()
            );

            offlineEntities.push({
                entityid: checklist.id,
                entitytype: SearchType.MC,
                responseObj: currentResponseObj,
                apipath: currentApiPath,
            });

            //Get tag
            const tag: Tag = await api.getTag(
                bookmarks.plantId,
                checklistResp.checkList.tagId
            );

            offlineEntities.push({
                entityid: checklistResp.checkList.tagId,
                entitytype: SearchType.MC,
                responseObj: currentResponseObj,
                apipath: currentApiPath,
            });

            //Get checklist punchlist
            const checklistPunchList: PunchPreview[] =
                await api.getChecklistPunchList(
                    bookmarks.plantId,
                    checklist.id.toString()
                );

            offlineEntities.push({
                entityid: checklist.id,
                entitytype: SearchType.MC,
                responseObj: currentResponseObj,
                apipath: currentApiPath,
            });

            for (const punch of checklistPunchList) {
                //Get punch item
                const punchItem: PunchItem = await api.getPunchItem(
                    bookmarks.plantId,
                    punch.id.toString()
                );

                offlineEntities.push({
                    entityid: punch.id,
                    entitytype: SearchType.MC,
                    responseObj: currentResponseObj,
                    apipath: currentApiPath,
                });

                //get punch attachments
                const punchAttachments: Attachment[] =
                    await api.getPunchAttachments(bookmarks.plantId, punch.id);

                offlineEntities.push({
                    entityid: checklist.id,
                    entitytype: SearchType.MC,
                    responseObj: currentResponseObj,
                    apipath: currentApiPath,
                });

                for (const attachment of punchAttachments) {
                    //Get checklist attachment
                    const attachmentBlob: Blob = await api.getPunchAttachment(
                        abortSignal,
                        bookmarks.plantId,
                        punch.id,
                        attachment.id
                    );
                    console.log(
                        'attachment currentresposobj',
                        currentResponseObj
                    );
                    offlineEntities.push({
                        entityid: attachment.id,
                        entitytype: SearchType.MC,
                        apipath: currentApiPath,
                        responseObj: currentResponseObj,
                    });
                }
            }
            //Get checklist attachment list
            const checklistAttachments: Attachment[] =
                await api.getChecklistAttachments(
                    bookmarks.plantId,
                    checklist.id.toString()
                );

            offlineEntities.push({
                entityid: checklist.id,
                entitytype: SearchType.MC,
                apipath: currentApiPath,
                responseObj: currentResponseObj,
            });

            for (const attachment of checklistAttachments) {
                //Get checklist attachment
                const attachmentBlob: Blob = await api.getChecklistAttachment(
                    bookmarks.plantId,
                    checklist.id.toString(),
                    attachment.id
                );

                offlineEntities.push({
                    entityid: attachment.id,
                    entitytype: SearchType.MC,
                    apipath: currentApiPath,
                    responseObj: currentResponseObj,
                });
            }
        }
    }

    //todo: Jeg tar her bort de som har tom apipath. Dette er bare midlertidig, for testing
    console.log(
        'Antall offline entities som skal lagres: ' +
            offlineEntities.length.toString(),
        offlineEntities
    );

    const filteredOfflineEntities = offlineEntities.filter(
        (entity) => entity.apipath != ''
    );

    console.log(
        'Antall filtered offline entities som skal lagres: ' +
            filteredOfflineEntities.length.toString(),
        filteredOfflineEntities
    );
    await offlineContentRepository.bulkAdd(filteredOfflineEntities);
};

export default buildOfflineScope;
