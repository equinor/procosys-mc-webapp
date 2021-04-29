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
    padding-right: 12px;
    & img {
        height: 20px;
    }
`;

const SearchResultDetailsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: red;
    & p {
        margin-bottom: 0;
        margin-top: 0;
    }
`;

const SearchResultHeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    background-color: blue;
    margin-bottom: 6;
    & h6 {
        margin: 0;
        flex: 1.5;
        background-color: yellow;
    }
    & p {
        margin: 0;
        flex: 1;
        text-align: center;
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
            <div>
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
                                <SearchResultDetailsWrapper>
                                    <SearchResultHeaderWrapper>
                                        <h6>{searchResult.mcPkgNo}</h6>
                                        <p>{searchResult.commPkgNo}</p>
                                        <p>{searchResult.responsibleCode}</p>
                                    </SearchResultHeaderWrapper>
                                    <p>{searchResult.description}</p>
                                    <p>{searchResult.phaseCode} bad</p>
                                </SearchResultDetailsWrapper>
                            </SearchResult>
                        );
                    }
                })}
            </div>
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
            <div>
                <p>
                    <i>
                        Start typing your Commissioning Package number in the
                        field above. <br />
                    </i>
                </p>
            </div>
        );
    }

    if (searchStatus === SearchStatus.ERROR) {
        return (
            <div>
                <p>
                    <i>
                        An error occurred, please refresh this page and try
                        again.
                    </i>
                </p>
            </div>
        );
    }

    return (
        <div>
            <p>
                <i>No packages found for this search.</i>
            </p>
        </div>
    );
};

export default SearchResults;
