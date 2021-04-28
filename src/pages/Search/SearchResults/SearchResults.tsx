import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { SearchStatus } from '../useSearchPageFacade';
import { McPkgPreview } from '../../../services/apiTypes';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import { McPackageStatusIcon } from '../../../components/icons/McPackageStatusIcon';
import { COLORS } from '../../../style/GlobalStyles';
import Search, { SearchType } from '../Search';
import useCommonHooks from '../../../utils/useCommonHooks';

const SearchResult = styled.article`
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    border-top: 1px solid ${COLORS.lightGrey};
    & p {
        flex: auto;
        width: 200px;
    }
    & h6 {
        margin: 12px;
        white-space: nowrap;
        width: 120px;
    }
    &:hover {
        opacity: 0.7;
    }
`;

const SearchResultsWrapper = styled.div`
    width: 100%;
`;

const StatusImageWrapper = styled.div`
    display: flex;
    padding: 12px;
    & img {
        height: 20px;
        margin-left: -2px;
    }
`;

type SearchResultsProps = {
    searchStatus: SearchStatus;
    searchResults: McPkgPreview[]; // TODO: add other previews as props
    searchType: SearchType;
};

{
    // TODO: change to work for all search types
}

const SearchResults = ({
    searchStatus,
    searchResults,
    searchType,
}: SearchResultsProps): JSX.Element => {
    const history = useHistory();

    const determineSearchResultType = (): JSX.Element => {
        return (
            <SearchResultsWrapper>
                {searchResults.map((searchResult) => {
                    if (searchType === SearchType.MC) {
                        return (
                            <SearchResult
                                onClick={(): void =>
                                    history.push(`MC/${searchResult.id}`)
                                }
                                key={searchResult.id}
                            >
                                <StatusImageWrapper>
                                    <McPackageStatusIcon
                                        status={searchResult.status}
                                    />
                                    {
                                        // TODO: figure out where the C & O comes from and add here (?)
                                    }
                                </StatusImageWrapper>
                                <h6>{searchResult.mcPkgNo}</h6>
                                <p>{searchResult.commPkgNo}</p>
                                <p>{searchResult.responsibleCode}</p>
                                <p>{searchResult.description}</p>
                                <p>{searchResult.phaseCode}</p>
                            </SearchResult>
                        );
                    }
                })}
            </SearchResultsWrapper>
        );
    };

    if (searchStatus === SearchStatus.LOADING) {
        return <SkeletonLoadingPage fullWidth />;
    }
    if (searchStatus === SearchStatus.SUCCESS && searchResults.length > 0) {
        return determineSearchResultType(); // TODO: determine if the content of the function should just be moved here
    }
    if (searchStatus === SearchStatus.INACTIVE) {
        return (
            <SearchResultsWrapper>
                <p>
                    <i>
                        Start typing your Commissioning Package number in the
                        field above. <br />
                    </i>
                </p>
            </SearchResultsWrapper>
        );
    }

    if (searchStatus === SearchStatus.ERROR) {
        return (
            <SearchResultsWrapper>
                <p>
                    <i>
                        An error occurred, please refresh this page and try
                        again.
                    </i>
                </p>
            </SearchResultsWrapper>
        );
    }

    return (
        <SearchResultsWrapper>
            <p>
                <i>No packages found for this search.</i>
            </p>
        </SearchResultsWrapper>
    );
};

export default SearchResults;
