import React, { useEffect, useState } from 'react';
import { Scrim, Label, Input, Checkbox, Button } from '@equinor/eds-core-react';
import {
    AsyncStatus,
    InfoItem,
    isOfType,
} from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import { COLORS, SHADOW } from '../../../style/GlobalStyles';
import { ButtonsWrapper } from './Bookmarks';
import useBookmarks, { OfflineAction } from '../../../utils/useBookmarks';
import { OfflineStatus } from '../../../typings/enums';
import { OfflineSynchronizationErrors } from '../../../services/apiTypes';

const CancellingPopup = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: ${COLORS.white};
    padding: 16px;
    margin: 0 16px;
    box-shadow: ${SHADOW};
`;

const Spacer = styled.div`
    height: 16px;
`;

interface BookmarksPopUpsProps {
    offlineState: OfflineStatus;
    offlineAction: OfflineAction;
    setOfflineAction: React.Dispatch<React.SetStateAction<OfflineAction>>;
    setUserPin: React.Dispatch<React.SetStateAction<string>>;
    startOffline: (userPin: string) => Promise<void>;
    bookmarksStatus: AsyncStatus;
    cancelOffline: () => Promise<void>;
    noNetworkConnection: boolean;
    setNoNetworkConnection: React.Dispatch<React.SetStateAction<boolean>>;
    startSync: () => void;
}

const BookmarksPopUps = ({
    offlineState,
    offlineAction,
    setOfflineAction,
    setUserPin,
    startOffline,
    bookmarksStatus,
    cancelOffline,
    noNetworkConnection,
    setNoNetworkConnection,
    startSync,
}: BookmarksPopUpsProps): JSX.Element => {
    const [isSure, setIsSure] = useState<boolean>(false);
    const [enteredPin1, setEnteredPin1] = useState<string>('');
    const [enteredPin2, setEnteredPin2] = useState<string>('');
    const [enteredPinIsValid, setEnteredPinIsValid] = useState(false);
    const [syncErrors, setSyncErrors] =
        useState<OfflineSynchronizationErrors | null>(null);

    useEffect(() => {
        try {
            const pin = parseInt(enteredPin1);
            if (!isNaN(pin) && enteredPin1.length == 4) {
                setEnteredPinIsValid(true);
            } else {
                setEnteredPinIsValid(false);
            }
        } catch {
            setEnteredPinIsValid(false);
        }
    }, [enteredPin1]);

    useEffect(() => {
        try {
            const pin = parseInt(enteredPin1);
            if (!isNaN(pin) && enteredPin1.length == 4) {
                setEnteredPinIsValid(true);
            } else {
                setEnteredPinIsValid(false);
            }
        } catch {
            setEnteredPinIsValid(false);
        }
    }, [enteredPin1]);

    useEffect(() => {
        const errors = localStorage.getItem('SynchErrors');
        if (errors != null) {
            try {
                const errorsObject = JSON.parse(errors);
                if (
                    isOfType<OfflineSynchronizationErrors>(
                        errorsObject,
                        'CheckListErrors'
                    )
                ) {
                    setSyncErrors(errorsObject);
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        setSyncErrors(null);
    }, [offlineState]);

    return (
        <>
            {offlineAction == OfflineAction.STARTING ? (
                <Scrim
                    isDismissable
                    onClose={(): void =>
                        setOfflineAction(OfflineAction.INACTIVE)
                    }
                >
                    <CancellingPopup>
                        <h3>
                            Input a 4-digit pin number to use as your offline
                            pin code
                        </h3>
                        <Label label="Input a 4-digit number" />
                        <Input
                            type="password"
                            value={enteredPin1}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                setEnteredPin1(e.target.value);
                            }}
                            variant={
                                enteredPin1 && !enteredPinIsValid
                                    ? 'error'
                                    : 'default'
                            }
                        />
                        <Spacer />
                        <Label
                            label={
                                enteredPin2 == '' || enteredPin1 == enteredPin2
                                    ? 'Enter pin again to confirm'
                                    : 'Pins do not match'
                            }
                        />
                        <Input
                            type="password"
                            value={enteredPin2}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                setEnteredPin2(e.target.value);
                            }}
                            variant={
                                enteredPin2 && enteredPin1 != enteredPin2
                                    ? 'error'
                                    : 'default'
                            }
                        />
                        <Spacer />
                        <Checkbox
                            label="I understand that forgetting my pin will result in my offline changes being deleted forever"
                            onClick={(): void => setIsSure((prev) => !prev)}
                        />
                        <ButtonsWrapper>
                            <Button
                                disabled={
                                    !isSure ||
                                    !enteredPinIsValid ||
                                    enteredPin1 != enteredPin2
                                }
                                onClick={(): void => {
                                    setUserPin(enteredPin1);
                                    setIsSure(false);
                                    setOfflineAction(OfflineAction.INACTIVE);
                                    startOffline(enteredPin1);
                                }}
                            >
                                Create pin
                            </Button>
                            <Button
                                onClick={(): void => {
                                    setOfflineAction(OfflineAction.INACTIVE);
                                    setIsSure(false);
                                    setEnteredPin1('');
                                    setEnteredPin2('');
                                }}
                            >
                                Cancel
                            </Button>
                        </ButtonsWrapper>
                    </CancellingPopup>
                </Scrim>
            ) : null}
            {offlineAction == OfflineAction.CANCELLING ? (
                <Scrim
                    isDismissable
                    onClose={(): void =>
                        setOfflineAction(OfflineAction.INACTIVE)
                    }
                >
                    <CancellingPopup>
                        <h3>Do you really wish to cancel offline mode?</h3>
                        <Checkbox
                            label="I understand that cancelling offline mode deletes all my offline changes"
                            onClick={(): void => setIsSure((prev) => !prev)}
                        />
                        <ButtonsWrapper>
                            <Button
                                color={'danger'}
                                disabled={
                                    bookmarksStatus === AsyncStatus.LOADING ||
                                    !isSure
                                }
                                onClick={(): void => {
                                    setIsSure(false);
                                    cancelOffline();
                                }}
                                aria-label="Delete"
                            >
                                Yes, cancel offline
                            </Button>
                            <Button
                                onClick={(): void => {
                                    setOfflineAction(OfflineAction.INACTIVE);
                                    setIsSure(false);
                                }}
                            >
                                Don&apos;t cancel
                            </Button>
                        </ButtonsWrapper>
                    </CancellingPopup>
                </Scrim>
            ) : null}
            {noNetworkConnection ? (
                <Scrim>
                    <CancellingPopup>
                        <h3>You don&apos;t have an internet connection</h3>
                        <p>
                            Please establish an internet connection before
                            retrying
                        </p>
                        <ButtonsWrapper>
                            <Button onClick={startSync}>
                                Retry Finish Offline
                            </Button>
                            <Button
                                onClick={(): void =>
                                    setNoNetworkConnection(false)
                                }
                            >
                                Cancel Finish Offline
                            </Button>
                        </ButtonsWrapper>
                    </CancellingPopup>
                </Scrim>
            ) : null}
            {offlineState == OfflineStatus.ONLINE && syncErrors != null ? (
                <Scrim>
                    <CancellingPopup>
                        <h3>Some of your offline changes could not be saved</h3>
                        <p>
                            A list of checklists and punches where at least one
                            change could not be saved is shown below
                        </p>
                        <h4>Checklists</h4>
                        {syncErrors.CheckListErrors.map((error) => {
                            <p>{error.Id}</p>;
                        })}
                        <h4>Punches</h4>
                        {syncErrors.PunchListItemErrors.map((error) => {
                            <p>{error.Id}</p>;
                        })}
                    </CancellingPopup>
                </Scrim>
            ) : null}
        </>
    );
};

export default BookmarksPopUps;
