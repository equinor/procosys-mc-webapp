import React from 'react';
import {
    AsyncStatus,
    ErrorPage,
    HomeButton,
    isOfType,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';
import { Button } from '@equinor/eds-core-react';
import styled from 'styled-components';
import AsyncPage from '../../../components/AsyncPage';
import {
    WoPreview,
    McPkgPreview,
    Tag,
    PoPreview,
    IpoDetails,
} from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import SignatureCard from './SignatureCard';

const ContentWrapper = styled.main`
    min-height: 0px;
    padding: 16px 4% 16px 4%;
    & p {
        word-break: break-word;
        margin: 0;
    }
    & h5 {
        margin: 8px 0px 8px 0px;
    }
`;

interface ViewIpoProps {
    fetchDetailsStatus: AsyncStatus;
    ipoDetails?: WoPreview | McPkgPreview | Tag | PoPreview | IpoDetails;
    setRefreshDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
}

const ViewIpo = ({
    fetchDetailsStatus,
    ipoDetails,
    setRefreshDetails,
    setSnackbarText,
}: ViewIpoProps): JSX.Element => {
    const { history, url } = useCommonHooks();
    if (
        ipoDetails === undefined ||
        isOfType<IpoDetails>(ipoDetails, 'participants')
    ) {
        return (
            <AsyncPage
                fetchStatus={fetchDetailsStatus}
                errorMessage={'Unable to load the IPO. Please try again.'}
            >
                <ContentWrapper>
                    <h5>Description</h5>
                    <p>{ipoDetails?.description ?? '-'}</p>
                    <h5>Date and time for punch round</h5>
                    <p>
                        Date:{' '}
                        {ipoDetails &&
                            new Date(
                                ipoDetails.startTimeUtc
                            ).toLocaleDateString('en-GB')}
                    </p>
                    <p>
                        Start:{' '}
                        {ipoDetails &&
                            new Date(
                                ipoDetails.startTimeUtc
                            ).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                    </p>
                    <p>
                        End:{' '}
                        {ipoDetails &&
                            new Date(ipoDetails.endTimeUtc).toLocaleTimeString(
                                'en-GB',
                                { hour: '2-digit', minute: '2-digit' }
                            )}
                    </p>
                    <p>Location: {ipoDetails?.location ?? '-'}</p>
                    <h5>Participants</h5>
                    {ipoDetails?.participants.map((participant) => {
                        return (
                            <SignatureCard
                                key={participant.id}
                                participant={participant}
                                setRefreshDetails={setRefreshDetails}
                                setSnackbarText={setSnackbarText}
                            />
                        );
                    })}
                </ContentWrapper>
            </AsyncPage>
        );
    } else {
        return (
            <ErrorPage
                title="Unable to load the IPO."
                description="The IPO page is only available for IPOs"
                actions={[
                    <HomeButton key={'home'} />,
                    <Button
                        key={'scopePage'}
                        onClick={(): void =>
                            history.push(removeSubdirectories(url, 1))
                        }
                    >
                        Scope page
                    </Button>,
                ]}
            />
        );
    }
};

export default ViewIpo;
