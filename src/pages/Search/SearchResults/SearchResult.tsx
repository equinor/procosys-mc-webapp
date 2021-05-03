import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../../style/GlobalStyles';
import { McPkgPreview } from '../../../services/apiTypes';
import { SearchType } from '../Search';
import { McPackageStatusIcon } from '../../../components/icons/McPackageStatusIcon';
import { Typography } from '@equinor/eds-core-react';
import { useHistory } from 'react-router';
import { colors } from '@equinor/eds-core-react/dist/types/components/Typography/Typography.tokens';

const SearchResultWrapper = styled.article`
    cursor: pointer;
    display: flex;
    align-items: flex-start;
    border-top: 1px solid ${COLORS.lightGrey};
    padding: 12px;
    margin: 0;
    &:hover {
        opacity: 0.7;
    }
`;

const StatusImageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 12px;
    padding-bottom: 5px;
    & > img {
        height: 20px;
    }
`;

const StatusTextWrapper = styled.div`
    display: flex;
    & > p {
        margin: 0;
    }
`;

const HandoverStatus = styled.p<{ accepted: boolean }>`
    font-weight: bolder;
    font-size: 0.75rem;
    color: ${(props): string =>
        props.accepted ? COLORS.black : COLORS.lightGrey};
`;

const SearchResultDetailsWrapper = styled.div`
    flex-direction: column;
    flex: 1;
    & > p {
        margin-bottom: 0;
        margin-top: 0;
    }
`;

const SearchResultHeaderWrapper = styled.div`
    display: flex;
    align-items: baseline;
    margin-bottom: 0px;
    & > h6 {
        margin: 0;
        flex: 1.4;
        color: ${COLORS.mossGreen};
    }
    & > p {
        margin: 0;
        flex: 1;
        text-align: right;
    }
`;

type SearchResultProps = {
    searchType: SearchType;
    searchResult: McPkgPreview;
};

// TODO: decide whether this should be used for all search types or whether it should just be used for MC search
const SearchResult = ({
    searchResult,
    searchType,
}: SearchResultProps): JSX.Element => {
    const history = useHistory();

    if (searchType === SearchType.MC) {
        return (
            <SearchResultWrapper
                onClick={(): void => history.push(`MC/${searchResult.id}`)}
                key={searchResult.id}
            >
                <StatusImageWrapper>
                    <McPackageStatusIcon status={searchResult.status} />
                    <StatusTextWrapper>
                        <HandoverStatus
                            accepted={
                                searchResult.commissioningHandoverStatus ==
                                'ACCEPTED'
                            }
                        >
                            C
                        </HandoverStatus>
                        <HandoverStatus
                            accepted={
                                searchResult.operationHandoverStatus ==
                                'ACCEPTED'
                            }
                        >
                            O
                        </HandoverStatus>
                    </StatusTextWrapper>
                </StatusImageWrapper>
                <SearchResultDetailsWrapper>
                    <SearchResultHeaderWrapper>
                        <h6>{searchResult.mcPkgNo}</h6>
                        <Typography variant="caption">
                            {searchResult.commPkgNo}
                        </Typography>
                        <Typography variant="caption">
                            {searchResult.responsibleCode}
                        </Typography>
                    </SearchResultHeaderWrapper>
                    <Typography variant="caption">
                        {searchResult.description}
                    </Typography>
                    <Typography variant="caption">
                        {searchResult.phaseCode}
                    </Typography>
                </SearchResultDetailsWrapper>
            </SearchResultWrapper>
        );
    } else {
        return <></>;
    }
};

export default SearchResult;
