import { Button, Input, TextField } from '@equinor/eds-core-react';
import React, { useState } from 'react';

interface OfflinePinProps {
    userPin?: number;
    setUserPin: (pin: number) => void;
}

const OfflinePin = ({ userPin, setUserPin }: OfflinePinProps): JSX.Element => {
    const [enteredPin, setEnteredPin] = useState<string>('');
    return (
        <>
            <Input
                type="number"
                value={enteredPin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    setEnteredPin(e.target.value);
                }}
            />
            <Button
                onClick={(): void => {
                    setUserPin(parseInt(enteredPin));
                    console.log(enteredPin);
                }}
            >
                Change
            </Button>
        </>
    );
};

export default OfflinePin;
