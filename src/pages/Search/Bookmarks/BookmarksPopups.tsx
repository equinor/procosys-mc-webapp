import React, { useEffect, useState } from 'react';
import { Scrim, Label, Input, Checkbox, Button } from '@equinor/eds-core-react';
import { AsyncStatus } from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import { COLORS, SHADOW } from '../../../style/GlobalStyles';
import { ButtonsWrapper } from './Bookmarks';
import { OfflineAction } from '../../../utils/useBookmarks';
import { Bookmarks } from '../../../services/apiTypes';
import { OfflineScopeStatus } from '../../../typings/enums';

export const BookmarksPopup = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: ${COLORS.white};
    padding: 16px;
    margin: 0 16px;
    box-shadow: ${SHADOW};
    max-height: 90vh;
    overflow: auto;
`;

const Spacer = styled.div`
    height: 16px;
`;

interface BookmarksPopUpsProps {
    offlineAction: OfflineAction;
    setOfflineAction: React.Dispatch<React.SetStateAction<OfflineAction>>;
    setUserPin: React.Dispatch<React.SetStateAction<string>>;
    startOffline: (userPin: string) => Promise<void>;
    bookmarksStatus: AsyncStatus;
    cancelOffline: () => Promise<void>;
    noNetworkConnection: boolean;
    setNoNetworkConnection: React.Dispatch<React.SetStateAction<boolean>>;
    startSync: () => void;
    bookmarks: Bookmarks | null;
    tryStartOffline: () => Promise<void>;
}

const BookmarksPopUps = ({
    offlineAction,
    setOfflineAction,
    setUserPin,
    startOffline,
    bookmarksStatus,
    cancelOffline,
    noNetworkConnection,
    setNoNetworkConnection,
    startSync,
    bookmarks,
    tryStartOffline,
}: BookmarksPopUpsProps): JSX.Element => {
    const [isSure, setIsSure] = useState<boolean>(false);
    const [enteredPin1, setEnteredPin1] = useState<string>('');
    const [enteredPin2, setEnteredPin2] = useState<string>('');
    const [enteredPinIsValid, setEnteredPinIsValid] = useState(false);

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

    return (
        <>
            {offlineAction == OfflineAction.TRYING_STARTING &&
            bookmarks?.openDefinition.status ==
                OfflineScopeStatus.IS_OFFLINE ? (
                <Scrim
                    isDismissable
                    onClose={(): void =>
                        setOfflineAction(OfflineAction.INACTIVE)
                    }
                    open={
                        offlineAction == OfflineAction.TRYING_STARTING &&
                        bookmarks?.openDefinition.status ==
                            OfflineScopeStatus.IS_OFFLINE
                    }
                >
                    <BookmarksPopup>
                        <h3>
                            You are already in offline mode with these bookmarks
                            on another device or another browser
                        </h3>
                        <p>You now have two choices</p>
                        <p>
                            You can click dismiss, and then stop offline mode on
                            your other device/browser before retrying
                        </p>
                        <p>
                            You can continue starting offline mode on this
                            device/browser
                        </p>
                        <ButtonsWrapper>
                            <Button
                                onClick={(): void =>
                                    setOfflineAction(OfflineAction.INACTIVE)
                                }
                            >
                                Dismiss
                            </Button>
                            <Button
                                onClick={(): Promise<void> => tryStartOffline()}
                            >
                                Continue
                            </Button>
                        </ButtonsWrapper>
                    </BookmarksPopup>
                </Scrim>
            ) : null}
            {offlineAction == OfflineAction.STARTING ? (
                <Scrim
                    isDismissable
                    onClose={(): void => {
                        setOfflineAction(OfflineAction.INACTIVE);
                        setIsSure(false);
                    }}
                    open={offlineAction == OfflineAction.STARTING}
                >
                    <BookmarksPopup>
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
                                    : undefined
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
                                    : undefined
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
                    </BookmarksPopup>
                </Scrim>
            ) : null}
            {offlineAction == OfflineAction.CANCELLING ? (
                <Scrim
                    isDismissable
                    onClose={(): void =>
                        setOfflineAction(OfflineAction.INACTIVE)
                    }
                    open={offlineAction == OfflineAction.CANCELLING}
                >
                    <BookmarksPopup>
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
                    </BookmarksPopup>
                </Scrim>
            ) : null}
            {noNetworkConnection ? (
                <Scrim open={noNetworkConnection}>
                    <BookmarksPopup>
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
                    </BookmarksPopup>
                </Scrim>
            ) : null}
        </>
    );
};

export default BookmarksPopUps;
