import React, { useState } from 'react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import SearchArea from './Searching/SearchArea';
import SavedSearches from './SavedSearches/SavedSearches';
import {
    Navbar,
    ProcosysButton,
    SearchTypeButton,
    useSnackbar,
    NavigationFooter,
    FooterButton,
} from '@equinor/procosys-webapp-components';
import SideMenu from '../../components/navigation/SideMenu';
import { Switch } from '@equinor/eds-core-react';
import useCommonHooks from '../../utils/useCommonHooks';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../../components/icons/EdsIcon';

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

const OfflineBanner = styled.div`
    background: ${COLORS.mossGreen};
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
    const { offlineState, setOfflineState, history, url } = useCommonHooks();

    const determineComponent = (): JSX.Element => {
        if (searchType === undefined) {
            return <SavedSearches setSnackbarText={setSnackbarText} />;
        }
        return <SearchArea searchType={searchType} />;
    };

    return (
        <>
            <OfflineBanner>
                {offlineState ? 'Offline mode active' : undefined}
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
                        offlineState
                            ? 'Deactivate offline mode'
                            : 'Activate offline mode'
                    }
                    onChange={(): void => {
                        setOfflineState((prev) => !prev);
                    }}
                    checked={offlineState ? true : false}
                />

                {snackbar}
            </SearchPageWrapper>
            <NavigationFooter>
                <FooterButton
                    active={!history.location.pathname.includes('/bookmark')}
                    goTo={(): void => history.push(url)}
                    icon={<EdsIcon name="search" color={COLORS.mossGreen} />}
                    label="Search"
                />
                <FooterButton
                    active={history.location.pathname.includes('/bookmark')}
                    goTo={(): void => history.push(`${url}/bookmark`)}
                    icon={
                        <EdsIcon
                            name="bookmark_outlined"
                            color={COLORS.mossGreen}
                        />
                    }
                    label={'Offline bookmarks'}
                    numberOfItems={1}
                />
            </NavigationFooter>
        </>
    );
};

export default withAccessControl(Search, [
    'MCPKG/READ',
    'WO/READ',
    'TAG/READ',
    'PURCHASEORDER/READ',
]);
