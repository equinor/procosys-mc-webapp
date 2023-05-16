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
    CollapsibleCard,
    ErrorPage,
    HomeButton,
    isOfType,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';
import AsyncPage from '../../components/AsyncPage';
import { Button, TextField } from '@equinor/eds-core-react';
import useCommonHooks from '../../utils/useCommonHooks';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';
import useViewIpoFacade from './useViewIpoFacade';

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

const SignaturesContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    p:nth-child(n + 3) {
        border-top: solid 2px ${COLORS.lightGrey};
    }
`;

const TitleCell = styled.p`
    font-weight: bold;
    grid-column: 1 / span 1;
    border-right: solid 2px ${COLORS.lightGrey};
    padding: 4px;
`;

const ValueCell = styled.p`
    grid-column: 2 / span 1;
    padding: 4px;
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
    const { getRepresentativeAndResponse } = useViewIpoFacade();
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
                        const { representative, response } =
                            getRepresentativeAndResponse(participant);
                        return (
                            <CollapsibleCard
                                key={participant.id}
                                cardTitle={participant.organization}
                                chevronPosition="right"
                            >
                                <SignaturesContainer>
                                    <TitleCell>Representative</TitleCell>
                                    <ValueCell>{representative}</ValueCell>
                                    <TitleCell>Outlook Response</TitleCell>
                                    <ValueCell>{response}</ValueCell>
                                    <TitleCell>Attended</TitleCell>
                                    <ValueCell>
                                        {participant.attended}
                                    </ValueCell>
                                    <TitleCell>Notes</TitleCell>
                                    <ValueCell>
                                        <TextField
                                            value={participant.note}
                                            onChange={(): void => {
                                                //TODO
                                            }}
                                            id={`notesFor${participant.id}`}
                                        />
                                    </ValueCell>
                                    <TitleCell></TitleCell>
                                    <ValueCell>
                                        <Button>Complete IPO</Button>
                                    </ValueCell>
                                    <TitleCell>Signed by</TitleCell>
                                    <ValueCell>Vilde</ValueCell>
                                    <TitleCell>Signed at</TitleCell>
                                    <ValueCell>Today</ValueCell>
                                </SignaturesContainer>
                            </CollapsibleCard>
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
