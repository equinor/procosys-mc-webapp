import {
    Attachment,
    ChecklistPreview,
    PunchPreview,
} from '../services/apiTypes';

import { ProcosysApiService } from '../services/procosysApi';
import { EntityType } from '../typings/enums';
import { OfflineContentRepository } from './OfflineContentRepository';
import { fetchAppConfig, fetchAuthConfig } from '../services/appConfiguration';
import {
    ChecklistResponse,
    IEntity,
    SearchType,
} from '@equinor/procosys-webapp-components';
import axios, { Axios } from 'axios';

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

    const createEntityObj = (
        entityType: EntityType | string,
        entityId?: number,
        parentEntityId?: number,
        searchType?: SearchType
    ): IEntity => {
        return {
            entitytype: entityType,
            entityid: entityId,
            parententityid: parentEntityId,
            searchtype: searchType,
            responseObj: '',
            apipath: '',
        };
    };

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
        await offlineContentRepository.bulkAdd(
            Array.from(offlineEntities.values())
        );
    };

    /**
     * This function fetches data for a punch
     */
    const fetchPunch = async (
        punch: PunchPreview,
        checklist: ChecklistPreview
    ): Promise<void> => {
        //Punch item
        const punchItemEntity = createEntityObj(
            EntityType.PunchItem,
            punch.id,
            checklist.id
        );
        await api.getPunchItem(
            plantId,
            punch.id.toString(),
            abortSignal,
            punchItemEntity
        );

        addEntityToMap(punchItemEntity);

        const punchCommentsEntity = createEntityObj(
            EntityType.PunchComments,
            punch.id,
            checklist.id
        );
        //Punch comments
        await api.getPunchComments(
            plantId,
            punch.id,
            abortSignal,
            punchCommentsEntity
        );

        addEntityToMap(punchCommentsEntity);

        //Punch attachments
        const punchAttachmentsEntity = createEntityObj(
            EntityType.PunchAttachments,
            punch.id,
            checklist.id
        );

        const punchAttachments: Attachment[] = await api.getPunchAttachments(
            plantId,
            punch.id,
            abortSignal,
            punchAttachmentsEntity
        );

        addEntityToMap(punchAttachmentsEntity);

        //Fetch entities for all punch attacments
        for (const attachment of punchAttachments) {
            //Checklist attachment
            const punchAttachmentEntity = createEntityObj(
                EntityType.PunchAttachment,
                attachment.id,
                punch.id
            );

            await api.getPunchAttachment(
                plantId,
                punch.id,
                attachment.id,
                abortSignal,
                punchAttachmentEntity
            );
            addEntityToMap(punchAttachmentEntity);
        }
        console.log('Nå har jeg gjort fetch punch');
    };

    /**
     * This function fetches data for a checklist
     */
    const fetchChecklist = async (
        entityId: number,
        searchType: SearchType,
        checklist: ChecklistPreview
    ): Promise<void> => {
        try {
            const checklistEntity = createEntityObj(
                EntityType.Checklist,
                checklist.id,
                entityId,
                searchType
            );

            const checklistResp: ChecklistResponse = await api.getChecklist(
                plantId,
                checklist.id.toString(),
                abortSignal,
                checklistEntity
            );

            addEntityToMap(checklistEntity);

            //Tag
            const tagEntity = createEntityObj(
                EntityType.Tag,
                checklistResp.checkList.tagId,
                entityId
            );
            await api.getTag(
                plantId,
                checklistResp.checkList.tagId,
                abortSignal,
                tagEntity
            );

            addEntityToMap(tagEntity);

            //Checklist punchlist
            const checklistPunchListEntity = createEntityObj(
                EntityType.ChecklistPunchlist,
                checklist.id,
                entityId
            );
            const checklistPunchList: PunchPreview[] =
                await api.getChecklistPunchList(
                    plantId,
                    checklist.id.toString(),
                    abortSignal,
                    checklistPunchListEntity
                );

            addEntityToMap(checklistPunchListEntity);

            //Punches
            const fetchPunchPromises = checklistPunchList.map(async (punch) => {
                await fetchPunch(punch, checklist);
            });

            await Promise.allSettled(fetchPunchPromises);

            //Checklist attachment list
            const checklistAttachmentsEntity = createEntityObj(
                EntityType.ChecklistAttachments,
                checklist.id,
                entityId
            );

            const checklistAttachments: Attachment[] =
                await api.getChecklistAttachments(
                    plantId,
                    checklist.id.toString(),
                    abortSignal,
                    checklistAttachmentsEntity
                );

            addEntityToMap(checklistAttachmentsEntity);

            //Fetch all checklist attachments
            for (const attachment of checklistAttachments) {
                //Checklist attachment

                const checklistAttachmentEntity = createEntityObj(
                    EntityType.ChecklistAttachment,
                    attachment.id,
                    checklist.id
                );

                await api.getChecklistAttachment(
                    plantId,
                    checklist.id.toString(),
                    attachment.id,
                    abortSignal,
                    checklistAttachmentEntity
                );

                addEntityToMap(checklistAttachmentEntity);
            }
        } catch (e) {
            console.error('Error occured when fetching checklists.');
        }
    };

    //------------------------------------------------------------
    // Fetch data and store in offline database.
    //------------------------------------------------------------

    //auth config
    const authConfigEntity = createEntityObj(EntityType.AuthConfig);
    const authConfig = await fetchAuthConfig(authConfigEntity);
    addEntityToMap(authConfigEntity);

    //App config
    const appConfigEntity = createEntityObj(EntityType.AppConfig);
    await fetchAppConfig(
        authConfig.configurationEndpoint,
        configurationAccessToken,
        appConfigEntity
    );
    addEntityToMap(appConfigEntity);

    //Bookmarks
    const bookmarksEntity = createEntityObj(EntityType.Bookmarks);

    const bookmarks = await api.getBookmarks(
        plantId,
        projectId,
        abortSignal,
        bookmarksEntity
    );
    if (bookmarks == null) {
        console.error('No bookmarks found.');
        return; //todo: Må gi feilmelding. Dette skal ikke kunne gå ann.
    }
    addEntityToMap(bookmarksEntity);

    //Permissions
    const permissionsEntity = createEntityObj(EntityType.Permissions);
    await api.getPermissionsForPlant(`PCS$${plantId}`, permissionsEntity);
    addEntityToMap(permissionsEntity);

    //Plants
    const plantEntity = createEntityObj(EntityType.Plants);
    await api.getPlants(plantEntity);
    addEntityToMap(plantEntity);

    //Projects
    const projectsForPlantEntity = createEntityObj(EntityType.Projects);
    await api.getProjectsForPlant(`PCS$${plantId}`, projectsForPlantEntity);
    addEntityToMap(projectsForPlantEntity);


    const cancelTokenSource = axios.CancelToken.source();
    const cancelToken = cancelTokenSource.token;
    
    //Punch categories
    const punchCategoriesEntity = createEntityObj(EntityType.PunchCategories);
    await api.getPunchCategories(plantId, cancelToken, punchCategoriesEntity);
    addEntityToMap(punchCategoriesEntity);

    //Punch organization
    const punchOrganizationsEntity = createEntityObj(
        EntityType.PunchOrganization
    );
    await api.getPunchOrganizations(
        plantId,
        abortSignal,
        punchOrganizationsEntity
    );
    addEntityToMap(punchOrganizationsEntity);

    //Punch priorities

    const punchPrioritiesEntity = createEntityObj(EntityType.PunchPriorities);
    await api.getPunchPriorities(plantId, abortSignal, punchPrioritiesEntity);
    addEntityToMap(punchPrioritiesEntity);

    //Punch sorts
    const punchSortsEntity = createEntityObj(EntityType.PunchSorts);
    await api.getPunchSorts(plantId, abortSignal, punchSortsEntity);
    addEntityToMap(punchSortsEntity);

    //Punch types
    const punchTypesEntity = createEntityObj(EntityType.PunchTypes);
    await api.getPunchTypes(plantId, abortSignal, punchTypesEntity);
    addEntityToMap(punchTypesEntity);

    /**
     * Build offline scope for a search type entity
     */
    const buildOfflineScopeForEntity = async (
        entityId: number,
        plantId: string,
        searchType: SearchType
    ): Promise<void> => {
        //Entity details (MCpkg, WO, PO, Tag)
        const entityDetailsObj = createEntityObj(
            searchType + EntityType.EntityDetails,
            entityId
        );
        const entityDetails = await api.getEntityDetails(
            plantId,
            searchType,
            entityId.toString(),
            abortSignal,
            entityDetailsObj
        );

        addEntityToMap(entityDetailsObj);

        //Punch list
        const punchListEntity = createEntityObj(EntityType.Punchlist, entityId);
        await api.getPunchList(
            plantId,
            searchType,
            entityId.toString(),
            entityDetails,
            abortSignal,
            punchListEntity
        );
        addEntityToMap(punchListEntity);

        //Scope (checklists)
        const scopeEntity = createEntityObj(
            searchType + EntityType.Checklists,
            entityId,
            entityId,
            searchType
        );
        const scope = await api.getScope(
            plantId,
            searchType,
            entityId.toString(),
            entityDetails,
            abortSignal,
            scopeEntity
        );

        addEntityToMap(scopeEntity);

        //WO Info
        if (searchType === SearchType.WO) {
            //WO attachments

            const woAttachmentsEntity = createEntityObj(
                EntityType.WorkOrderAttachments,
                entityId,
                entityId
            );

            const woAttachments: Attachment[] =
                await api.getWorkOrderAttachments(
                    plantId,
                    entityId.toString(),
                    abortSignal,
                    woAttachmentsEntity
                );

            addEntityToMap(woAttachmentsEntity);

            //Get entities for all workorder attacments
            for (const attachment of woAttachments) {
                //workorder attachment
                const woOrderAttachmentEntity = createEntityObj(
                    EntityType.WorkOrderAttachment,
                    attachment.id,
                    entityId
                );

                await api.getWorkOrderAttachment(
                    plantId,
                    entityId.toString(),
                    attachment.id as unknown as string,
                    abortSignal,
                    woOrderAttachmentEntity
                );
                addEntityToMap(woOrderAttachmentEntity);
            }
        }

        //fetch entitities for all checklists
        const checklistPromises = scope.map(async (checklist) => {
            await fetchChecklist(entityId, searchType, checklist);
        });

        await Promise.all(checklistPromises);
    };

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
