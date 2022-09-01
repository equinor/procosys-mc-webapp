import {
    Attachment,
    ChecklistResponse,
    PunchPreview,
    Tag,
} from '../services/apiTypes';

import { ProcosysApiService } from '../services/procosysApi';
import { SearchType } from '../typings/enums';
import { OfflineContentRepository } from './OfflineContentRepository';
import { IEntity } from './IEntity';
import { IAuthService } from '../services/authService';
import { fetchAppConfig, fetchAuthConfig } from '../services/appConfiguration';

const buildOfflineScope = async (
    auth: IAuthService,
    api: ProcosysApiService,
    plantId: string,
    projectId: number
): Promise<void> => {
    const controller = new AbortController();
    const abortSignal = controller.signal;
    const offlineContentRepository = new OfflineContentRepository();
    const offlineEntities: Map<string, IEntity> = new Map();

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

    /**
     * Add entities to a map. This will ensure that no duplicates are stored in the database (entities with same api path)
     */
    const addEntityToMap = (entity: IEntity): void => {
        const entityExists = offlineEntities.has(entity.apipath);
        if (!entityExists) {
            offlineEntities.set(entity.apipath, entity);
        }
    };

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
    // Fetch data from procosysApi, and store in browser database
    //------------------------------------------------------------

    //auth config
    const authConfig = await fetchAuthConfig(cbFunc);
    addEntityToMap({
        entityid: 0,
        entitytype: 'Auth',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //auth config
    const appConfig = await fetchAppConfig(
        authConfig.configurationEndpoint,
        authConfig.authority
    );
    addEntityToMap({
        entityid: 0,
        entitytype: 'Auth',
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
        entityid: 0,
        entitytype: 'Bookmarks',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Permissions
    await api.getPermissionsForPlant(`PCS$${plantId}`);
    addEntityToMap({
        entityid: 0,
        entitytype: 'Permissions',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Plants
    const plants = await api.getPlants();
    //todo: hvis vi ikke ønsker å vise alle plants, kan vi filtrere her.
    addEntityToMap({
        entityid: 0,
        entitytype: 'Plants',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Projects
    const projects = await api.getProjectsForPlant(`PCS$${plantId}`);
    //todo: hvis vi ikke ønsker å vise alle projects, kan vi filtrere her.
    addEntityToMap({
        entityid: 0,
        entitytype: 'Projects',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch categories
    await api.getPunchCategories(plantId, abortSignal);
    addEntityToMap({
        entityid: 0,
        entitytype: 'PunchCategories',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch organization
    await api.getPunchOrganizations(plantId, abortSignal);
    addEntityToMap({
        entityid: 0,
        entitytype: 'PunchOrganization',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch priorities
    await api.getPunchPriorities(plantId, abortSignal);
    addEntityToMap({
        entityid: 0,
        entitytype: 'PunchPriorities',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch sorts
    await api.getPunchSorts(plantId, abortSignal);
    addEntityToMap({
        entityid: 0,
        entitytype: 'PunchSorts',
        responseObj: currentResponseObj,
        apipath: currentApiPath,
    });

    //Punch types
    await api.getPunchTypes(plantId, abortSignal);
    addEntityToMap({
        entityid: 0,
        entitytype: 'PunchTypes',
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
        await api.getEntityDetails(plantId, searchType, entityId.toString());

        addEntityToMap({
            entityid: entityId,
            entitytype: searchType,
            responseObj: currentResponseObj,
            apipath: currentApiPath,
        });

        //Punch list
        await api.getPunchList(plantId, searchType, entityId.toString());

        addEntityToMap({
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

        addEntityToMap({
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

            addEntityToMap({
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
                addEntityToMap({
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

            addEntityToMap({
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

            addEntityToMap({
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

            addEntityToMap({
                entityid: checklist.id,
                entitytype: searchType,
                responseObj: currentResponseObj,
                apipath: currentApiPath,
            });

            for (const punch of checklistPunchList) {
                //Punch item
                await api.getPunchItem(plantId, punch.id.toString());

                addEntityToMap({
                    entityid: punch.id,
                    entitytype: searchType,
                    responseObj: currentResponseObj,
                    apipath: currentApiPath,
                });

                //Punch attachments
                const punchAttachments: Attachment[] =
                    await api.getPunchAttachments(plantId, punch.id);

                addEntityToMap({
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
                    addEntityToMap({
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

            addEntityToMap({
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

                addEntityToMap({
                    entityid: attachment.id,
                    entitytype: searchType,
                    apipath: currentApiPath,
                    responseObj: currentResponseObj,
                });
            }
        }
    };

    //Todo: Vi bør sjekke om vi kan bygge parallelt, for å spare tid
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
