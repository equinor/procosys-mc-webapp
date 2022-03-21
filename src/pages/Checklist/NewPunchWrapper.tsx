import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    PunchCategory,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
} from '../../services/apiTypes';
import { AsyncStatus } from '../../contexts/McAppContext';
import useFormFields from '../../utils/useFormFields';
import { NewPunch as NewPunchType } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import useSnackbar from '../../utils/useSnackbar';
import AsyncPage from '../../components/AsyncPage';
import { ChosenPerson, NewPunch } from '@equinor/procosys-webapp-components';
import removeSubdirectories from '../../utils/removeSubdirectories';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';

// TODO: remove once all punch pages are moved
export const AttachmentsWrapper = styled.div`
    margin: 0 -4% 16px -4%;
    padding: 16px 4%;
    background-color: ${COLORS.fadedBlue};
    height: 100px;
`;

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
    const { api, params, url, history } = useCommonHooks();
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
    const { snackbar, setSnackbarText } = useSnackbar();
    const [tempIds, setTempIds] = useState<string[]>([]);

    useEffect(() => {
        const source = Axios.CancelToken.source();
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
                setFetchNewPunchStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchNewPunchStatus(AsyncStatus.ERROR);
            }
        })();
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
                    getPersonsByName={api.getPersonsByName}
                    chosenPerson={chosenPerson}
                    setChosenPerson={setChosenPerson}
                    fetchNewPunchStatus={fetchNewPunchStatus}
                    setTempIds={setTempIds}
                    postTempAttachment={api.postTempPunchAttachment}
                />
            </AsyncPage>
            {snackbar}
        </>
    );
};

export default NewPunchWrapper;
