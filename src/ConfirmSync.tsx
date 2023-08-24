import { Button } from '@equinor/eds-core-react';
import {
    Navbar,
    OfflineStatus,
    ProcosysButton,
    db,
    isOfType,
} from '@equinor/procosys-webapp-components';
import React from 'react';
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
const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
`;

interface ConfirmSyncProps {
    setIsSure: () => void;
}

const ConfirmSync = ({ setIsSure }: ConfirmSyncProps): JSX.Element => {
    return (
        <>
            <Navbar leftContent={<ProcosysButton />} isOffline={true} />
            <ContentWrapper>
                <h3>
                    You have already uploaded changes to the selected bookmarks
                    since you started offline on this device/browser. Do you
                    still wish to upload your changes?
                </h3>
                <ButtonsWrapper>
                    <Button onClick={(): void => setIsSure()}>Yes</Button>
                    <Button
                        onClick={async (): Promise<void> => {
                            updateOfflineStatus(OfflineStatus.ONLINE, '');
                            await db.delete();
                            if (isOfType<Location>(location, 'reload')) {
                                location.reload();
                            }
                        }}
                    >
                        No
                    </Button>
                </ButtonsWrapper>
            </ContentWrapper>
        </>
    );
};

export default ConfirmSync;
