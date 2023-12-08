import React, { useEffect, useState } from 'react';
import {
    PunchCategory,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
} from '../../services/apiTypes';
import { NewPunch as NewPunchType } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import {
    AsyncStatus,
    ChosenPerson,
    NewPunch,
    removeSubdirectories,
    useFormFields,
} from '@equinor/procosys-webapp-components';
import AsyncPage from '../../components/AsyncPage';
import usePersonsSearchFacade from '../../utils/usePersonsSearchFacade';
import { OfflineStatus } from '../../typings/enums';

const newPunchInitialValues = {
    category: '',
    description: '',
    raisedBy: '',
    clearingBy: '',
    actionByPerson: null,
    dueDate: '',
    type: '',
    sorting: '',
    priority: '',
    estimate: '',
};

interface NewPunchWrapperProps {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
}

const NewPunchWrapper = ({
    setSnackbarText,
}: NewPunchWrapperProps): JSX.Element => {
    const { api, params, url, history, offlineState } = useCommonHooks();
    const { formFields, createChangeHandler } = useFormFields(
        newPunchInitialValues
    );
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [sortings, setSortings] = useState<PunchSort[]>([]);
    const [priorities, setPriorities] = useState<PunchPriority[]>([]);
    const [chosenPerson, setChosenPerson] = useState<ChosenPerson>({
        id: null,
        name: '',
    });
    const [fetchNewPunchStatus, setFetchNewPunchStatus] = useState(
        AsyncStatus.LOADING
    );
    const [submitPunchStatus, setSubmitPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [tempIds, setTempIds] = useState<string[]>([]);
    const { hits, searchStatus, query, setQuery } = usePersonsSearchFacade();
    const controller = new AbortController();
    const abortSignal = controller.signal;

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
                setFetchNewPunchStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                if (!(error instanceof Error)) return;
                setSnackbarText(error.message);
                setFetchNewPunchStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            controller.abort();
        };
    }, [params.plant, api]);

    useEffect(() => {
        if (submitPunchStatus === AsyncStatus.SUCCESS) {
            history.push(removeSubdirectories(url, 1));
        }
    }, [submitPunchStatus]);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const NewPunchDTO: NewPunchType = {
            CheckListId: parseInt(params.checklistId),
            CategoryId: parseInt(formFields.category),
            Description: formFields.description,
            TypeId: parseInt(formFields.type),
            RaisedByOrganizationId: parseInt(formFields.raisedBy),
            ClearingByOrganizationId: parseInt(formFields.clearingBy),
            SortingId: parseInt(formFields.sorting),
            PriorityId: parseInt(formFields.priority),
            Estimate: parseInt(formFields.estimate),
            DueDate: formFields.dueDate,
            ActionByPerson: chosenPerson.id,
            TemporaryFileIds: tempIds,
        };
        setSubmitPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postNewPunch(params.plant, NewPunchDTO);
            setSubmitPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setSubmitPunchStatus(AsyncStatus.ERROR);
        }
    };

    return (
        <>
            <AsyncPage
                fetchStatus={fetchNewPunchStatus}
                errorMessage={
                    'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
                }
                loadingMessage={'Loading new punch.'}
            >
                <NewPunch
                    formFields={formFields}
                    createChangeHandler={createChangeHandler}
                    categories={categories}
                    organizations={organizations}
                    types={types}
                    sortings={sortings}
                    priorities={priorities}
                    handleSubmit={handleSubmit}
                    submitPunchStatus={submitPunchStatus}
                    plantId={params.plant}
                    chosenPerson={chosenPerson}
                    setChosenPerson={setChosenPerson}
                    fetchNewPunchStatus={fetchNewPunchStatus}
                    setTempIds={setTempIds}
                    postTempAttachment={api.postTempPunchAttachment}
                    hits={hits}
                    searchStatus={searchStatus}
                    query={query}
                    setQuery={setQuery}
                    disablePersonsSearch={offlineState == OfflineStatus.OFFLINE}
                    disableAttahments={true}
                />
            </AsyncPage>
        </>
    );
};

export default NewPunchWrapper;
