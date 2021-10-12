import {
    Button,
    Label,
    NativeSelect,
    TextField,
} from '@equinor/eds-core-react';
import React from 'react';
import { AsyncStatus } from '../../../contexts/McAppContext';
import {
    DateField,
    FormButtonWrapper,
    NewPunchFormWrapper,
} from '../../Checklist/NewPunch/NewPunchForm';
import useClearPunchFacade, {
    UpdatePunchEndpoint,
} from './useClearPunchFacade';
import styled from 'styled-components';
import useCommonHooks from '../../../utils/useCommonHooks';
import EdsIcon from '../../../components/icons/EdsIcon';
import { CancelToken } from 'axios';
import ensure from '../../../utils/ensure';
import { Attachment, PunchItem } from '../../../services/apiTypes';
import PersonsSearch from '../../../components/PersonsSearch/PersonsSearch';
import { COLORS } from '../../../style/GlobalStyles';
import {
    Attachments,
    ErrorPage,
    ReloadButton,
    SkeletonLoadingPage,
} from '@equinor/procosys-webapp-components';
import { AttachmentsWrapper } from '../../Checklist/NewPunch/NewPunch';

export const PunchWrapper = styled.main``;

type ClearPunchProps = {
    punchItem: PunchItem;
    setPunchItem: React.Dispatch<React.SetStateAction<PunchItem>>;
    canEdit: boolean;
    canClear: boolean;
};

const ClearPunch = ({
    punchItem,
    setPunchItem,
    canEdit,
    canClear,
}: ClearPunchProps): JSX.Element => {
    const {
        updatePunchStatus,
        clearPunchStatus,
        categories,
        types,
        organizations,
        sortings,
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
        handleActionByPersonChange,
        handleDueDateChange,
        handleSortingChange,
        handlePriorityChange,
        handleEstimateChange,
        showPersonsSearch,
        setShowPersonsSearch,
    } = useClearPunchFacade(setPunchItem);
    const { api, params } = useCommonHooks();

    let descriptionBeforeEntering = '';
    let estimateBeforeEntering: number | null = 0;

    const content = (): JSX.Element => {
        if (fetchOptionsStatus === AsyncStatus.SUCCESS) {
            return (
                <>
                    {showPersonsSearch ? (
                        <PersonsSearch
                            setChosenPerson={handleActionByPersonChange}
                            setShowPersonSearch={setShowPersonsSearch}
                        />
                    ) : null}
                    <NewPunchFormWrapper onSubmit={clearPunchItem}>
                        <NativeSelect
                            required
                            id="PunchCategorySelect"
                            label="Punch category"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
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
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
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
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
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
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
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
                        <TextField
                            id="actionByPerson"
                            defaultValue={
                                punchItem.actionByPerson
                                    ? `${punchItem.actionByPersonFirstName} ${punchItem.actionByPersonLastName}`
                                    : ''
                            }
                            readOnly
                            disabled={canEdit === false}
                            inputIcon={
                                punchItem.actionByPerson && canEdit ? (
                                    <div
                                        onClick={(): void =>
                                            handleActionByPersonChange(
                                                null,
                                                '',
                                                ''
                                            )
                                        }
                                    >
                                        <EdsIcon
                                            name={'close'}
                                            color={COLORS.black}
                                        />
                                    </div>
                                ) : null
                            }
                            onClick={(): void => setShowPersonsSearch(true)}
                            label={'Action by person'}
                        />
                        <DateField>
                            <Label label="Due Date" htmlFor="dueDate2" />
                            <input
                                type="date"
                                id="DueDatePicker"
                                role="datepicker"
                                disabled={
                                    clearPunchStatus === AsyncStatus.LOADING ||
                                    canEdit === false
                                }
                                value={
                                    punchItem.dueDate
                                        ? punchItem.dueDate.split('T')[0]
                                        : ''
                                }
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
                                types.length < 1 ||
                                canEdit === false
                            }
                            defaultValue={
                                punchItem.typeCode
                                    ? types.find(
                                          (type) =>
                                              type.code === punchItem.typeCode
                                      )?.id
                                    : ''
                            }
                            onChange={handleTypeChange}
                        >
                            <option hidden disabled value={''} />
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
                                sortings.length < 1 ||
                                canEdit === false
                            }
                            defaultValue={
                                punchItem.sorting
                                    ? sortings.find(
                                          (sort) =>
                                              sort.code === punchItem.sorting
                                      )?.id
                                    : ''
                            }
                            onChange={handleSortingChange}
                        >
                            <option hidden disabled value={''} />
                            {sortings?.map((sort) => (
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
                                priorities.length < 1 ||
                                canEdit === false
                            }
                            defaultValue={
                                punchItem.priorityCode
                                    ? priorities.find(
                                          (priority) =>
                                              priority.code ===
                                              punchItem.priorityCode
                                      )?.id
                                    : ''
                            }
                            onChange={handlePriorityChange}
                        >
                            <option hidden disabled value={''} />
                            {priorities?.map((priority) => (
                                <option
                                    key={priority.id}
                                    value={priority.id}
                                >{`${priority.code}. ${priority.description}`}</option>
                            ))}
                        </NativeSelect>
                        <TextField
                            type="number"
                            defaultValue={
                                punchItem.estimate ? punchItem.estimate : ''
                            }
                            label="Estimate"
                            id="Estimate"
                            disabled={
                                clearPunchStatus === AsyncStatus.LOADING ||
                                canEdit === false
                            }
                            onFocus={(): number | null =>
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
                        <h5>Attachments</h5>
                        <AttachmentsWrapper>
                            <Attachments
                                getAttachments={(
                                    cancelToken: CancelToken
                                ): Promise<Attachment[]> =>
                                    api.getPunchAttachments(
                                        params.plant,
                                        params.punchItemId,
                                        cancelToken
                                    )
                                }
                                getAttachment={(
                                    cancelToken: CancelToken,
                                    attachmentId: number
                                ): Promise<Blob> =>
                                    api.getPunchAttachment(
                                        cancelToken,
                                        params.plant,
                                        params.punchItemId,
                                        attachmentId
                                    )
                                }
                                postAttachment={(
                                    file: FormData,
                                    title: string
                                ): Promise<void> =>
                                    api.postPunchAttachment(
                                        params.plant,
                                        punchItem.id,
                                        file,
                                        title
                                    )
                                }
                                deleteAttachment={(
                                    attachmentId: number
                                ): Promise<void> =>
                                    api.deletePunchAttachment(
                                        params.plant,
                                        params.punchItemId,
                                        attachmentId
                                    )
                                }
                                setSnackbarText={setSnackbarText}
                                readOnly={canEdit === false}
                            />
                        </AttachmentsWrapper>
                        <FormButtonWrapper>
                            <Button
                                type="submit"
                                disabled={
                                    updatePunchStatus === AsyncStatus.LOADING ||
                                    clearPunchStatus === AsyncStatus.LOADING ||
                                    canClear === false
                                }
                            >
                                Clear
                            </Button>
                        </FormButtonWrapper>
                    </NewPunchFormWrapper>
                </>
            );
        } else if (fetchOptionsStatus === AsyncStatus.ERROR) {
            return (
                <ErrorPage
                    title="Unable to load punch item."
                    description="Please check your connection, reload this page or try again later."
                    actions={[<ReloadButton key={'reload'} />]}
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

export default ClearPunch;
