import React, { useState } from 'react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import Navbar from '../../components/navigation/Navbar';
import SearchArea from './SearchArea/SearchArea';
import SearchTypeButton from './SearchTypeButton';

const SearchPageWrapper = styled.main`
    padding: 0 4%;
`;

const ButtonsWrapper = styled.div`
    margin-bottom: 10px;
    display: flex;
    height: 60px;
    & > button:not(:last-child) {
        margin-right: 10px;
    }
`;

export enum SearchType {
    SAVED = 'SAVED',
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
}

const Search = (): JSX.Element => {
    const [searchType, setSearchType] = useState<SearchType>(SearchType.SAVED);

    const determineComponent = (): JSX.Element => {
        if (searchType === SearchType.SAVED || searchType === undefined) {
            return <></>;
        }
        return <SearchArea searchType={searchType} />;
    };

    return (
        <>
            <Navbar
                leftContent={{
                    name: 'hamburger',
                }}
            />
            <SearchPageWrapper>
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
            </SearchPageWrapper>
        </>
    );
};

export default withAccessControl(Search, ['MCPKG/READ']);
