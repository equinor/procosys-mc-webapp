import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { AsyncStatus } from '../../../contexts/McAppContext';
import {
    PunchCategory,
    PunchType,
    PunchOrganization,
    PunchItem,
    PunchSort,
    PunchPriority,
} from '../../../services/apiTypes';
import ensure from '../../../utils/ensure';
import useCommonHooks from '../../../utils/useCommonHooks';
import useSnackbar from '../../../utils/useSnackbar';

export enum UpdatePunchEndpoint {
    Category = 'SetCategory',
    Description = 'SetDescription',
    RaisedBy = 'SetRaisedBy',
    ClearingBy = 'SetClearingBy',
    ActionByPerson = 'SetActionByPerson',
    DueDate = 'setDueDate',
    Type = 'SetType',
    Sorting = 'SetSorting',
    Priority = 'SetPriority',
    Estimate = 'setEstimate',
}

export enum PunchAction {
    CLEAR = 'Clear',
    UNCLEAR = 'Unclear',
    REJECT = 'Reject',
    VERIFY = 'Verify',
    UNVERIFY = 'Unverify',
}

export type UpdatePunchData =
    | { CategoryId: number }
    | { Description: string }
    | { RaisedByOrganizationId: number }
    | { ClearingByOrganizationId: number }
    | { PersonId: number | null }
    | { DueDate: string | null }
    | { TypeId: number }
    | { SortingId: number }
    | { PriorityId: number }
    | { Estimate: number | null };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useClearPunchFacade = (
    setPunchItem: React.Dispatch<React.SetStateAction<PunchItem>>
) => {
    const { api, params, url, history } = useCommonHooks();
    const { snackbar, setSnackbarText } = useSnackbar();
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [sortings, setSortings] = useState<PunchSort[]>([]);
    const [priorities, setPriorities] = useState<PunchPriority[]>([]);
    const [showPersonsSearch, setShowPersonsSearch] = useState(false);
    const [fetchOptionsStatus, setFetchOptionsStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [updatePunchStatus, setUpdatePunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [clearPunchStatus, setClearPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );

    const updateDatabase = async (
        endpoint: UpdatePunchEndpoint,
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
            setUpdatePunchStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            status: ensure(
                categories.find(
                    (category) => category.id === parseInt(e.target.value)
                )
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.Category, {
            CategoryId: parseInt(e.target.value),
        });
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void =>
        setPunchItem((prev) => ({
            ...prev,
            description: e.target.value,
        }));

    const handleRaisedByChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            raisedByCode: ensure(
                organizations.find((org) => org.id === parseInt(e.target.value))
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.RaisedBy, {
            RaisedByOrganizationId: parseInt(e.target.value),
        });
    };

    const handleClearingByChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            clearingByCode: ensure(
                organizations.find((org) => org.id === parseInt(e.target.value))
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.ClearingBy, {
            ClearingByOrganizationId: parseInt(e.target.value),
        });
    };

    const handleActionByPersonChange = (
        id: number | null,
        firstName: string,
        lastName: string
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            actionByPerson: id,
            actionByPersonFirstName: firstName,
            actionByPersonLastName: lastName,
        }));
        updateDatabase(UpdatePunchEndpoint.ActionByPerson, {
            PersonId: id,
        });
        setShowPersonsSearch(false);
    };

    const handleDueDateChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void =>
        setPunchItem((prev) => ({
            ...prev,
            dueDate: e.target.value,
        }));

    const handleTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            typeCode: ensure(
                types.find((type) => type.id === parseInt(e.target.value))
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.Type, {
            TypeId: parseInt(e.target.value),
        });
    };

    const handleSortingChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            sorting: ensure(
                sortings.find((sort) => sort.id === parseInt(e.target.value))
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.Sorting, {
            SortingId: parseInt(e.target.value),
        });
    };

    const handlePriorityChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setPunchItem((prev) => ({
            ...prev,
            priorityCode: ensure(
                priorities.find(
                    (priority) => priority.id === parseInt(e.target.value)
                )
            ).code,
        }));
        updateDatabase(UpdatePunchEndpoint.Priority, {
            PriorityId: parseInt(e.target.value),
        });
    };

    const handleEstimateChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void =>
        setPunchItem((prev) => ({
            ...prev,
            estimate: parseInt(e.target.value),
        }));

    const clearPunchItem = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setClearPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postPunchAction(
                params.plant,
                params.punchItemId,
                PunchAction.CLEAR
            );
            setClearPunchStatus(AsyncStatus.SUCCESS);
            history.push(url);
        } catch (error) {
            setClearPunchStatus(AsyncStatus.ERROR);
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

    return {
        updatePunchStatus,
        clearPunchStatus,
        categories,
        types,
        organizations,
        sortings,
        priorities,
        fetchOptionsStatus,
        setSnackbarText,
        snackbar,
        updateDatabase,
        clearPunchItem,
        handleCategoryChange,
        handleTypeChange,
        handleRaisedByChange,
        handleClearingByChange,
        handleDescriptionChange,
        handleActionByPersonChange,
        handleDueDateChange,
        handleSortingChange,
        handlePriorityChange,
        handleEstimateChange,
        showPersonsSearch,
        setShowPersonsSearch,
    };
};

export default useClearPunchFacade;
