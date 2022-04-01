import React, { useState, useEffect } from 'react';
import { AsyncStatus } from '../../contexts/McAppContext';
import useCommonHooks from '../../utils/useCommonHooks';
import EdsIcon from '../../components/icons/EdsIcon';
import ensure from '../../utils/ensure';
import {
    Attachment,
    PunchCategory,
    PunchItem,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
} from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import {
    Attachments,
    ClearPunch,
    ErrorPage,
    PunchEndpoints,
    ReloadButton,
    SkeletonLoadingPage,
    UpdatePunchData,
    useSnackbar,
    PunchAction,
} from '@equinor/procosys-webapp-components';
import { Person } from '@equinor/procosys-webapp-components/dist/typings/apiTypes';
import Axios from 'axios';
import usePersonsSearchFacade from '../../utils/usePersonsSearchFacade';

const punchEndpints: PunchEndpoints = {
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
    const { api, params, history, url } = useCommonHooks();
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
    const { hits, searchStatus, query, setQuery } = usePersonsSearchFacade();
    const source = Axios.CancelToken.source();

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
                    api.getPunchCategories(params.plant, source.token),
                    api.getPunchTypes(params.plant, source.token),
                    api.getPunchOrganizations(params.plant, source.token),
                    api.getPunchSorts(params.plant, source.token),
                    api.getPunchPriorities(params.plant, source.token),
                ]);
                setCategories(categoriesFromApi);
                setTypes(typesFromApi);
                setOrganizations(organizationsFromApi);
                setSortings(sortsFromApi);
                setPriorities(prioritiesFromApi);
                setFetchOptionsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchOptionsStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
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
            const pcsError = error as Error;
            setUpdatePunchStatus(AsyncStatus.ERROR);
            setSnackbarText(pcsError.toString());
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
            punchEndpoints={punchEndpints}
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
            deletePunchAttachment={api.deletePunchAttachment}
            snackbar={snackbar}
            setSnackbarText={setSnackbarText}
            hits={hits}
            searchStatus={searchStatus}
            query={query}
            setQuery={setQuery}
            source={source}
        />
    );
};

export default ClearPunchWrapper;
