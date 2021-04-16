import React, { ChangeEvent, useEffect, useRef } from 'react';
import { Search as SearchField } from '@equinor/eds-core-react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import useSearchPageFacade, { SearchStatus } from './useSearchPageFacade';
import SearchResults from './SearchResults/SearchResults';
import Navbar from '../../components/navigation/Navbar';
import PageHeader from '../../components/PageHeader';

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

const Search = (): JSX.Element => {
    const { hits, searchStatus, query, setQuery } = useSearchPageFacade();
    const searchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );

    useEffect(() => {
        searchbarRef.current?.focus();
    }, []);

    const searchHeaderToRender = (): JSX.Element => {
        if (searchStatus === SearchStatus.SUCCESS) {
            return (
                <h4>
                    Displaying {hits.items.length} out of {hits.maxAvailable}{' '}
                    packages
                </h4>
            );
        }
        if (searchStatus === SearchStatus.LOADING) {
            return <h4>Loading</h4>;
        }
        return <PageHeader title="Search" subtitle="Find a comm. pkg" />;
    };
    return (
        <>
            <Navbar leftContent={{ name: 'back', label: 'Bookmarks' }} />
            <SearchPageWrapper>
                {searchHeaderToRender()}
                <SearchField
                    placeholder={'For example: "1002-D01"'}
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                        setQuery(e.target.value)
                    }
                    ref={searchbarRef}
                />
                <SearchResults
                    commPackages={hits.items}
                    searchStatus={searchStatus}
                />
            </SearchPageWrapper>
        </>
    );
};

export default withAccessControl(Search, ['COMMPKG/READ']);
