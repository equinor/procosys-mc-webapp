import { Button, Input, TextField } from '@equinor/eds-core-react';
import { Navbar, ProcosysButton } from '@equinor/procosys-webapp-components';
import React, { useState } from 'react';
import styled from 'styled-components';

const ContentWrapper = styled.main`
    margin: 16px;
`;

interface OfflinePinProps {
    setUserPin: (pin: number) => void;
}

const OfflinePin = ({ setUserPin }: OfflinePinProps): JSX.Element => {
    const [enteredPin, setEnteredPin] = useState<string>('');

    const testUserPin = (): void => {
        // TODO: call init of db with enteded pin
        // TODO: test if db can be accessed
        // if db can be accessed:
        setUserPin(parseInt(enteredPin));
        // if db can't be accessed
        // TODO: count tries?
    };
    return (
        <>
            <Navbar leftContent={<ProcosysButton />} isOffline={true} />
            <ContentWrapper>
                <h3>Input your offline pin</h3>
                <Input
                    type="number"
                    value={enteredPin}
                    onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                        setEnteredPin(e.target.value);
                    }}
                />
                <Button onClick={testUserPin}>Change</Button>
            </ContentWrapper>
        </>
    );
};

export default OfflinePin;
