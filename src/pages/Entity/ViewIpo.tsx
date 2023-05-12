import React from 'react';
import {
    IpoDetails,
    McPkgPreview,
    PoPreview,
    Tag,
    WoPreview,
} from '../../services/apiTypes';
import {
    AsyncStatus,
    ErrorPage,
    HomeButton,
    isOfType,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';
import AsyncPage from '../../components/AsyncPage';
import { Button } from '@equinor/eds-core-react';
import useCommonHooks from '../../utils/useCommonHooks';
import styled from 'styled-components';

const ContentWrapper = styled.main`
    min-height: 0px;
    padding: 16px 4% 16px 4%;
    & p {
        word-break: break-word;
        margin: 0;
    }
    & h6 {
        margin: 8px 0px 8px 0px;
    }
`;

interface ViewIpoProps {
    fetchDetailsStatus: AsyncStatus;
    ipoDetails?: WoPreview | McPkgPreview | Tag | PoPreview | IpoDetails;
}

const ViewIpo = ({
    fetchDetailsStatus,
    ipoDetails,
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
                    <h6>Description</h6>
                    <p>{ipoDetails?.description}</p>
                    <h6>Date and time for punch round</h6>
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
                    <p>Location: {ipoDetails?.location}</p>
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
