import React, { useState, useEffect, useCallback } from 'react';
import useCommonHooks from '../../utils/useCommonHooks';
import { PunchCategory } from '../../services/apiTypes';
import {
    ClearPunch,
    PunchEndpoints,
    UpdatePunchData,
    useSnackbar,
    PunchAction,
    AsyncStatus,
    isArrayOfType,
} from '@equinor/procosys-webapp-components';
import usePersonsSearchFacade from '../../utils/usePersonsSearchFacade';
import { OfflineStatus } from '../../typings/enums';
import { PunchItem } from '../../services/apiTypesCompletionApi';
import { LibrayTypes } from '@equinor/procosys-webapp-components/dist/typings/apiTypes';
import Axios, { AxiosError, AxiosResponse } from 'axios';
import { hasErrors, renderErrors } from '../../utils/renderErrors';

const punchEndpoints: PunchEndpoints = {
    updateCategory: 'UpdateCategory',
    updateDescription: '/Description',
    updateRaisedBy: '/RaisedByOrgGuid',
    updateClearingBy: '/ClearingByOrgGuid',
    updateActionByPerson: '/ActionByPersonOid',
    updateDueDate: '/DueTimeUtc',
    updateType: '/TypeGuid',
    updateSorting: '/SortingGuid',
    updatePriority: '/PriorityGuid',
    updateEstimate: '/Estimate',
};

type ClearPunchWrapperProps = {
    punchItem: PunchItem;
    setPunchItem: React.Dispatch<React.SetStateAction<PunchItem>>;
    canEdit: boolean;
    canClear: boolean;
};

type Queue = {
    patchDocument?: UpdatePunchData;
    rowVersion: string;
    category?: string;
};

