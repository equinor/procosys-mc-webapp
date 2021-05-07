import React from 'react';
import styled from 'styled-components';
import { Caption, COLORS } from '../../../style/GlobalStyles';
import { McPkgPreview } from '../../../services/apiTypes';
import { SearchType } from '../Search';
import { McPackageStatusIcon } from '../../../components/icons/McPackageStatusIcon';
import useCommonHooks from '../../../utils/useCommonHooks';

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
        margin: 0;
    }
`;

const SearchResultHeaderWrapper = styled.div`
    display: flex;
    align-items: baseline;
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
    const { history, url } = useCommonHooks();

    if (searchType === SearchType.MC) {
        return (
            <SearchResultWrapper
                onClick={(): void =>
                    history.push(`${url}/MC/${searchResult.mcPkgNo}`)
                }
                key={searchResult.mcPkgNo}
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
                        <Caption>{searchResult.commPkgNo}</Caption>
                        <Caption>{searchResult.responsibleCode}</Caption>
                    </SearchResultHeaderWrapper>
                    <Caption>{searchResult.description}</Caption>
                    <Caption>{searchResult.phaseCode}</Caption>
                </SearchResultDetailsWrapper>
            </SearchResultWrapper>
        );
    } else {
        return <></>;
    }
};

export default SearchResult;
