import {
    Attachment,
    ChecklistResponse,
    PunchPreview,
    Tag,
} from '../services/apiTypes';

import { ProcosysApiService } from '../services/procosysApi';
import { EntityType, SearchType } from '../typings/enums';
import { OfflineContentRepository } from './OfflineContentRepository';
import { IEntity } from './IEntity';
import { fetchAppConfig, fetchAuthConfig } from '../services/appConfiguration';
import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';

/**
 * This function will be called when user want to go offline with given bookmarks.
 * All relevant data will be fetched from main-api, and store in browser database (indexeddb).
 * When the user is offline, all calls to main-api will be intercepted, and data will be fetched from indexeddb instead.
 */
const buildOfflineScope = async (
    api: ProcosysApiService,
    plantId: string,
    projectId: number,
    configurationAccessToken: string
): Promise<void> => {
    const controller = new AbortController();
    const abortSignal = controller.signal;
    const offlineContentRepository = new OfflineContentRepository();
    const offlineEntities: Map<string, IEntity> = new Map();

    let currentResponseObj = '' as string | Blob;
    let currentApiPath = '';

    /**
     * This function will be used as a callback function when calling fetch-methods.
     * When performing a fetch call (in e.g. procosysApi.ts) we must call this function, and pass the resonse object and url path.
     * This function will then update the local variables currentResponsObj and currentApiPath, so that we can build the offline scope.
     * @param responseObj The response object given by the fetch
     * @param apiPath The url path
     */
    const cbFunc = (
        responseObj: string | Blob,
        apiPath: string
    ): string | Blob => {
        currentResponseObj = responseObj;
        currentApiPath = removeBaseUrlFromUrl(apiPath);
        return responseObj;
    };

    api.setCallbackFunction(cbFunc);

    /**
     * This function will be use to add entities to a map. It will ensure that no duplicates are stored in the database (entities with same api path)
     */
    const addEntityToMap = (entity: IEntity): void => {
        const entityExists = offlineEntities.has(entity.apipath);
        if (!entityExists) {
            offlineEntities.set(entity.apipath, entity);
        }
    };

    /**
     * This function will add the map of offline entities, to the offline database.
     */
    const addEntitiesToDatabase = async (): Promise<void> => {
        console.log(
            `Entities to store in database (${offlineEntities.size}`,
            offlineEntities
        );
        await offlineContentRepository.bulkAdd(
            Array.from(offlineEntities.values())
        );
    };

    //------------------------------------------------------------
    // Fetch data and store in offline database.
    //------------------------------------------------------------

    //auth config
    const authConfig = await fetchAuthConfig(cbFunc);
    addEntityToMap({
        entitytype: EntityType.AuthConfig,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //App config
    await fetchAppConfig(
        authConfig.configurationEndpoint,
        configurationAccessToken,
        cbFunc
    );
    addEntityToMap({
        entitytype: EntityType.AppConfig,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Bookmarks
    const bookmarks = await api.getBookmarks(plantId, projectId, abortSignal);
    if (bookmarks == null) {
        console.log('No offline scope started for project.', projectId);
        return; //todo: Må gi feilmelding. Dette skal ikke kunne gå ann.
    }
    console.log('Offline bookmarks', bookmarks);
    addEntityToMap({
        entitytype: EntityType.Bookmarks,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Permissions
    await api.getPermissionsForPlant(`PCS$${plantId}`);
    addEntityToMap({
        entitytype: EntityType.Permissions,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Plants
    await api.getPlants();
    //todo: hvis vi ikke ønsker å vise alle plants, kan vi filtrere her.
    addEntityToMap({
        entitytype: EntityType.Plants,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Projects
    await api.getProjectsForPlant(`PCS$${plantId}`);
    //todo: hvis vi ikke ønsker å vise alle projects, kan vi filtrere her.
    addEntityToMap({
        entitytype: EntityType.Projects,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch categories
    await api.getPunchCategories(plantId, abortSignal);
    addEntityToMap({
        entitytype: EntityType.PunchCategories,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch organization
    await api.getPunchOrganizations(plantId, abortSignal);
    addEntityToMap({
        entitytype: EntityType.PunchOrganization,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch priorities
    await api.getPunchPriorities(plantId, abortSignal);
    addEntityToMap({
        entitytype: EntityType.PunchPriorities,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch sorts
    await api.getPunchSorts(plantId, abortSignal);
    addEntityToMap({
        entitytype: EntityType.PunchSorts,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch types
    await api.getPunchTypes(plantId, abortSignal);
    addEntityToMap({
        entitytype: EntityType.PunchTypes,
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    /**
     * Build offline scope for a search type entity
     */
    const buildOfflineScopeForEntity = async (
        entityId: number,
        plantId: string,
        searchType: SearchType
    ): Promise<void> => {
        //Entity details (MCpkg, WO, PO, Tag)
        const entityDetails = await api.getEntityDetails(
            plantId,
            searchType,
            entityId.toString()
        );

        addEntityToMap({
            entityid: entityId,
            entitytype: searchType + EntityType.EntityDetails,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
        });

        //Punch list
        await api.getPunchList(
            plantId,
            searchType,
            entityId.toString(),
            entityDetails
        );

        addEntityToMap({
            entityid: entityId,
            entitytype: EntityType.Punchlist,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
        });

        //Scope (checklists)
        const scope = await api.getScope(
            plantId,
            searchType,
            entityId.toString(),
            entityDetails
        );

        addEntityToMap({
            entitytype: searchType + EntityType.Checklists,
            entityid: entityId,
            parententityid: entityId,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
            searchtype: searchType,
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

            addEntityToMap({
                entitytype: EntityType.WorkOrderAttachments,
                entityid: entityId,
                parententityid: entityId,
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
                addEntityToMap({
                    entitytype: EntityType.WorkOrderAttachment,
                    entityid: attachment.id,
                    parententityid: entityId,
                    apipath: currentApiPath,
                    responseObj: currentResponseObj,
                });
            }
        }

        //For all checklists
        for (const checklist of scope) {
            //Checklist
            try {
                // todo: ta bort try.
                const checklistResp: ChecklistResponse = await api.getChecklist(
                    plantId,
                    checklist.id.toString()
                );

                addEntityToMap({
                    entitytype: EntityType.Checklist,
                    entityid: checklist.id,
                    parententityid: entityId,
                    responseObj: currentResponseObj,
                    apipath: currentApiPath,
                    searchtype: searchType,
                });
                //Tag
                await api.getTag(plantId, checklistResp.checkList.tagId);

                addEntityToMap({
                    entitytype: EntityType.Tag,
                    entityid: checklistResp.checkList.tagId,
                    parententityid: entityId,
                    responseObj: currentResponseObj,
                    apipath: currentApiPath,
                });

                //Checklist punchlist
                const checklistPunchList: PunchPreview[] =
                    await api.getChecklistPunchList(
                        plantId,
                        checklist.id.toString()
                    );

                addEntityToMap({
                    entitytype: EntityType.ChecklistPunchlist,
                    entityid: checklist.id,
                    parententityid: entityId,
                    responseObj: currentResponseObj,
                    apipath: currentApiPath,
                });

                for (const punch of checklistPunchList) {
                    //Punch item
                    await api.getPunchItem(plantId, punch.id.toString());

                    addEntityToMap({
                        entitytype: EntityType.PunchItem,
                        entityid: punch.id,
                        parententityid: checklist.id,
                        responseObj: currentResponseObj,
                        apipath: currentApiPath,
                    });

                    //Punch attachments
                    const punchAttachments: Attachment[] =
                        await api.getPunchAttachments(plantId, punch.id);

                    addEntityToMap({
                        entitytype: EntityType.PunchAttachments,
                        entityid: punch.id,
                        parententityid: checklist.id,
                        responseObj: currentResponseObj,
                        apipath: currentApiPath,
                    });

                    for (const attachment of punchAttachments) {
                        //Checklist attachment
                        await api.getPunchAttachment(
                            plantId,
                            punch.id,
                            attachment.id,
                            abortSignal
                        );
                        addEntityToMap({
                            entitytype: EntityType.PunchAttachment,
                            entityid: attachment.id,
                            parententityid: punch.id,
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

                addEntityToMap({
                    entitytype: EntityType.ChecklistAttachments,
                    entityid: checklist.id,
                    parententityid: entityId,
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

                    addEntityToMap({
                        entitytype: EntityType.ChecklistAttachment,
                        entityid: attachment.id,
                        parententityid: checklist.id,
                        apipath: currentApiPath,
                        responseObj: currentResponseObj,
                    });
                }
            } catch (e) {
                console.error('Feil med getcheckoust. hopper over.');
            }
        }
    };

    //Todo: Vi bør sjekke om vi kan bygge parallelt, for å spare tid. Altså, for-løkke som start buildOfflineScopeForEntity for alle elementer.
    //Todo: Istedenfor å gjøre api-kall, og så finne ut om vi allerede har entity i map-en, burde vi unngå å hente samme entity flere ganger.

    //MC pkgs
    for (const mcPkg of bookmarks.bookmarkedMcPkgs) {
        console.log('Build offline scope for MC pkgs.');
        await buildOfflineScopeForEntity(mcPkg.id, plantId, SearchType.MC);
    }

    //Tag
    for (const tag of bookmarks.bookmarkedTags) {
        console.log('Build offline scope for Tag pkgs.');
        await buildOfflineScopeForEntity(tag.id, plantId, SearchType.Tag);
    }
    //PO
    for (const po of bookmarks.bookmarkedPurchaseOrders) {
        console.log('Build offline scope for PO pkgs.');
        await buildOfflineScopeForEntity(po.callOffId, plantId, SearchType.PO);
    }
    //WO
    for (const wo of bookmarks.bookmarkedWorkOrders) {
        console.log('Build offline scope for WO pkgs.');
        await buildOfflineScopeForEntity(wo.id, plantId, SearchType.WO);
    }

    addEntitiesToDatabase();
};

export default buildOfflineScope;
