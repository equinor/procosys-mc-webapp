import React from 'react';
import { CollapsibleCard } from '@equinor/procosys-webapp-components';
import {
    IpoDetails,
    IpoParticipant,
    McPkgPreview,
    PoPreview,
    Tag,
    WoPreview,
} from '../../../services/apiTypes';
import useViewIpoFacade from './useViewIpoFacade';
import { TextField, Button, Switch, Progress } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { COLORS } from '../../../style/GlobalStyles';
import IpoSignatureButton from './IpoSignatureButton';
import { IpoStatusEnum } from '../../../typings/enums';

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

interface SignatureCardProps {
    participant: IpoParticipant;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    ipoRowVersion: string;
    ipoStatus: IpoStatusEnum;
    setIpoDetails: React.Dispatch<
        React.SetStateAction<
            WoPreview | McPkgPreview | Tag | PoPreview | IpoDetails | undefined
        >
    >;
}

const SignatureCard = ({
    participant,
    setSnackbarText,
    ipoRowVersion,
    ipoStatus,
    setIpoDetails,
}: SignatureCardProps): JSX.Element => {
    const {
        getRepresentativeAndResponse,
        getOrganizationText,
        updateAttendedStatus,
        attended,
        updateNote,
        note,
        setNote,
        isLoading,
        completeIpo,
        uncompleteIpo,
        signIpo,
        unsignIpo,
        acceptIpo,
        unacceptIpo,
    } = useViewIpoFacade({
        participant,
        setSnackbarText,
        ipoRowVersion,
        setIpoDetails,
    });
    const { representative, response } =
        getRepresentativeAndResponse(participant);
    return (
        <CollapsibleCard
            cardTitle={
                getOrganizationText(
                    participant.organization,
                    participant.sortKey
                ) ?? ''
            }
            chevronPosition="right"
        >
            <SignaturesContainer>
                <TitleCell>Representative</TitleCell>
                <ValueCell>{representative}</ValueCell>
                <TitleCell>Outlook Response</TitleCell>
                <ValueCell>{response}</ValueCell>
                <TitleCell>Attended</TitleCell>
                <ValueCell>
                    <Switch
                        id={`attendance${participant.id}`}
                        disabled={!participant.canEditAttendedStatusAndNote}
                        label={attended ? 'Attended' : 'Did not attend'}
                        checked={attended}
                        onChange={(): void => {
                            updateAttendedStatus(
                                !attended,
                                participant.rowVersion
                            );
                        }}
                    />
                </ValueCell>
                <TitleCell>Notes</TitleCell>
                <ValueCell>
                    <TextField
                        value={note}
                        disabled={!participant.canEditAttendedStatusAndNote}
                        onChange={(
                            e: React.ChangeEvent<
                                HTMLTextAreaElement | HTMLInputElement
                            >
                        ): void => {
                            setNote(e.target.value);
                        }}
                        onBlur={(): void => {
                            updateNote(participant.rowVersion);
                        }}
                        id={`notesFor${participant.id}`}
                    />
                </ValueCell>
                <TitleCell></TitleCell>
                <ValueCell>
                    <IpoSignatureButton
                        ipoStatus={ipoStatus}
                        participant={participant}
                        isLoading={isLoading}
                        completeIpo={completeIpo}
                        uncompleteIpo={uncompleteIpo}
                        signIpo={signIpo}
                        unsignIpo={unsignIpo}
                        acceptIpo={acceptIpo}
                        unacceptIpo={unacceptIpo}
                    />
                </ValueCell>
                <TitleCell>Signed by</TitleCell>
                <ValueCell>
                    {isLoading ? (
                        <Progress.Circular size={16} />
                    ) : participant.signedBy ? (
                        `${participant.signedBy.lastName}, ${participant.signedBy.firstName}`
                    ) : (
                        '-'
                    )}
                </ValueCell>
                <TitleCell>Signed at</TitleCell>
                <ValueCell>
                    {isLoading ? (
                        <Progress.Circular size={16} />
                    ) : participant.signedAtUtc ? (
                        `${new Date(participant.signedAtUtc).toLocaleTimeString(
                            'en-GB',
                            {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            }
                        )}`
                    ) : (
                        '-'
                    )}
                </ValueCell>
            </SignaturesContainer>
        </CollapsibleCard>
    );
};

export default SignatureCard;
