import React, { useState, useEffect } from 'react';
import { AsyncStatus } from '../../contexts/McAppContext';
import useCommonHooks from '../../utils/useCommonHooks';
import {
    PunchCategory,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
} from '../../services/apiTypes';
import {
    ClearPunch,
    PunchEndpoints,
    UpdatePunchData,
    useSnackbar,
    PunchAction,
    PunchItem,
    OfflineStatus,
} from '@equinor/procosys-webapp-components';
import usePersonsSearchFacade from '../../utils/usePersonsSearchFacade';

const punchEndpoints: PunchEndpoints = {
    updateCategory: 'SetCategory',
    updateDescription: 'SetDescription',
    updateRaisedBy: 'SetRaisedBy',
    updateClearingBy: 'SetClearingBy',
    updateActionByPerson: 'SetActionByPerson',
    updateDueDate: 'setDueDate',
    updateType: 'SetType',
    updateSorting: 'SetSorting',
    updatePriority: 'SetPriority',
    updateEstimate: 'setEstimate',
};

type ClearPunchWrapperProps = {
    punchItem: PunchItem;
    setPunchItem: React.Dispatch<React.SetStateAction<PunchItem>>;
    canEdit: boolean;
    canClear: boolean;
};

const ClearPunchWrapper = ({
    punchItem,
    setPunchItem,
    canEdit,
    canClear,
}: ClearPunchWrapperProps): JSX.Element => {
    const { api, params, history, url, offlineState } = useCommonHooks();
    const { snackbar, setSnackbarText } = useSnackbar();
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [sortings, setSortings] = useState<PunchSort[]>([]);
    const [priorities, setPriorities] = useState<PunchPriority[]>([]);
    const [fetchOptionsStatus, setFetchOptionsStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [updatePunchStatus, setUpdatePunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [clearPunchStatus, setClearPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const abortController = new AbortController();
    const abortSignal = abortController.signal;
    const { hits, searchStatus, query, setQuery } = usePersonsSearchFacade();

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const [
                    categoriesFromApi,
                    typesFromApi,
                    organizationsFromApi,
                    sortsFromApi,
                    prioritiesFromApi,
                ] = await Promise.all([
                    api.getPunchCategories(params.plant, abortSignal),
                    api.getPunchTypes(params.plant, abortSignal),
                    api.getPunchOrganizations(params.plant, abortSignal),
                    api.getPunchSorts(params.plant, abortSignal),
                    api.getPunchPriorities(params.plant, abortSignal),
                ]);
                setCategories(categoriesFromApi);
                setTypes(typesFromApi);
                setOrganizations(organizationsFromApi);
                setSortings(sortsFromApi);
                setPriorities(prioritiesFromApi);
                setFetchOptionsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                if (!(error instanceof Error)) return;
                setSnackbarText(error.message);
                setFetchOptionsStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            abortController.abort();
        };
    }, [params.plant, api, params.punchItemId]);

    const updateDatabase = async (
        endpoint: string,
        updateData: UpdatePunchData
    ): Promise<void> => {
        setUpdatePunchStatus(AsyncStatus.LOADING);
        setSnackbarText('Saving change.');
        try {
            await api.putUpdatePunch(
                params.plant,
                params.punchItemId,
                updateData,
                endpoint
            );
            setUpdatePunchStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Change successfully saved.');
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setUpdatePunchStatus(AsyncStatus.ERROR);
        }
    };

    const clearPunch = async (): Promise<void> => {
        setClearPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postPunchAction(
                params.plant,
                params.punchItemId,
                PunchAction.CLEAR
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
            getPunchAttachments={api.getPunchAttachments}
            getPunchAttachment={api.getPunchAttachment}
            postPunchAttachment={api.postPunchAttachment}
            getPunchComments={api.getPunchComments}
            postPunchComment={api.postPunchComment}
            deletePunchAttachment={api.deletePunchAttachment}
            snackbar={snackbar}
            setSnackbarText={setSnackbarText}
            hits={hits}
            searchStatus={searchStatus}
            query={query}
            setQuery={setQuery}
            abortController={abortController}
            disablePersonsSearch={offlineState == OfflineStatus.OFFLINE}
        />
    );
};

export default ClearPunchWrapper;
