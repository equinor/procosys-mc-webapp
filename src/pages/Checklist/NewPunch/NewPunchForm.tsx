import {
    Button,
    Label,
    NativeSelect,
    TextField,
} from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import { AsyncStatus } from '../../../contexts/McAppContext';
import {
    PunchCategory,
    PunchOrganization,
    PunchPriority,
    PunchSort,
    PunchType,
} from '../../../services/apiTypes';
import { COLORS } from '../../../style/GlobalStyles';
import { ChosenPerson, PunchFormData } from './NewPunch';
import PersonsSearch from './PersonsSearch/PersonsSearch';

export const NewPunchFormWrapper = styled.form`
    background-color: ${COLORS.white};
    padding: 0 4% 66px 4%;
    overflow: hidden;
    & > button,
    button:disabled {
        float: right;
        margin: 16px 0;
    }
    & > div {
        margin-top: 16px;
    }
`;

const DateField = styled.div`
    & > input {
        box-sizing: border-box;
        width: 100%;
        min-width: 95%;
        background-color: ${COLORS.greyBackground};
        height: 40px;
        border: none;
        box-shadow: inset 0 -1px 0 0 var(--eds_text__static_ic, rgba(111, 111, 111, 1)); // TODO: fix(?)
        font-family: Equinor;
        padding: 0 8px;
    }
    & > input:focus-visible {
        outline: 2px solid ${COLORS.mossGreen};
        box-shadow: none;
    }
`;

type NewPunchFormProps = {
    categories: PunchCategory[];
    organizations: PunchOrganization[];
    types: PunchType[];
    sorts: PunchSort[];
    priorities: PunchPriority[];
    chosenPerson: ChosenPerson;
    setChosenPerson: React.Dispatch<React.SetStateAction<ChosenPerson>>;
    formData: PunchFormData;
    buttonText: string;
    createChangeHandler: (
        key:
            | 'category'
            | 'description'
            | 'raisedBy'
            | 'clearingBy'
            | 'actionByPerson'
            | 'dueDate'
            | 'type'
            | 'sorting'
            | 'priority'
            | 'estimate'
    ) => (
        e: React.ChangeEvent<
            HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
        >
    ) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    submitPunchStatus: AsyncStatus;
    children: JSX.Element;
};

const NewPunchForm = ({
    categories,
    organizations,
    types,
    sorts,
    priorities,
    chosenPerson,
    setChosenPerson,
    formData,
    buttonText,
    createChangeHandler,
    handleSubmit,
    submitPunchStatus,
    children,
}: NewPunchFormProps): JSX.Element => {
    const [showPersonsSearch, setShowPersonsSearch] = useState(false);

    const handlePersonChosen = (id: number, name: string): void => {
        setChosenPerson({ id, name });
        setShowPersonsSearch(false);
    };

    return (
        <>
            {showPersonsSearch ? (
                <PersonsSearch
                    setChosenPerson={handlePersonChosen}
                    setShowPersonSearch={setShowPersonsSearch}
                />
            ) : null}
            <NewPunchFormWrapper onSubmit={handleSubmit}>
                <NativeSelect
                    required
                    id="PunchCategorySelect"
                    label="Punch category *"
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                    onChange={createChangeHandler('category')}
                    defaultValue={''}
                >
                    <option hidden disabled value={''} />
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
                    value={formData.description}
                    onChange={createChangeHandler('description')}
                    label="Description *"
                    multiline
                    rows={5}
                    id="NewPunchDescription"
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                />
                <NativeSelect
                    required
                    label="Raised by *"
                    id="RaisedBySelect"
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                    onChange={createChangeHandler('raisedBy')}
                    defaultValue={''}
                >
                    <option hidden disabled value={''} />
                    {organizations.map((organization) => (
                        <option key={organization.id} value={organization.id}>
                            {organization.description}
                        </option>
                    ))}
                </NativeSelect>
                <NativeSelect
                    required
                    id="ClearingBySelect"
                    label="Clearing by *"
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                    onChange={createChangeHandler('clearingBy')}
                    defaultValue={''}
                >
                    <option hidden disabled value={''} />
                    {organizations.map((organization) => (
                        <option key={organization.id} value={organization.id}>
                            {organization.description}
                        </option>
                    ))}
                </NativeSelect>
                <h5>Optional fields</h5>
                <TextField
                    id="actionByPerson"
                    value={chosenPerson.name}
                    readOnly
                    inputIcon={
                        chosenPerson.id ? (
                            <div
                                onClick={(): void =>
                                    setChosenPerson({ id: null, name: '' })
                                }
                            >
                                <EdsIcon name={'close'} color={COLORS.black} />
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
                        id="dueDate"
                        role="datepicker"
                        onChange={createChangeHandler('dueDate')}
                    />
                </DateField>
                <NativeSelect
                    id="PunchTypeSelect"
                    label="Type"
                    disabled={
                        submitPunchStatus === AsyncStatus.LOADING ||
                        types.length < 1
                    }
                    onChange={createChangeHandler('type')}
                    defaultValue={''}
                >
                    <option hidden disabled value={''} />
                    {types.map((type) => (
                        <option
                            key={type.id}
                            value={type.id}
                        >{`${type.code}. ${type.description}`}</option>
                    ))}
                </NativeSelect>
                <NativeSelect
                    id="PunchSortingSelect"
                    label="Sorting"
                    disabled={
                        submitPunchStatus === AsyncStatus.LOADING ||
                        sorts.length < 1
                    }
                    onChange={createChangeHandler('sorting')}
                    defaultValue={''}
                >
                    <option hidden disabled value={''} />
                    {sorts.map((sort) => (
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
                        submitPunchStatus === AsyncStatus.LOADING ||
                        priorities.length < 1
                    }
                    onChange={createChangeHandler('priority')}
                    defaultValue={''}
                >
                    <option hidden disabled value={''} />
                    {priorities.map((priority) => (
                        <option
                            key={priority.id}
                            value={priority.id}
                        >{`${priority.code}. ${priority.description}`}</option>
                    ))}
                </NativeSelect>
                <TextField
                    type="number"
                    label="Estimate"
                    id="estimate"
                    value={formData.estimate}
                    onChange={createChangeHandler('estimate')}
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                />
                {children}
                <Button
                    type="submit"
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                >
                    {buttonText}
                </Button>
            </NewPunchFormWrapper>
        </>
    );
};

export default NewPunchForm;
