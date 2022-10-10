import React, { useState } from 'react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import SearchArea from './Searching/SearchArea';
import SavedSearches from './SavedSearches/SavedSearches';
import OutstandingIpos from '../../components/OutstandingIpos';

import {
    Navbar,
    ProcosysButton,
    SearchTypeButton,
    useSnackbar,
} from '@equinor/procosys-webapp-components';
import SideMenu from '../../components/navigation/SideMenu';

const SearchPageWrapper = styled.main`
    padding: 0 4%;
    margin: 0;
    & > p {
        margin: 0;
        padding: 16px 0;
    }
`;

const ButtonsWrapper = styled.div`
    display: flex;
    height: 60px;
    & > button:not(:last-child) {
        margin-right: 10px;
    }
`;

export enum SearchType {
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
    IPO = 'IPO',
}

const Search = (): JSX.Element => {
    const [searchType, setSearchType] = useState<string>();
    const { snackbar, setSnackbarText } = useSnackbar();

    const determineComponent = (): JSX.Element => {
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
        <SearchPageWrapper>
            <Navbar
                leftContent={<ProcosysButton />}
                rightContent={<SideMenu />}
            />
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
            {snackbar}
        </SearchPageWrapper>
    );
};

export default withAccessControl(Search, [
    'MCPKG/READ',
    'WO/READ',
    'TAG/READ',
    'PURCHASEORDER/READ',
]);
