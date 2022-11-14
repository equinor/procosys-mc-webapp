import { Button, Input } from '@equinor/eds-core-react';
import { Navbar, ProcosysButton } from '@equinor/procosys-webapp-components';
import React, { useState } from 'react';
import styled from 'styled-components';
import { db } from './offline/db';
import { updateOfflineStatus } from './offline/OfflineStatus';

const ContentWrapper = styled.main`
    margin: 16px;
    & > h3 {
        margin-bottom: 16px;
    }
`;
const Spacer = styled.div`
    height: 16px;
`;

interface OfflinePinProps {
    setUserPin: (pin: string) => void;
}

const OfflinePin = ({ setUserPin }: OfflinePinProps): JSX.Element => {
    const [enteredPin, setEnteredPin] = useState<string>('');
    const [failedPin, setFailedPin] = useState<boolean>(false);

    const testUserPin = async (): Promise<void> => {
        const suksess = await db.reInitAndVerifyPin(enteredPin);
        if (suksess) {
            localStorage.removeItem('loginTries');
            setUserPin(enteredPin);
            return;
        }

        //Not able to initialize database. Probably wrong pin.
        const loginTries = localStorage.getItem('loginTries');
        if (loginTries == null) {
            localStorage.setItem('loginTries', '1');
            setFailedPin(true);
            return;
        }
        const loginTriesNum = parseInt(loginTries);
        if (!isNaN(loginTriesNum) && loginTriesNum < 2) {
            setFailedPin(true);
            localStorage.setItem('loginTries', `${loginTriesNum + 1}`);
        } else {
            await db.delete();
            updateOfflineStatus(false, '');
            localStorage.removeItem('loginTries');
        }
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
                    variant={failedPin ? 'error' : 'default'}
                />
                <Spacer />
                <Button onClick={testUserPin}>Submit</Button>
            </ContentWrapper>
        </>
    );
};

export default OfflinePin;
