import { Button, Input, Label } from '@equinor/eds-core-react';
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
    const [loginTriesLeft, setLoginTriesLeft] = useState<number>(3);

    const testUserPin = async (): Promise<void> => {
        const succsess = await db.reInitAndVerifyPin(enteredPin);
        if (succsess) {
            localStorage.removeItem('loginTries');
            setUserPin(enteredPin);
            return;
        }

        //Not able to initialize database. Probably wrong pin.
        const loginTries = localStorage.getItem('loginTries');
        if (loginTries == null) {
            localStorage.setItem('loginTries', '1');
            setFailedPin(true);
            setLoginTriesLeft((prev) => prev - 1);
            return;
        }
        const loginTriesNum = parseInt(loginTries);
        if (!isNaN(loginTriesNum) && loginTriesNum < 2) {
            setFailedPin(true);
            localStorage.setItem('loginTries', `${loginTriesNum + 1}`);
            setLoginTriesLeft((prev) => prev - 1);
        } else {
            db.clearTables();
            updateOfflineStatus(false, '');
            localStorage.removeItem('loginTries');
        }
    };

    return (
        <>
            <Navbar leftContent={<ProcosysButton />} isOffline={true} />
            <ContentWrapper>
                <h3>Input your offline pin</h3>
                {failedPin ? (
                    <Label
                        htmlFor="pin-input"
                        label={`You have ${loginTriesLeft} login ${
                            loginTriesLeft < 2 ? 'try' : 'tries'
                        } left before offline data is deleted`}
                    />
                ) : null}
                <Input
                    id="pin-input"
                    type="password"
                    value={enteredPin}
                    onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                        setEnteredPin(e.target.value);
                    }}
                    variant={failedPin ? 'error' : 'default'}
                />
                <Spacer />
                <Button onClick={testUserPin}>Change</Button>
            </ContentWrapper>
        </>
    );
};

export default OfflinePin;
