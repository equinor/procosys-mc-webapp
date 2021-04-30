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
import { accessible } from '@equinor/eds-icons';
import { Typography } from '@equinor/eds-core-react';
import SearchResult from './SearchResult';

type SearchResultsProps = {
    searchStatus: SearchStatus;
    searchResults: McPkgPreview[]; // TODO: add other previews as props
    searchType: SearchType;
};

const SearchResults = ({
    searchStatus,
    searchResults,
    searchType,
}: SearchResultsProps): JSX.Element => {
    const history = useHistory();

    console.log(searchStatus.valueOf());

    if (searchStatus === SearchStatus.LOADING) {
        return <SkeletonLoadingPage fullWidth />;
    }
    if (searchStatus === SearchStatus.SUCCESS && searchResults.length > 0) {
        return (
            <div>
                {searchResults.map((searchResult) => (
                    <SearchResult
                        key={searchResult.id}
                        searchResult={searchResult}
                        searchType={searchType}
                    />
                ))}
            </div>
        );
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
