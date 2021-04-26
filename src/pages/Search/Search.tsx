import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Search as SearchField } from '@equinor/eds-core-react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import useSearchPageFacade, { SearchStatus } from './useSearchPageFacade';
import SearchResults from './SearchResults/SearchResults';
import Navbar from '../../components/navigation/Navbar';
import PageHeader from '../../components/PageHeader';
import useCommonHooks from '../../utils/useCommonHooks';
import { Redirect, Route, Switch } from 'react-router-dom';

const SearchPageWrapper = styled.main`
    padding: 0 4%;
    & h4 {
        text-align: center;
    }
    & span {
        height: 60px;
        margin-bottom: 10px;
    }
`;

export enum SearchType {
    SAVED,
    PO = 'PO',
    MC = 'MC',
    WO = 'WO nr',
    TAG = 'tag nr',
}

export const getSearchType = (param: string): SearchType => {
    switch (param) {
        case 'POSearch':
            return SearchType.PO;
        case 'MCSearch':
            return SearchType.MC;
        case 'WOSearch':
            return SearchType.WO;
        case 'TagSearch':
            return SearchType.TAG;
        default:
            return SearchType.SAVED;
    }
};

const Search = (): JSX.Element => {
    const { path, params } = useCommonHooks();
    const [searchType, setSearchType] = useState(
        params.searchType ? getSearchType(params.searchType) : SearchType.SAVED
    );

    return (
        <>
            <Navbar
                leftContent={{
                    name:
                        searchType === SearchType.SAVED ? 'hamburger' : 'back',
                }}
            />
            <SearchPageWrapper>
                {
                    // TODO: add buttons and other stuff that should be the same for both search views (buttons)
                }
                {
                    // TODO: add a router that routes to different components based on url info
                }
            </SearchPageWrapper>
        </>
    );
};

export default withAccessControl(Search, ['COMMPKG/READ']);
