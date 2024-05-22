import React, { useCallback, useEffect, useState } from 'react';
import { PunchCategory } from '../../services/apiTypes';
import { NewPunch as NewPunchType } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import {
    AsyncStatus,
    ChosenPerson,
    NewPunch,
    isArrayOfType,
    removeSubdirectories,
    useFormFields,
} from '@equinor/procosys-webapp-components';
import AsyncPage from '../../components/AsyncPage';
import usePersonsSearchFacade from '../../utils/usePersonsSearchFacade';
import { OfflineStatus } from '../../typings/enums';
import { LibrayTypes } from '../../services/apiTypesCompletionApi';
import Axios from 'axios';

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
    const { api, params, url, history, offlineState, completionApi } =
        useCommonHooks();
    const { formFields, createChangeHandler } = useFormFields(
        newPunchInitialValues
    );
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<LibrayTypes[]>([]);
    const [organizations, setOrganizations] = useState<LibrayTypes[]>([]);
    const [sortings, setSortings] = useState<LibrayTypes[]>([]);
    const [priorities, setPriorities] = useState<LibrayTypes[]>([]);
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
    const source = Axios.CancelToken.source();

    const getLibraryTypes = useCallback(async () => {
        const categoriesFromApi = await api
            .getPunchCategories(params.plant, source.token)
            .catch(() => setFetchNewPunchStatus(AsyncStatus.ERROR));

        const libraryTypes = await completionApi
            .getLibraryItems(params.plant, source.token)
            .catch(() => setFetchNewPunchStatus(AsyncStatus.ERROR));

        if (isArrayOfType<LibrayTypes>(libraryTypes, 'guid')) {
            const types = libraryTypes.reduce((acc, type) => {
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
        setFetchNewPunchStatus(AsyncStatus.SUCCESS);
    }, [params.plant]);

    useEffect(() => {
        getLibraryTypes();
        return (): void => {
            source.cancel();
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
            checkListGuid: params.checklistId,
            category: formFields.category,
            description: formFields.description,
            typeGuid: formFields.type,
            raisedByOrgGuid: formFields.raisedBy,
            clearingByOrgGuid: formFields.clearingBy,
            sortingGuid: formFields.sorting,
            priorityGuid: formFields.priority,
            estimate: parseInt(formFields.estimate),
            dueTimeUtc: formFields.dueDate,
            actionByPersonOid: `${chosenPerson.id}`,
        };
        setSubmitPunchStatus(AsyncStatus.LOADING);
        try {
            await completionApi.postNewPunch(params.plant, NewPunchDTO);
            setSubmitPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            const pcsError = error as Error;
            setSnackbarText(pcsError.toString());
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
