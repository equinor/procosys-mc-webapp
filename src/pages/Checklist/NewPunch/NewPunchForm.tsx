import {
    Button,
    Input,
    Label,
    NativeSelect,
    Search,
    TextField,
} from '@equinor/eds-core-react';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { CardWrapper } from '../../../components/EdsCard';
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
import removeSubdirectories from '../../../utils/removeSubdirectories';
import useCommonHooks from '../../../utils/useCommonHooks';
import { ChosenPerson, PunchFormData } from './NewPunch';
import PersonsSearch from './PersonsSearch/PersonsSearch';

// TODO: check whether I need to change this into something else
export const NewPunchFormWrapper = styled.form`
    background-color: ${COLORS.white};
    margin-top: 32px; // TODO: is this the correct amount?
    padding: 0 4%;
    margin-bottom: 85px; // TODO: change into the same as the height of the footer (+ a bit extra?)
    overflow: hidden;
    & ${CardWrapper}:first-of-type {
        margin-top: 16px;
    }
    & > button,
    button:disabled {
        float: right;
        margin: 16px 0;
    }
    & > div {
        margin-top: 16px;
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
    const { url, history } = useCommonHooks();

    const handlePersonChosen = (id: number, name: string): void => {
        setChosenPerson({ id, name });
        setShowPersonsSearch(false);
    };

    return (
        <>
            {showPersonsSearch ? (
                <PersonsSearch setChosenPerson={handlePersonChosen} />
            ) : null}
            <NewPunchFormWrapper onSubmit={handleSubmit}>
                <NativeSelect
                    required
                    id="PunchCategorySelect"
                    label="Punch category *"
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                    onChange={createChangeHandler('category')}
                >
                    <option hidden disabled selected />
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
                >
                    <option hidden disabled selected />
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
                >
                    <option hidden disabled selected />
                    {organizations.map((organization) => (
                        <option key={organization.id} value={organization.id}>
                            {organization.description}
                        </option>
                    ))}
                </NativeSelect>
                <TextField
                    id="actionByPerson"
                    type="search"
                    value={chosenPerson.name}
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
                <TextField
                    id="dueDate"
                    type="date"
                    label="Due Date"
                    onChange={createChangeHandler('dueDate')}
                />
                <NativeSelect
                    id="PunchTypeSelect"
                    label="Type"
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                    onChange={createChangeHandler('type')}
                >
                    <option hidden disabled selected />
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
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                    onChange={createChangeHandler('sorting')}
                >
                    <option hidden disabled selected />
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
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                    onChange={createChangeHandler('priority')}
                >
                    <option hidden disabled selected />
                    {priorities.map((priority) => (
                        <option
                            key={priority.id}
                            value={priority.id}
                        >{`${priority.code}. ${priority.description}`}</option>
                    ))}
                </NativeSelect>
                {
                    // TODO: way to open a numbers-ony keyboard when editing the estimate text field?
                }
                <TextField
                    type="number"
                    label="Estimate"
                    id="estimate"
                    onChange={createChangeHandler('estimate')}
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
