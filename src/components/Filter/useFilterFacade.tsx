import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ChecklistPreview, PunchPreview } from '../../services/apiTypes';

export enum Signatures {
    NOTCLEARED = 'Not cleared',
    CLEARED = 'Cleared not verified',
    NOTSIGNED = 'Not signed',
    SIGNED = 'Signed not verified',
}

type Filter = {
    status: string[];
    signature: string;
    responsible: string;
    formType: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useFilterFacade = (
    setFilterCount: React.Dispatch<React.SetStateAction<number>>,
    setShownScope?: React.Dispatch<
        React.SetStateAction<ChecklistPreview[] | undefined>
    >,
    setShownPunches?: React.Dispatch<
        React.SetStateAction<PunchPreview[] | undefined>
    >,
    scopeItems?: ChecklistPreview[],
    punchItems?: PunchPreview[]
) => {
    const [filter, setFilter] = useState<Filter>({
        status: [],
        signature: '',
        responsible: '',
        formType: '',
    });
    const [statuses, setStatuses] = useState<string[]>();
    const [responsibles, setResponsibles] = useState<string[]>();
    const [formTypes, setFormTypes] = useState<string[]>();

    useEffect(() => {
        let allItems = null;
        if (scopeItems) {
            allItems = scopeItems;
        } else if (punchItems) {
            allItems = punchItems;
        }
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
    }, [scopeItems, punchItems]);

    useEffect(() => {
        let filterCount = 0;
        if (punchItems != undefined && setShownPunches != undefined) {
            let filtered = punchItems;
            if (filter.status.length > 0) {
                filtered = filtered.filter((item) => {
                    return filter.status.indexOf(item.status) != -1;
                });
                filterCount++;
            }
            switch (filter.signature) {
                case Signatures.NOTCLEARED:
                    filtered = filtered.filter((item) => {
                        return !item.cleared;
                    });
                    filterCount++;
                    break;
                case Signatures.CLEARED:
                    filtered = filtered.filter((item) => {
                        return item.cleared && !item.verified;
                    });
                    filterCount++;
                    break;
                default:
            }
            if (filter.responsible) {
                filtered = filtered.filter((item) => {
                    return item.responsibleCode === filter.responsible;
                });
                filterCount++;
            }
            if (filter.formType) {
                filtered = filtered.filter((item) => {
                    return item.formularType === filter.formType;
                });
                filterCount++;
            }
            setShownPunches(filtered);
        } else if (scopeItems != undefined && setShownScope != undefined) {
            let filtered = scopeItems;
            if (filter.status.length > 0) {
                filtered = filtered.filter((item) => {
                    return filter.status.indexOf(item.status) != -1;
                });
                filterCount++;
            }
            switch (filter.signature) {
                case Signatures.NOTSIGNED:
                    filtered = filtered.filter((item) => {
                        return !item.isSigned;
                    });
                    filterCount++;
                    break;
                case Signatures.SIGNED:
                    filtered = filtered.filter((item) => {
                        return item.isSigned && !item.isVerified;
                    });
                    filterCount++;
                    break;
                default:
            }
            if (filter.responsible) {
                filtered = filtered.filter((item) => {
                    return item.responsibleCode === filter.responsible;
                });
                filterCount++;
            }
            if (filter.formType) {
                filtered = filtered.filter((item) => {
                    return item.formularType === filter.formType;
                });
                filterCount++;
            }
            setShownScope(filtered);
        } else {
            return;
        }
        setFilterCount(filterCount);
    }, [filter, scopeItems, punchItems]);

    const handleStatusChange = (status: string): void => {
        if (punchItems != undefined) {
            if (status === 'All') {
                setFilter((prevFilter) => ({ ...prevFilter, status: [] }));
            } else {
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    status: [status],
                }));
            }
        } else if (scopeItems != undefined) {
            if (filter.status.indexOf(status) === -1) {
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    status: [...prevFilter.status, status],
                }));
            } else {
                setFilter((prevFilter) => ({
                    ...prevFilter,
                    status: prevFilter.status.filter((item) => {
                        return item != status;
                    }),
                }));
            }
        }
    };

    const handleSignatureChange = (signature: string): void => {
        setFilter((prevFilter) => ({ ...prevFilter, signature }));
    };

    const handleResponsibleChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            responsible: e.target.value,
        }));
    };

    const handleFormTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            formType: e.target.value,
        }));
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
