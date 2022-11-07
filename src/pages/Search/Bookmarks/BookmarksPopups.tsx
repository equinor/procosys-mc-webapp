import React, { useEffect, useState } from 'react';
import { Scrim, Label, Input, Checkbox, Button } from '@equinor/eds-core-react';
import { AsyncStatus } from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import { COLORS, SHADOW } from '../../../style/GlobalStyles';
import { ButtonsWrapper } from './Bookmarks';
import useBookmarks, { OfflineAction } from '../../../utils/useBookmarks';

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
    const [enteredPin, setEnteredPin] = useState<string>('');
    const [enteredPinIsValid, setEnteredPinIsValid] = useState(false);

    useEffect(() => {
        try {
            const pin = parseInt(enteredPin);
            if (!isNaN(pin) && enteredPin.length == 4) {
                setEnteredPinIsValid(true);
            } else {
                setEnteredPinIsValid(false);
            }
        } catch {
            setEnteredPinIsValid(false);
        }
    }, [enteredPin]);

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
                        <h3>Input a code to use as your offline pin number</h3>
                        <Label label="Input a 4-digit number" />
                        <Input
                            type="number"
                            value={enteredPin}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                setEnteredPin(e.target.value);
                            }}
                            variant={
                                enteredPin && !enteredPinIsValid
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
                                disabled={!isSure || !enteredPinIsValid}
                                onClick={(): void => {
                                    setUserPin(enteredPin);
                                    setIsSure(false);
                                    setOfflineAction(OfflineAction.INACTIVE);
                                    startOffline(enteredPin);
                                }}
                            >
                                Create pin
                            </Button>
                            <Button
                                onClick={(): void => {
                                    setOfflineAction(OfflineAction.INACTIVE);
                                    setIsSure(false);
                                    setEnteredPin('');
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
        </>
    );
};

export default BookmarksPopUps;
