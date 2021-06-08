import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    PunchCategory,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
} from '../../../services/apiTypes';
import { AsyncStatus } from '../../../contexts/McAppContext';
import NewPunchForm from './NewPunchForm';
import useFormFields from '../../../utils/useFormFields';
import { NewPunch as NewPunchType } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import { PunchWrapper } from '../../Punch/ClearPunch/ClearPunch';
import useSnackbar from '../../../utils/useSnackbar';
import AsyncPage from '../../../components/AsyncPage';
import { TempAttachments } from '@equinor/procosys-webapp-components';
import removeSubdirectories from '../../../utils/removeSubdirectories';
import styled from 'styled-components';
import { COLORS } from '../../../style/GlobalStyles';

const AttachmentsWrapper = styled.div`
    margin: 0 -4%;
    background-color: ${COLORS.fadedBlue};
`;

export type ChosenPerson = {
    id: number | null;
    name: string;
};

export type PunchFormData = {
    category: string;
    description: string;
    raisedBy: string;
    clearingBy: string;
    dueDate: string;
    type: string;
    sorting: string;
    priority: string;
    estimate: string;
};

export type TempAttachment = { id: string; file: File };

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

const NewPunch = (): JSX.Element => {
    const { api, params, url, history } = useCommonHooks();
    const { formFields, createChangeHandler } = useFormFields(
        newPunchInitialValues
    );
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [sorts, setSorts] = useState<PunchSort[]>([]);
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
            setSubmitPunchStatus(AsyncStatus.ERROR);
        }
    };

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
                setSorts(sortsFromApi);
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

    const content = (): JSX.Element => {
        return (
            <NewPunchForm
                categories={categories}
                organizations={organizations}
                types={types}
                sorts={sorts}
                priorities={priorities}
                chosenPerson={chosenPerson}
                setChosenPerson={setChosenPerson}
                formData={formFields}
                buttonText={'Create punch'}
                createChangeHandler={createChangeHandler}
                handleSubmit={handleSubmit}
                submitPunchStatus={submitPunchStatus}
            >
                <>
                    <h5>Attachments</h5>
                    <AttachmentsWrapper>
                        <TempAttachments
                            setSnackbarText={setSnackbarText}
                            setTempAttachmentIds={setTempIds}
                            postTempAttachment={(
                                formData: FormData,
                                title: string
                            ): Promise<string> =>
                                api.postTempPunchAttachment({
                                    data: formData,
                                    plantId: params.plant,
                                    parentId: params.checklistId,
                                    title: title,
                                })
                            }
                        />
                    </AttachmentsWrapper>
                </>
            </NewPunchForm>
        );
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
                <PunchWrapper>{content()}</PunchWrapper>
            </AsyncPage>
            {snackbar}
        </>
    );
};

export default NewPunch;
