import { DotProgress } from '@equinor/eds-core-react';
import { InfoItem } from '@equinor/procosys-webapp-components';
import React from 'react';
import { AsyncStatus } from '../../contexts/McAppContext';
import { ChecklistResponse } from '../../services/apiTypes';
import { DetailsWrapper } from '../Entity/EntityPage';

type ChecklistDetailsCardProps = {
    fetchDetailsStatus: AsyncStatus;
    details: ChecklistResponse | undefined;
};

const ChecklistDetailsCard = ({
    fetchDetailsStatus,
    details,
}: ChecklistDetailsCardProps): JSX.Element => {
    if (fetchDetailsStatus === AsyncStatus.SUCCESS && details != undefined) {
        return (
            <InfoItem
                isDetailsCard
                isScope
                status={details.checkList.status}
                statusLetters={[
                    details.checkList.signedByUser ? 'S' : null,
                    details.checkList.verifiedByUser ? 'V' : null,
                ]}
                headerText={details.checkList.tagNo}
                description={details.checkList.tagDescription}
                chips={[
                    details.checkList.mcPkgNo,
                    details.checkList.formularType,
                ].filter((x) => x != null)}
                attachments={details.checkList.attachmentCount}
            />
        );
    } else if (fetchDetailsStatus === AsyncStatus.ERROR) {
        return (
            <DetailsWrapper>
                Unable to load details. Please reload
            </DetailsWrapper>
        );
    }
    return (
        <DetailsWrapper>
            <DotProgress color="primary" />
        </DetailsWrapper>
    );
};

export default ChecklistDetailsCard;
