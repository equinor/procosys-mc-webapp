import React from 'react';
import { Checkbox, NativeSelect, Radio } from '@equinor/eds-core-react';
import {
    ChecklistPreview,
    CompletionStatus,
    PunchPreview,
} from '../../services/apiTypes';
import useFilterFacade, { Signatures } from './useFilterFacade';
import useCommonHooks from '../../utils/useCommonHooks';

type FilterProps = {
    setFilterCount: React.Dispatch<React.SetStateAction<number>>;
    setShownItems: React.Dispatch<
        React.SetStateAction<ChecklistPreview[] | PunchPreview[] | undefined>
    >;
    allItems?: ChecklistPreview[] | PunchPreview[];
    isPunchFilter?: boolean;
};

const Filter = ({
    setFilterCount,
    setShownItems,
    allItems,
    isPunchFilter,
}: FilterProps): JSX.Element => {
    const { url } = useCommonHooks();
    const {
        statuses,
        responsibles,
        formTypes,
        handleStatusChange,
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
    } = useFilterFacade(setFilterCount, setShownItems, allItems, isPunchFilter);

    const determineStatusFieldsToRender = (): JSX.Element => {
        if (url.includes('/punch-list')) {
            return <></>;
        } else {
            return (
                <div>
                    {statuses?.map((status) => {
                        return (
                            <Checkbox
                                key={status}
                                label={status}
                                onChange={(): void => {
                                    handleStatusChange(status);
                                }}
                            />
                        );
                    })}
                </div>
            );
        }
    };

    const determineSignatureFieldsToRender = (): JSX.Element => {
        if (url.includes('/punch-list')) {
            return <></>;
        } else {
            return (
                <>
                    <Radio
                        label={Signatures.NOTSIGNED}
                        onChange={(): void =>
                            handleSignatureChange(Signatures.NOTSIGNED)
                        }
                    />
                    <Radio
                        label={Signatures.SIGNED}
                        onChange={(): void =>
                            handleSignatureChange(Signatures.SIGNED)
                        }
                    />
                </>
            );
        }
    };

    return (
        <form>
            {determineStatusFieldsToRender()}
            <Radio
                label="All"
                defaultChecked
                onChange={(): void => handleSignatureChange('All')}
            />
            {determineSignatureFieldsToRender()}
            <NativeSelect
                id="ResponsibleSelect"
                label="Responsible"
                defaultValue=""
                onChange={handleResponsibleChange}
            >
                <option key="Empty" value="">
                    Select
                </option>
                {responsibles?.map((responsible) => (
                    <option key={responsible} value={responsible}>
                        {responsible}
                    </option>
                ))}
            </NativeSelect>
            <NativeSelect
                id="FormTypeSelect"
                label="Form type"
                defaultValue=""
                onChange={handleFormTypeChange}
            >
                <option key="Empty" value="">
                    Select
                </option>
                {formTypes?.map((formType) => (
                    <option key={formType} value={formType}>
                        {formType}
                    </option>
                ))}
            </NativeSelect>
        </form>
    );
};

export default Filter;
