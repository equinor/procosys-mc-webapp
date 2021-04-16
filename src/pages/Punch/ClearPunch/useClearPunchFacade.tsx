import React, { useEffect, useState } from 'react';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import {
    PunchCategory,
    PunchType,
    PunchOrganization,
    PunchItem,
} from '../../../services/apiTypes';
import ensure from '../../../utils/ensure';
import removeSubdirectories from '../../../utils/removeSubdirectories';
import useCommonHooks from '../../../utils/useCommonHooks';
import useSnackbar from '../../../utils/useSnackbar';

export enum UpdatePunchEndpoint {
    Description = 'SetDescription',
    Category = 'SetCategory',
    Type = 'SetType',
    RaisedBy = 'SetRaisedBy',
    ClearingBy = 'SetClearingBy',
}

export enum PunchAction {
    CLEAR = 'Clear',
    UNCLEAR = 'Unclear',
    REJECT = 'Reject',
    VERIFY = 'Verify',
    UNVERIFY = 'Unverify',
}

export type UpdatePunchData =
    | { RaisedByOrganizationId: number }
    | { CategoryId: number }
    | { TypeId: number }
    | { ClearingByOrganizationId: number }
    | { Description: string };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useClearPunchFacade = () => {
    const { api, params, url, history } = useCommonHooks();
    const { snackbar, setSnackbarText } = useSnackbar();
    const [punchItem, setPunchItem] = useState<PunchItem>({} as PunchItem);
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [fetchPunchItemStatus, setFetchPunchItemStatus] = useState(
        AsyncStatus.LOADING
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
        updateDatabase(UpdatePunchEndpoint.RaisedBy, {
            ClearingByOrganizationId: parseInt(e.target.value),
        });
    };

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
            history.push(`${removeSubdirectories(url, 1)}/verify`);
        } catch (error) {
            setClearPunchStatus(AsyncStatus.ERROR);
        }
    };

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const [
                    categoriesFromApi,
                    typesFromApi,
                    organizationsFromApi,
                    punchItemFromApi,
                ] = await Promise.all([
                    api.getPunchCategories(params.plant),
                    api.getPunchTypes(params.plant),
                    api.getPunchOrganizations(params.plant),
                    api.getPunchItem(params.plant, params.punchItemId),
                ]);
                setCategories(categoriesFromApi);
                setTypes(typesFromApi);
                setOrganizations(organizationsFromApi);
                setPunchItem(punchItemFromApi);
                setFetchPunchItemStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchPunchItemStatus(AsyncStatus.ERROR);
            }
        })();
    }, [params.plant, api, params.punchItemId]);

    return {
        updatePunchStatus,
        fetchPunchItemStatus,
        punchItem,
        clearPunchStatus,
        categories,
        types,
        organizations,
        setSnackbarText,
        snackbar,
        updateDatabase,
        clearPunchItem,
        handleCategoryChange,
        handleTypeChange,
        handleRaisedByChange,
        handleClearingByChange,
        handleDescriptionChange,
    };
};

export default useClearPunchFacade;
