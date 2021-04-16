import { Divider, TextField } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { TaskParameter } from '../../../services/apiTypes';
import { BREAKPOINT } from '../../../style/GlobalStyles';
import MeasuredValueInput from './MeasuredValueInput';

const ParameterRow = styled.div`
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    & p {
        flex: 1.5;
        margin-right: 12px;
    }
`;

const ParameterInputWrapper = styled.div`
    display: flex;
    flex: 1;
    & > div:first-of-type {
        margin-right: 16px;
    }
    ${BREAKPOINT.sm} {
        flex-direction: column;
        & div:first-of-type {
            margin-bottom: 8px;
        }
    }
`;

export type TaskParameterDto = {
    ParameterId: number;
    Value: string;
};

type TaskParametersProps = {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    isSigned: boolean;
    parameters: TaskParameter[];
};

const TaskParameters = ({
    setSnackbarText,
    isSigned,
    parameters,
}: TaskParametersProps): JSX.Element => {
    return (
        <>
            {parameters.map((parameter, i) => (
                <React.Fragment key={parameter.id}>
                    {i === 0 ? null : <Divider />}
                    <ParameterRow key={parameter.id}>
                        <p>{parameter.description}</p>
                        <ParameterInputWrapper>
                            <MeasuredValueInput
                                parameter={parameter}
                                isSigned={isSigned}
                                setSnackbarText={setSnackbarText}
                            />
                            <TextField
                                label={'Reference'}
                                disabled
                                readOnly
                                meta={parameter.referenceUnit}
                                defaultValue={parameter.referenceValue}
                                id={'ReferenceValue'}
                            />
                        </ParameterInputWrapper>
                    </ParameterRow>
                </React.Fragment>
            ))}
        </>
    );
};

export default TaskParameters;
