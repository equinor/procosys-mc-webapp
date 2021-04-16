import { TextField } from '@equinor/eds-core-react';
import React, { useState } from 'react';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { TaskParameter } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import { TaskParameterDto } from './TaskParameters';

type MeasuredValueInputProps = {
    parameter: TaskParameter;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    isSigned: boolean;
};

const MeasuredValueInput = ({
    parameter,
    setSnackbarText,
    isSigned,
}: MeasuredValueInputProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [value, setValue] = useState(parameter.measuredValue);
    const [updateValueStatus, setUpdateValueStatus] = useState(
        AsyncStatus.INACTIVE
    );
    let valueBeforeFocus = '';

    const updateValue = async (): Promise<void> => {
        setUpdateValueStatus(AsyncStatus.LOADING);
        const dto: TaskParameterDto = {
            ParameterId: parameter.id,
            Value: value,
        };
        try {
            await api.putTaskParameter(params.plant, dto);
            setUpdateValueStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Parameter value saved');
        } catch (error) {
            setUpdateValueStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    return (
        <TextField
            label={'Measured'}
            disabled={updateValueStatus === AsyncStatus.LOADING || isSigned}
            meta={parameter.referenceUnit}
            value={value}
            id={'MeasuredValue ' + parameter.id.toString()}
            onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ): void => {
                setValue(e.target.value);
            }}
            onFocus={(): string => (valueBeforeFocus = value)}
            onBlur={(): void => {
                value !== valueBeforeFocus && updateValue();
            }}
        />
    );
};

export default MeasuredValueInput;