const ClearPunchWrapper = ({
    punchItem,
    setPunchItem,
    canEdit,
    canClear,
}: ClearPunchWrapperProps): JSX.Element => {
    const {
        api,
        params,
        history,
        url,
        offlineState,
        completionApi,
        completionBaseApiInstance,
    } = useCommonHooks();
    const [updateQueue, setUpdateQueue] = useState<Queue[]>([]);
    const [rowVersion, setRowVersion] = useState<string>();
    const { snackbar, setSnackbarText } = useSnackbar();
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<LibrayTypes[]>([]);
    const [organizations, setOrganizations] = useState<LibrayTypes[]>([]);
    const [sortings, setSortings] = useState<LibrayTypes[]>([]);
    const [priorities, setPriorities] = useState<LibrayTypes[]>([]);
    const [fetchOptionsStatus, setFetchOptionsStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [updatePunchStatus, setUpdatePunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [clearPunchStatus, setClearPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const source = Axios.CancelToken.source();
    const { hits, searchStatus, query, setQuery } = usePersonsSearchFacade();

    const getLibraryItems = useCallback(async () => {
        const categoriesFromApi = await api
            .getPunchCategories(params.plant, source.token)
            .catch(() => setFetchOptionsStatus(AsyncStatus.ERROR));

        const librayItems = await completionApi
            .getLibraryItems(params.plant, source.token)
            .catch(() => setFetchOptionsStatus(AsyncStatus.ERROR));

        if (isArrayOfType<LibrayTypes>(librayItems, 'guid')) {
            const types = librayItems.reduce((acc, type) => {
                const group = acc.get(type.libraryType) || [];
                acc.set(type.libraryType, [...group, type]);
                return acc;
            }, new Map());

            setOrganizations(types.get('COMPLETION_ORGANIZATION'));
            setTypes(types.get('PUNCHLIST_TYPE'));
            setSortings(types.get('PUNCHLIST_SORTING'));
            setPriorities(types.get('PUNCHLIST_PRIORITY'));
        }

        if (isArrayOfType<PunchCategory>(categoriesFromApi, 'id')) {
            setCategories(categoriesFromApi);
        }
        setFetchOptionsStatus(AsyncStatus.SUCCESS);
    }, [params.plant]);

    useEffect(() => {
        getLibraryItems();
        return (): void => {
            source.cancel();
        };
    }, [params.plant, api, params.punchItemId]);

    useEffect(() => {
        if (punchItem) setRowVersion(punchItem.rowVersion);
    }, []);

    const processQueue = useCallback(async () => {
        if (updatePunchStatus === AsyncStatus.LOADING) {
            return;
        }
        setUpdatePunchStatus(AsyncStatus.LOADING);
        const { patchDocument, category } = updateQueue[0];
        const data = category
            ? { category, rowVersion }
            : { patchDocument, rowVersion };
        const updatedData: AxiosResponse<string> | void =
            await completionBaseApiInstance
                .patch(
                    `PunchItems/${punchItem?.guid}${
                        category ? `/${punchEndpoints.updateCategory}` : ''
                    }`,
                    data,
                    { headers: { 'x-plant': `PCS$${params.plant}` } }
                )
                .catch((error: AxiosError) => {
                    setSnackbarText(
                        hasErrors(error)
                            ? renderErrors(error)
                            : 'Something went wrong while saving the punch'
                    );
                    setUpdatePunchStatus(AsyncStatus.ERROR);
                })
                .finally(() => {
                    setUpdatePunchStatus(AsyncStatus.SUCCESS);
                });
        setUpdateQueue((prevQueue) => prevQueue.slice(1));
        if (updatedData?.data) {
            setRowVersion(updatedData.data);
            setSnackbarText('Saved successfully');
        }
    }, [updatePunchStatus, updateQueue, rowVersion]);

    useEffect(() => {
        if (
            updatePunchStatus !== AsyncStatus.ERROR &&
            updatePunchStatus !== AsyncStatus.LOADING &&
            updateQueue.length
        ) {
            processQueue();
        }
    }, [updatePunchStatus, updateQueue, rowVersion]);

    const updateDatabase = useCallback(
        async (
            endpoint: string,
            updateData: UpdatePunchData
        ): Promise<void> => {
            setUpdateQueue((prev: any) => [
                ...prev,
                endpoint === punchEndpoints.updateCategory
                    ? { category: updateData, rowVersion }
                    : {
                          patchDocument: [
                              {
                                  value: updateData,
                                  path: endpoint,
                                  op: 'replace',
                              },
                          ],
                          rowVersion,
                      },
            ]);
        },
        [rowVersion, updatePunchStatus]
    );

    const clearPunch = async (): Promise<void> => {
        setClearPunchStatus(AsyncStatus.LOADING);
        try {
            await completionApi.postPunchAction(
                params.plant,
                params.proCoSysGuid,
                PunchAction.CLEAR,
                punchItem.rowVersion
            );
            setClearPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setClearPunchStatus(AsyncStatus.ERROR);
        }
    };

    return (
        <ClearPunch
            plantId={params.plant}
            punchItem={punchItem}
            setPunchItem={setPunchItem}
            canEdit={canEdit}
            canClear={canClear}
            punchEndpoints={punchEndpoints}
            updateDatabase={updateDatabase}
            organizations={organizations}
            categories={categories}
            types={types}
            sortings={sortings}
            priorities={priorities}
            clearPunchStatus={clearPunchStatus}
            setClearPunchStatus={setClearPunchStatus}
            clearPunch={clearPunch}
            redirectAfterClearing={(): void => {
                history.push(url);
            }}
            fetchOptionsStatus={fetchOptionsStatus}
            updatePunchStatus={updatePunchStatus}
            getPunchAttachments={completionApi.getPunchAttachments}
            getPunchAttachment={completionApi.getPunchAttachment}
            postPunchAttachment={completionApi.postPunchAttachment}
            getPunchComments={completionApi.getPunchComments}
            postPunchComment={completionApi.postPunchComment}
            deletePunchAttachment={completionApi.deletePunchAttachment}
            snackbar={snackbar}
            setSnackbarText={setSnackbarText}
            hits={hits}
            searchStatus={searchStatus}
            query={query}
            setQuery={setQuery}
            disablePersonsSearch={offlineState == OfflineStatus.OFFLINE}
        />
    );
};

export default ClearPunchWrapper;
