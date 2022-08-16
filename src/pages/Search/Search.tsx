import React, { useState } from 'react';
import SavedSearches from './SavedSearches/SavedSearches';
import { SearchTypeButton } from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import SearchArea from './Searching/SearchArea';
import { SearchType } from './SearchPage';

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

    const determineComponent = (): JSX.Element => {
        if (searchType === undefined) {
            return <SavedSearches setSnackbarText={setSnackbarText} />;
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
                />
                <SearchTypeButton
                    searchType={SearchType.MC}
                    currentSearchType={searchType}
                    setCurrentSearchType={setSearchType}
                />
                <SearchTypeButton
                    searchType={SearchType.WO}
                    currentSearchType={searchType}
                    setCurrentSearchType={setSearchType}
                />
                <SearchTypeButton
                    searchType={SearchType.Tag}
                    currentSearchType={searchType}
                    setCurrentSearchType={setSearchType}
                />
            </ButtonsWrapper>
            {determineComponent()}
        </>
    );
};

export default Search;
