import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ChecklistPreview, PunchCategory } from '../../services/apiTypes';
import { NewPunch as NewPunchType } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import {
    AsyncStatus,
    ChosenPerson,
    NewPunch,
    isArrayOfType,
    useFormFields,
    useSnackbar,
} from '@equinor/procosys-webapp-components';
import AsyncPage from '../../components/AsyncPage';
import usePersonsSearchFacade from '../../utils/usePersonsSearchFacade';
import { OfflineStatus } from '../../typings/enums';
import { LibrayTypes } from '../../services/apiTypesCompletionApi';
import Axios, { AxiosError } from 'axios';
import PlantContext from '../../contexts/PlantContext';
import { hasErrors, renderErrors } from '../../utils/renderErrors';

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

const NewPunchWrapper = (): JSX.Element => {
    const { api, params, url, history, offlineState, completionApi } =
        useCommonHooks();
    const { availableProjects } = useContext(PlantContext);
    const currentProject = availableProjects?.find(
        (p) => p.title === params.project
    );
    let checkListGuid = location.search.split('checkListGuid=').at(1);

    const { formFields, createChangeHandler } = useFormFields(
        newPunchInitialValues
    );
    const { snackbar, setSnackbarText } = useSnackbar();
    const controller = new AbortController();
    const abortSignal = controller.signal;
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<LibrayTypes[]>([]);
    const [organizations, setOrganizations] = useState<LibrayTypes[]>([]);
    const [sortings, setSortings] = useState<LibrayTypes[]>([]);
    const [priorities, setPriorities] = useState<LibrayTypes[]>([]);
    const [chosenPerson, setChosenPerson] = useState<ChosenPerson>({
        id: '',
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
    const [details, setDetails] = useState<any>();

    const getLibraryTypes = useCallback(async () => {
        const categoriesFromApi = [
            { id: 0, code: 'PA', description: 'PA' },
            { id: 1, code: 'PB', description: 'PB' },
        ];

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
            setPriorities(types.get('COMM_PRIORITY'));
        }
        if (isArrayOfType<PunchCategory>(categoriesFromApi, 'id')) {
            setCategories(categoriesFromApi);
        }
        setFetchNewPunchStatus(AsyncStatus.SUCCESS);
    }, [params.plant]);

    useEffect(() => {
        getLibraryTypes();
    }, [params.plant, api]);

    const removeNewPunchSegment = (url: string) => {
        const [baseUrl, query] = url.split('?');
        const segments = baseUrl
            .split('/')
            .filter((segment) => segment !== 'new-punch');
        const newUrl = segments.join('/');
        return query ? `${newUrl}?${query}` : newUrl;
    };

    useEffect(() => {
        if (submitPunchStatus === AsyncStatus.SUCCESS) {
            const newUrl = removeNewPunchSegment(url);
            history.push(`${newUrl}?checkListGuid=${checkListGuid}`);
        }
    }, [submitPunchStatus, url, checkListGuid, history]);

    // if user routes to new punch page directly without choosing a checklist
    useEffect(() => {
        const fetchDetails = async () => {
            if (
                !checkListGuid ||
                checkListGuid === 'undefined' ||
                checkListGuid === 'null'
            ) {
                const response = (await api.getScope(
                    params.plant,
                    params.searchType,
                    params.entityId,
                    details,
                    abortSignal
                )) as ChecklistPreview[];
                if (response.length > 0) {
                    checkListGuid = response[0].proCoSysGuid;
                }
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set(
                    'checkListGuid',
                    checkListGuid as string
                );
                window.history.pushState({}, '', newUrl.toString());
            }
        };
        fetchDetails();
    }, [checkListGuid]);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!currentProject || !checkListGuid) return;
        const NewPunchDTO: NewPunchType = {
            checkListGuid,
            projectGuid: currentProject.proCoSysGuid,
            category: formFields.category,
            description: formFields.description,
            typeGuid: formFields.type,
            raisedByOrgGuid: formFields.raisedBy,
            clearingByOrgGuid: formFields.clearingBy,
            sortingGuid: formFields.sorting,
            priorityGuid: formFields.priority,
            estimate: parseInt(formFields.estimate),
            dueTimeUtc: formFields.dueDate
                ? ` ${new Date(formFields.dueDate).toISOString()}`
                : '',
            actionByPersonOid: chosenPerson.id ? `${chosenPerson.id}` : '',
        };
        setSubmitPunchStatus(AsyncStatus.LOADING);
        await completionApi
            .postNewPunch(params.plant, NewPunchDTO)
            .then(() => {
                setSnackbarText('Punch created successfully');
                setSubmitPunchStatus(AsyncStatus.SUCCESS);
            })
            .catch((error: AxiosError) => {
                setSnackbarText(
                    hasErrors(error)
                        ? renderErrors(error)
                        : 'Something went wrong while creating punch'
                );
            });
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
            {snackbar}
        </>
    );
};

export default NewPunchWrapper;
