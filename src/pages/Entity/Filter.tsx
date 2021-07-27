import React, { ChangeEvent } from 'react';
import { Checkbox, NativeSelect, Radio } from '@equinor/eds-core-react';
import { ChecklistPreview, PunchPreview } from '../../services/apiTypes';
import useFilterFacade from './useFilterFacade';
import useCommonHooks from '../../utils/useCommonHooks';

type FilterProps = {
    setFilterCount: React.Dispatch<React.SetStateAction<number>>;
    setShownItems: React.Dispatch<
        React.SetStateAction<ChecklistPreview[] | PunchPreview[] | undefined>
    >;
    allItems?: ChecklistPreview[] | PunchPreview[];
};

const Filter = ({
    setFilterCount,
    setShownItems,
    allItems,
}: FilterProps): JSX.Element => {
    const { url } = useCommonHooks();
    const {
        responsibles,
        formTypes,
        handleStatusChange,
        handleSignatureChange,
        handleResponsibleChange,
        handleFormTypeChange,
    } = useFilterFacade(setFilterCount, setShownItems, allItems);

    const determineStatusFieldToRender = (): JSX.Element => {
        if (url.includes('/punch-list')) {
            return <></>;
        } else {
            // TODO: fix onChange to be just {handleStatusChange} if no other info needed
            return (
                <div>
                    <Checkbox
                        label="Test 1"
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            handleStatusChange(e);
                        }}
                    />
                </div>
            );
        }
    };

    return (
        <form>
            {determineStatusFieldToRender()}
            <div>
                <Radio label="test 1" onChange={handleSignatureChange} />
                <Radio label="test 2" onChange={handleSignatureChange} />
            </div>
            <NativeSelect
                id="ResponsibleSelect"
                label="Responsible"
                defaultValue=""
                onChange={handleResponsibleChange}
            >
                <option key="Empty" value="">
                    Select
                </option>
                <option key="Tester" value="testing">
                    Test
                </option>
                {responsibles?.map((responsible) => {
                    <option key={responsible} value={responsible}>
                        {responsible}
                    </option>;
                })}
            </NativeSelect>
        </form>
    );
};

export default Filter;
