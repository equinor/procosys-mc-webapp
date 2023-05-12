import { DotProgress } from '@equinor/eds-core-react';
import {
    EntityDetails,
    isOfType,
    SearchType,
    TextIcon,
} from '@equinor/procosys-webapp-components';
import React from 'react';
import styled from 'styled-components';
import McDetails from '../../components/detailCards/McDetails';
import { AsyncStatus } from '../../contexts/McAppContext';
import {
    IpoDetails,
    McPkgPreview,
    PoPreview,
    Tag,
    WoPreview,
} from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import useCommonHooks from '../../utils/useCommonHooks';

export const DetailsWrapper = styled.p`
    text-align: center;
    padding: 12px;
`;

type EntityPageDetailsCardProps = {
    fetchDetailsStatus: AsyncStatus;
    details:
        | McPkgPreview
        | WoPreview
        | Tag
        | PoPreview
        | IpoDetails
        | undefined;
};

const EntityPageDetailsCard = ({
    fetchDetailsStatus,
    details,
}: EntityPageDetailsCardProps): JSX.Element => {
    const { params } = useCommonHooks();
    if (fetchDetailsStatus === AsyncStatus.SUCCESS && details != undefined) {
        if (
            params.searchType === SearchType.MC &&
            isOfType<McPkgPreview>(details, 'mcPkgNo')
        ) {
            return (
                <McDetails
                    key={details.id}
                    mcPkgDetails={details}
                    clickable={false}
                />
            );
        } else if (
            params.searchType === SearchType.WO &&
            isOfType<WoPreview>(details, 'workOrderNo')
        ) {
            return (
                <EntityDetails
                    isDetailsCard={true}
                    icon={<TextIcon color={COLORS.workOrderIcon} text="WO" />}
                    headerText={details.workOrderNo}
                    description={details.title}
                    details={
                        details.disciplineCode
                            ? [
                                  `${details.disciplineCode}, ${details.disciplineDescription}`,
                              ]
                            : undefined
                    }
                />
            );
        } else if (
            params.searchType === SearchType.IPO &&
            isOfType<IpoDetails>(details, 'location')
        ) {
            return (
                <EntityDetails
                    isDetailsCard={true}
                    headerText={params.entityId}
                    description={details.title}
                    details={[details.type, details.projectName]}
                    icon={<TextIcon color={COLORS.ipoIcon} text="IPO" />}
                />
            );
        } else if (
            params.searchType === SearchType.Tag &&
            isOfType<Tag>(details, 'tag')
        ) {
            return (
                <EntityDetails
                    isDetailsCard
                    icon={<TextIcon color={COLORS.tagIcon} text="Tag" />}
                    headerText={details.tag.tagNo}
                    description={details.tag.description}
                />
            );
        } else if (
            params.searchType === SearchType.PO &&
            isOfType<PoPreview>(details, 'callOffId')
        ) {
            return (
                <EntityDetails
                    isDetailsCard
                    icon={
                        <TextIcon color={COLORS.purchaseOrderIcon} text="PO" />
                    }
                    headerText={details.title}
                    description={details.description}
                    details={[details.responsibleCode]}
                />
            );
        } else return <></>;
    } else if (fetchDetailsStatus === AsyncStatus.ERROR) {
        return (
            <DetailsWrapper>
                Unable to load details. Please reload
            </DetailsWrapper>
        );
    } else {
        return (
            <DetailsWrapper>
                <DotProgress color="primary" />
            </DetailsWrapper>
        );
    }
};

export default EntityPageDetailsCard;
