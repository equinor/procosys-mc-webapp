import {
    Attachment,
    Bookmarks,
    ChecklistPreview,
    ChecklistResponse,
    Entities,
    McPkgPreview,
    Person,
    Plant,
    PoPreview,
    Project,
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
    plantId: string,
    projectId: number
): Promise<void> => {
    const controller = new AbortController();
    const abortSignal = controller.signal;
    const offlineContentRepository = new OfflineContentRepository();
    let offlineEntities: Entity[] = [];

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

    const addToDatabase = async (offlineEntities: Entity[]): Promise<void> => {
        console.log(
            'Antall offline entities ' + offlineEntities.length.toString(),
            offlineEntities
        );

        //todo: Filtrer bort de som allerede er inne. For for testing
        const filteredOfflineEntities = offlineEntities.filter(
            (entity) => entity.apipath != ''
        );

        console.log(
            'Antall som skal lagres: ' +
                filteredOfflineEntities.length.toString(),
            filteredOfflineEntities
        );
        await offlineContentRepository.bulkAdd(filteredOfflineEntities);
    };

    //Bookmarks
    const bookmarks = await api.getBookmarks(plantId, projectId, abortSignal);
    if (bookmarks == null) {
        console.log('No offline scope started for project.', projectId);
        return; //todo: Må gi feilmelding. Dette skal ikke kunne gå ann.
    }
    console.log('Offline bookmarks', bookmarks);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'Bookmarks',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Plants
    const plants = await api.getPlants();
    //todo: hvis vi ikke ønsker å vise alle plants, kan vi filtrere her.
    offlineEntities.push({
        entityid: 0,
        entitytype: 'Plants',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Projects
    const projects = await api.getProjectsForPlant(`PCS$${plantId}`);
    //todo: hvis vi ikke ønsker å vise alle projects, kan vi filtrere her.
    offlineEntities.push({
        entityid: 0,
        entitytype: 'Projects',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch categories
    await api.getPunchCategories(plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchCategories',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch organization
    await api.getPunchOrganizations(plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchOrganization',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch priorities
    await api.getPunchPriorities(plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchPriorities',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch sorts
    await api.getPunchSorts(plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchSorts',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch types
    await api.getPunchTypes(plantId, abortSignal);
    offlineEntities.push({
        entityid: 0,
        entitytype: 'PunchTypes',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    addToDatabase(offlineEntities);
    console.log(
        'Store common data: ' + offlineEntities.length.toString(),
        offlineEntities
    );
    await offlineContentRepository.bulkAdd(offlineEntities);

    /**
     * Build offline scope for a search type entity
     */
    const buildOfflineScopeForEntity = async (
        entityId: number,
        plantId: string,
        searchType: SearchType
    ): Promise<void> => {
        offlineEntities = [];

        await api.getEntityDetails(plantId, searchType, entityId.toString());

        offlineEntities.push({
            entityid: entityId,
            entitytype: searchType,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
        });

        //Punch list
        await api.getPunchList(plantId, searchType, entityId.toString());

        offlineEntities.push({
            entityid: entityId,
            entitytype: searchType,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
        });

        //Scope (checklists)
        const scope = await api.getScope(
            plantId,
            searchType,
            entityId.toString()
        );

        offlineEntities.push({
            entityid: entityId,
            entitytype: searchType,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
        });

        //WO Info
        if (searchType === SearchType.WO) {
            //WO attachments
            const woAttachments: Attachment[] =
                await api.getWorkOrderAttachments(
                    plantId,
                    entityId.toString(),
                    abortSignal
                );

            offlineEntities.push({
                entityid: entityId,
                entitytype: searchType,
                responseObj: currentResponseObj,
                apipath: currentApiPath,
            });

            for (const attachment of woAttachments) {
                //Checklist attachment
                await api.getWorkOrderAttachment(
                    plantId,
                    entityId.toString(),
                    attachment.id,
                    abortSignal
                );
                console.log('attachment WO', currentResponseObj);
                offlineEntities.push({
                    entityid: attachment.id,
                    entitytype: searchType,
                    apipath: currentApiPath,
                    responseObj: currentResponseObj,
                });
            }
        }

        //For all checklists
        for (const checklist of scope) {
            //Checklist
            const checklistResp: ChecklistResponse = await api.getChecklist(
                plantId,
                checklist.id.toString()
            );

            offlineEntities.push({
                entityid: checklist.id,
                entitytype: searchType,
                responseObj: currentResponseObj,
                apipath: currentApiPath,
            });

            //Tag
            const tag: Tag = await api.getTag(
                plantId,
                checklistResp.checkList.tagId
            );

            offlineEntities.push({
                entityid: checklistResp.checkList.tagId,
                entitytype: searchType,
                responseObj: currentResponseObj,
                apipath: currentApiPath,
            });

            //Checklist punchlist
            const checklistPunchList: PunchPreview[] =
                await api.getChecklistPunchList(
                    plantId,
                    checklist.id.toString()
                );

            offlineEntities.push({
                entityid: checklist.id,
                entitytype: searchType,
                responseObj: currentResponseObj,
                apipath: currentApiPath,
            });

            for (const punch of checklistPunchList) {
                //Punch item
                await api.getPunchItem(plantId, punch.id.toString());

                offlineEntities.push({
                    entityid: punch.id,
                    entitytype: searchType,
                    responseObj: currentResponseObj,
                    apipath: currentApiPath,
                });

                //Punch attachments
                const punchAttachments: Attachment[] =
                    await api.getPunchAttachments(plantId, punch.id);

                offlineEntities.push({
                    entityid: checklist.id,
                    entitytype: searchType,
                    responseObj: currentResponseObj,
                    apipath: currentApiPath,
                });

                for (const attachment of punchAttachments) {
                    //Checklist attachment
                    await api.getPunchAttachment(
                        abortSignal,
                        plantId,
                        punch.id,
                        attachment.id
                    );
                    console.log(
                        'attachment currentresposobj',
                        currentResponseObj
                    );
                    offlineEntities.push({
                        entityid: attachment.id,
                        entitytype: searchType,
                        apipath: currentApiPath,
                        responseObj: currentResponseObj,
                    });
                }
            }
            //Checklist attachment list
            const checklistAttachments: Attachment[] =
                await api.getChecklistAttachments(
                    plantId,
                    checklist.id.toString()
                );

            offlineEntities.push({
                entityid: checklist.id,
                entitytype: searchType,
                apipath: currentApiPath,
                responseObj: currentResponseObj,
            });

            for (const attachment of checklistAttachments) {
                //Checklist attachment
                await api.getChecklistAttachment(
                    plantId,
                    checklist.id.toString(),
                    attachment.id
                );

                offlineEntities.push({
                    entityid: attachment.id,
                    entitytype: searchType,
                    apipath: currentApiPath,
                    responseObj: currentResponseObj,
                });
            }
        }

        addToDatabase(offlineEntities);
    };

    //Todo: vi bør sjekke om vi kan bygge parallelt, for å spare tid

    //MC pkgs
    for (const mcPkg of bookmarks.bookmarkedMcPkgs) {
        console.log('Build offline scope for MC pkgs.');
        buildOfflineScopeForEntity(mcPkg.id, plantId, SearchType.MC);
    }

    //Tag
    for (const tag of bookmarks.bookmarkedTags) {
        console.log('Build offline scope for Tag pkgs.');
        buildOfflineScopeForEntity(tag.id, plantId, SearchType.Tag);
    }
    //PO
    for (const po of bookmarks.bookmarkedPurchaseOrders) {
        console.log('Build offline scope for PO pkgs.');
        buildOfflineScopeForEntity(po.callOffId, plantId, SearchType.PO);
    }
    //WO
    for (const wo of bookmarks.bookmarkedWorkOrders) {
        console.log('Build offline scope for WO pkgs.');
        buildOfflineScopeForEntity(wo.id, plantId, SearchType.WO);
    }
};

export default buildOfflineScope;
