import {
    Button,
    Label,
    NativeSelect,
    TextField,
} from '@equinor/eds-core-react';
import React from 'react';
import ErrorPage from '../../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import Navbar from '../../../components/navigation/Navbar';
import { AsyncStatus } from '../../../contexts/McAppContext';
import PunchDetailsCard from './PunchDetailsCard';
import {
    DateField,
    NewPunchFormWrapper,
} from '../../Checklist/NewPunch/NewPunchForm';
import useClearPunchFacade, {
    UpdatePunchEndpoint,
} from './useClearPunchFacade';
import styled from 'styled-components';
import AsyncCard from '../../../components/AsyncCard';
import useCommonHooks from '../../../utils/useCommonHooks';
import EdsIcon from '../../../components/icons/EdsIcon';
import { CancelToken } from 'axios';
import ensure from '../../../utils/ensure';
import removeSubdirectories from '../../../utils/removeSubdirectories';
import { PunchItem } from '../../../services/apiTypes';

export const PunchWrapper = styled.main``;

type ClearPunchProps = {
    punchItem: PunchItem;
    setPunchItem: React.Dispatch<React.SetStateAction<PunchItem>>;
    fetchPunchItemStatus: AsyncStatus;
};

const ClearPunch = ({
    punchItem,
    setPunchItem,
    fetchPunchItemStatus,
}: ClearPunchProps): JSX.Element => {
    const {
        updatePunchStatus,
        clearPunchStatus,
        categories,
        types,
        organizations,
        sorts,
        priorities,
        fetchOptionsStatus,
        snackbar,
        setSnackbarText,
        updateDatabase,
        clearPunchItem,
        handleCategoryChange,
        handleDescriptionChange,
        handleTypeChange,
        handleRaisedByChange,
        handleClearingByChange,
        handleDueDateChange,
        handleSortingChange,
        handlePriorityChange,
        handleEstimateChange,
    } = useClearPunchFacade(setPunchItem);
    const { api, params, url } = useCommonHooks();

    let descriptionBeforeEntering = '';
    let estimateBeforeEntering: number | undefined = 0;

    const content = (): JSX.Element => {
        if (
            fetchPunchItemStatus === AsyncStatus.SUCCESS &&
            punchItem &&
            fetchOptionsStatus === AsyncStatus.SUCCESS
        ) {
            return (
                <>
                    <NewPunchFormWrapper onSubmit={clearPunchItem}>
                        <NativeSelect
                            required
                            id="PunchCategorySelect"
                            label="Punch category"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            defaultValue={
                                ensure(
                                    categories.find(
                                        (category) =>
                                            category.code === punchItem.status
                                    )
                                ).id
                            }
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >{`${category.description}`}</option>
                            ))}
                        </NativeSelect>
                        <TextField
                            required
                            maxLength={255}
                            value={punchItem.description}
                            label="Description"
                            multiline
                            rows={5}
                            id="NewPunchDescription"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            onFocus={(): string =>
                                (descriptionBeforeEntering =
                                    punchItem.description)
                            }
                            onBlur={(): void => {
                                if (
                                    punchItem.description !==
                                    descriptionBeforeEntering
                                ) {
                                    updateDatabase(
                                        UpdatePunchEndpoint.Description,
                                        {
                                            Description: punchItem.description,
                                        }
                                    );
                                }
                            }}
                            onChange={handleDescriptionChange}
                        />
                        <NativeSelect
                            required
                            label="Raised by"
                            id="RaisedBySelect"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            defaultValue={
                                ensure(
                                    organizations.find(
                                        (org) =>
                                            org.code === punchItem.raisedByCode
                                    )
                                ).id
                            }
                            onChange={handleRaisedByChange}
                        >
                            {organizations.map((organization) => (
                                <option
                                    key={organization.id}
                                    value={organization.id}
                                >
                                    {organization.description}
                                </option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            required
                            id="ClearingBySelect"
                            label="Clearing by"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            defaultValue={
                                ensure(
                                    organizations.find(
                                        (org) =>
                                            org.code ===
                                            punchItem.clearingByCode
                                    )
                                ).id
                            }
                            onChange={handleClearingByChange}
                        >
                            {organizations.map((organization) => (
                                <option
                                    key={organization.id}
                                    value={organization.id}
                                >
                                    {organization.description}
                                </option>
                            ))}
                        </NativeSelect>
                        <h5>Optional fields</h5>
                        {
                            // TODO: action by person field
                        }
                        <DateField>
                            <Label label="Due Date" htmlFor="dueDate2" />
                            <input
                                type="date"
                                id="dueDate"
                                role="datepicker"
                                value={punchItem.dueDate?.split('T')[0]}
                                onChange={handleDueDateChange}
                                onBlur={(): void => {
                                    updateDatabase(
                                        UpdatePunchEndpoint.DueDate,
                                        {
                                            DueDate: punchItem.dueDate,
                                        }
                                    );
                                }}
                            />
                        </DateField>
                        <NativeSelect
                            id="PunchTypeSelect"
                            label="Type"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                types.length < 1
                            }
                            defaultValue={
                                types.find(
                                    (type) => type.code === punchItem.typeCode
                                )?.id
                            }
                            onChange={handleTypeChange}
                        >
                            {types?.map((type) => (
                                <option
                                    key={type.id}
                                    value={type.id}
                                >{`${type.code}. ${type.description}`}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            id="PunchSortSelect"
                            label="Sorting"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                sorts.length < 1
                            }
                            defaultValue={
                                sorts.find(
                                    (sort) => sort.code === punchItem.sorting
                                )?.id
                            }
                            onChange={handleSortingChange}
                        >
                            {sorts?.map((sort) => (
                                <option
                                    key={sort.id}
                                    value={sort.id}
                                >{`${sort.code}. ${sort.description}`}</option>
                            ))}
                        </NativeSelect>
                        <NativeSelect
                            id="PunchPrioritySelect"
                            label="Priority"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                priorities.length < 1
                            }
                            defaultValue={
                                priorities.find(
                                    (priority) =>
                                        priority.code === punchItem.priorityCode
                                )?.id
                            }
                            onChange={handlePriorityChange}
                        >
                            {priorities?.map((priority) => (
                                <option
                                    key={priority.id}
                                    value={priority.id}
                                >{`${priority.code}. ${priority.description}`}</option>
                            ))}
                        </NativeSelect>
                        <TextField
                            type="number"
                            defaultValue={punchItem.estimate}
                            label="Estimate"
                            id="Estimate"
                            disabled={clearPunchStatus === AsyncStatus.LOADING}
                            onFocus={(): number | undefined =>
                                (estimateBeforeEntering = punchItem.estimate)
                            }
                            onBlur={(): void => {
                                if (
                                    punchItem.estimate !==
                                    estimateBeforeEntering
                                ) {
                                    updateDatabase(
                                        UpdatePunchEndpoint.Estimate,
                                        {
                                            Estimate: punchItem.estimate,
                                        }
                                    );
                                }
                            }}
                            onChange={handleEstimateChange}
                        />
                        {
                            // TODO: add attachments
                        }
                        <Button
                            type="submit"
                            disabled={
                                updatePunchStatus === AsyncStatus.LOADING ||
                                clearPunchStatus === AsyncStatus.LOADING
                            }
                        >
                            Clear
                        </Button>
                    </NewPunchFormWrapper>
                </>
            );
        } else if (
            fetchPunchItemStatus === AsyncStatus.ERROR ||
            fetchOptionsStatus === AsyncStatus.ERROR
        ) {
            return (
                <ErrorPage
                    title="Unable to load punch item."
                    description="Please check your connection, reload this page or try again later."
                />
            );
        } else {
            return <SkeletonLoadingPage text="Loading punch item" />;
        }
    };

    return (
        <>
            <PunchWrapper>{content()}</PunchWrapper>
            {snackbar}
        </>
    );
};

// TODO: check whether clear punch has wildly different permissions than verify osv. if yes: add permissions here, if no: just add them to the existing ones in punch page
export default ClearPunch;
