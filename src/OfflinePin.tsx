import { Button, Input, Label } from '@equinor/eds-core-react';
import {
    LocalStorage,
    Navbar,
    OfflineStatus,
    ProcosysButton,
    db,
} from '@equinor/procosys-webapp-components';
import React, { useState } from 'react';
import styled from 'styled-components';
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
        //todo: Hvis kode her kaster exception, så må vi sørge for å vise feilmelding
        const succsess = await db.reInitAndVerifyPin(enteredPin);
        if (succsess) {
            localStorage.removeItem(LocalStorage.LOGIN_TRIES);
            setUserPin(enteredPin);
            return;
        }

        //Not able to initialize database. Probably wrong pin.
        const loginTries = localStorage.getItem(LocalStorage.LOGIN_TRIES);
        if (loginTries == null) {
            localStorage.setItem(LocalStorage.LOGIN_TRIES, '1');
            setFailedPin(true);
            setLoginTriesLeft((prev) => prev - 1);
            return;
        }
        const loginTriesNum = parseInt(loginTries);
        if (!isNaN(loginTriesNum) && loginTriesNum < 2) {
            setFailedPin(true);
            localStorage.setItem(
                LocalStorage.LOGIN_TRIES,
                `${loginTriesNum + 1}`
            );
            setLoginTriesLeft((prev) => prev - 1);
        } else {
            await db.delete();
            updateOfflineStatus(OfflineStatus.ONLINE, '');
            localStorage.removeItem(LocalStorage.LOGIN_TRIES);
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
                    variant={failedPin ? 'error' : undefined}
                />
                <Spacer />
                <Button onClick={testUserPin}>Submit</Button>
            </ContentWrapper>
        </>
    );
};

export default OfflinePin;
