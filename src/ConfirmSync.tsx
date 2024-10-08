import { Button } from '@equinor/eds-core-react';
import {
    Navbar,
    ProcosysButton,
    isOfType,
} from '@equinor/procosys-webapp-components';
import React from 'react';
import styled from 'styled-components';
import { updateOfflineStatus } from './offline/OfflineStatus';
import { OfflineStatus } from './typings/enums';
import { db } from './offline/db';
import useCommonHooks from 'utils/useCommonHooks';

const ContentWrapper = styled.main`
    margin: 16px;
    & > h3 {
        margin-bottom: 16px;
    }
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
    const { useTestColorIfOnTest } = useCommonHooks();
    return (
        <>
            <Navbar
                leftContent={<ProcosysButton />}
                isOffline={true}
                testColor={useTestColorIfOnTest}
            />
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
