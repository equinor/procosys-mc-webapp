import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ChecklistPreview, PunchPreview } from '../../services/apiTypes';

// TODO: easier if they are strings that match the value??
type StatusFilter = {
    OS: boolean;
    PA: boolean;
    PB: boolean;
    OK: boolean;
};

type Filter = {
    status: StatusFilter;
    signature: string;
    responsible: string;
    formType: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useFilterFacade = (
    setFilterCount: React.Dispatch<React.SetStateAction<number>>,
    setShownItems: React.Dispatch<
        React.SetStateAction<ChecklistPreview[] | PunchPreview[] | undefined>
    >,
    allItems?: ChecklistPreview[] | PunchPreview[]
) => {
    const [filter, setFilter] = useState<Filter>({
        status: {
            OS: false,
            PA: false,
            PB: false,
            OK: false,
        },
        signature: '',
        responsible: '',
        formType: '',
    }); // TODO: make a empty filter const outside the component and use here??
    const [statuses, setStatuses] = useState<string[]>();
    const [responsibles, setResponsibles] = useState<string[]>();
    const [formTypes, setFormTypes] = useState<string[]>();

    useEffect(() => {
        // TODO: is there a better way to declare these variables??
        const uniqueResponsibles = new Set<string>();
        const uniqueFormTypes = new Set<string>();
        const uniqueStatuses = new Set<string>();
        allItems?.map((item) => {
            uniqueResponsibles.add(item.responsibleCode);
            uniqueFormTypes.add(item.formularType);
            uniqueStatuses.add(item.status);
        });
        setStatuses(Array.from(uniqueStatuses));
        setResponsibles(Array.from(uniqueResponsibles));
        setFormTypes(Array.from(uniqueFormTypes));
    }, [allItems]);

    // TODO: should this be a function the handler(s) call instead??
    useEffect(() => {
        // TODO: filter based on the filter values
        // TODO: set filter count
    }, [filter]);

    const handleStatusChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        console.log(e.target.value);
        // TODO: change the status filter value
    };

    const handleSignatureChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        console.log(e.target.value);
        // TODO: change the status filter value
    };

    // TODO: can I make a common handler for the two handlers below??

    const handleResponsibleChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        console.log(e.target.value);
        // TODO: change the status filter value
    };

    const handleFormTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        // TODO: change the status filter value
        console.log(e.target.value);
    };

    return {
        statuses,
        responsibles,
        formTypes,
        handleStatusChange,
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
    };
};

export default useFilterFacade;
