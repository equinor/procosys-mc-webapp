import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { SearchStatus } from '../useSearchPageFacade';
import { CommPkgPreview } from '../../../services/apiTypes';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import { PackageStatusIcon } from '../../../components/icons/PackageStatusIcon';
import { COLORS } from '../../../style/GlobalStyles';

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
    commPackages: CommPkgPreview[];
};

const SearchResults = ({
    searchStatus,
    commPackages,
}: SearchResultsProps): JSX.Element => {
    const history = useHistory();
    if (searchStatus === SearchStatus.LOADING) {
        return <SkeletonLoadingPage fullWidth />;
    }
    if (searchStatus === SearchStatus.SUCCESS && commPackages.length > 0) {
        return (
            <SearchResultsWrapper>
                {commPackages.map((commPackage) => {
                    return (
                        <SearchResult
                            onClick={(): void =>
                                history.push(`${commPackage.id}`)
                            }
                            key={commPackage.id}
                        >
                            <StatusImageWrapper>
                                <PackageStatusIcon
                                    mcStatus={commPackage.mcStatus}
                                    commStatus={commPackage.commStatus}
                                />
                            </StatusImageWrapper>

                            <h6>{commPackage.commPkgNo}</h6>
                            <p>{commPackage.description}</p>
                        </SearchResult>
                    );
                })}
            </SearchResultsWrapper>
        );
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
