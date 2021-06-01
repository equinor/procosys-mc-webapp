import {
    Button,
    Input,
    Label,
    NativeSelect,
    Search,
    TextField,
} from '@equinor/eds-core-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { CardWrapper } from '../../../../components/EdsCard';
import { AsyncStatus } from '../../../../contexts/McAppContext';
import {
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../../../../services/apiTypes';
import { COLORS } from '../../../../style/GlobalStyles';
import { PunchFormData } from '../NewPunch';

// TODO: check whether I need to change this into something else
export const NewPunchFormWrapper = styled.form`
    background-color: ${COLORS.white};
    margin-top: 32px;
    padding: 0 4%;
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
    persons: any; // TODO: find out which type
    types: PunchType[];
    sorts: PunchOrganization[]; // TODO: find out type
    priorities: PunchOrganization[]; // TODO: figure out type
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
    formData,
    buttonText,
    createChangeHandler,
    handleSubmit,
    submitPunchStatus,
    children,
}: NewPunchFormProps): JSX.Element => {
    // TODO: figure out whether required fields should habe a star (*) in the label
    // TODO: decide how to make optional fields clearable if filled out by mistake (an x in the right corner??) (see old app?)
    // TODO: add function to handle return from persons search comopnentc
    // TODO: use stuff below to decide whether or not to render the PersonsSearch component
    const [showPersonsSearch, setShowPersonsSearch] = useState(false);
    // TODO: add args
    // TODO: pass into the PersonsSearch component
    const handlePersonChosen = (): void => {
        // TODO: set value of the person search thing to the chosen name
        createChangeHandler('actionByPerson');
    };

    return (
        <>
            {
                // TODO: add the PersonsSearch component here
            }
            <NewPunchFormWrapper onSubmit={handleSubmit}>
                <NativeSelect
                    required
                    id="PunchCategorySelect"
                    label="Punch category"
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
                    label="Description"
                    multiline
                    rows={5}
                    id="NewPunchDescription"
                    disabled={submitPunchStatus === AsyncStatus.LOADING}
                />
                <NativeSelect
                    required
                    label="Raised by"
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
                    label="Clearing by"
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
                {
                    // TODO: change value of search field to always be like a state value, and then just update the state value when wanting to change person??
                }
                <div>
                    <label>Action by person</label>
                    {
                        // TODO: find a better way to do the search label, or style the label to match the other ones
                    }
                    <Search
                        id="actionByPerson"
                        onClick={(): void => setShowPersonsSearch(true)}
                    />
                </div>
                <TextField
                    id="dueDate"
                    type="date"
                    label="Due Date"
                    onChange={createChangeHandler('dueDate')}
                />
                <NativeSelect
                    required
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
                    <option disabled selected />
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
                    onChange={createChangeHandler('sorting')}
                >
                    <option disabled selected />
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
