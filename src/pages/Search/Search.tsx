import React, { useState } from 'react';
import withAccessControl from '../../services/withAccessControl';
import styled, { withTheme } from 'styled-components';
import SearchArea from './Searching/SearchArea';
import SavedSearches from './SavedSearches/SavedSearches';
import {
    Navbar,
    ProcosysButton,
    SearchTypeButton,
    useSnackbar,
} from '@equinor/procosys-webapp-components';
import SideMenu from '../../components/navigation/SideMenu';
import { Switch } from '@equinor/eds-core-react';
import useCommonHooks from '../../utils/useCommonHooks';

const SearchPageWrapper = styled.main`
    padding: 0 4%;
    margin: 0;
    & > p {
        margin: 0;
        padding: 16px 0;
    }
`;

const ButtonsWrapper = styled.div<{
    isDetailsCard?: boolean;
    isScope?: boolean;
}>`
    display: flex;
    height: 60px;
    & > button:not(:last-child) {
        margin-right: 10px;
    }
`;

const OfflineBanner = styled.div`
    background: #e63535;
    color: white;
    text-align: center;
    font-weight: bold;
`;

export enum SearchType {
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
}

const Search = (): JSX.Element => {
    const [searchType, setSearchType] = useState<string>();
    const { snackbar, setSnackbarText } = useSnackbar();
    const [toggleOffline, setToggleOffline] = useState<boolean>(false);
    const { setOfflineState } = useCommonHooks();

    const determineComponent = (): JSX.Element => {
        if (searchType === undefined) {
            return <SavedSearches setSnackbarText={setSnackbarText} />;
        }
        return <SearchArea searchType={searchType} />;
    };

    return (
        <>
            <OfflineBanner>
                {toggleOffline ? 'Offline mode active' : undefined}
            </OfflineBanner>

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
                <Switch
                    label={
                        toggleOffline
                            ? 'Deactivate offline mode'
                            : 'Activate offline mode'
                    }
                    onClick={(): void => {
                        setToggleOffline(!toggleOffline);
                        setOfflineState((prev) => !prev);
                    }}
                />
                {snackbar}
            </SearchPageWrapper>
        </>
    );
};

export default withAccessControl(Search, [
    'MCPKG/READ',
    'WO/READ',
    'TAG/READ',
    'PURCHASEORDER/READ',
]);
