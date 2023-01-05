import React, { useState } from 'react';
import SavedSearches from './SavedSearches/SavedSearches';
import SearchArea from './Searching/SearchArea';
import styled from 'styled-components';
import { OfflineStatus, SearchType } from '../../typings/enums';
import useCommonHooks from '../../utils/useCommonHooks';
import OutstandingIpos from '../../components/OutstandingIpos';
import { SearchTypeButton } from '@equinor/procosys-webapp-components';

const ButtonsWrapper = styled.div`
    display: flex;
    height: 60px;
    & > button:not(:last-child) {
        margin-right: 10px;
    }
`;

interface SearchProps {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
}

const Search = ({ setSnackbarText }: SearchProps): JSX.Element => {
    const [searchType, setSearchType] = useState<string>();
    const { offlineState } = useCommonHooks();

    const determineComponent = (): JSX.Element => {
        if (offlineState === OfflineStatus.OFFLINE)
            return <SavedSearches setSnackbarText={setSnackbarText} />;
        if (searchType === undefined) {
            return (
                <>
                    <SavedSearches setSnackbarText={setSnackbarText} />{' '}
                    <OutstandingIpos />{' '}
                </>
            );
        }
        return <SearchArea searchType={searchType} />;
    };

    return (
        <>
            <p>Search for</p>
            <ButtonsWrapper>
                <SearchTypeButton
                    searchType={SearchType.PO}
                    currentSearchType={searchType}
                    setCurrentSearchType={setSearchType}
                    disabled={offlineState == OfflineStatus.OFFLINE}
                />
                <SearchTypeButton
                    searchType={SearchType.MC}
                    currentSearchType={searchType}
                    setCurrentSearchType={setSearchType}
                    disabled={offlineState == OfflineStatus.OFFLINE}
                />
                <SearchTypeButton
                    searchType={SearchType.WO}
                    currentSearchType={searchType}
                    setCurrentSearchType={setSearchType}
                    disabled={offlineState == OfflineStatus.OFFLINE}
                />
                <SearchTypeButton
                    searchType={SearchType.Tag}
                    currentSearchType={searchType}
                    setCurrentSearchType={setSearchType}
                    disabled={offlineState == OfflineStatus.OFFLINE}
                />
            </ButtonsWrapper>
            {determineComponent()}
        </>
    );
};

export default Search;
