import React, { ChangeEvent, useEffect, useRef } from 'react';
import { Search as SearchField } from '@equinor/eds-core-react';
import useSearchPageFacade from '../useSearchPageFacade';
import SearchResults from '../SearchResults/SearchResults';
import { SearchType } from '../Search';

type SearchAreaProps = {
    searchType: SearchType;
};

const SearchArea = ({ searchType }: SearchAreaProps): JSX.Element => {
    const searchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );
    const { hits, searchStatus, query, setQuery } = useSearchPageFacade(
        searchType
    );

    useEffect(() => {
        searchbarRef.current?.focus();
    }, []);

    const getPlaceholderText = (): string => {
        if (searchType === SearchType.MC) {
            return '1002-A001';
        }
        return '';
    };

    return (
        <>
            <SearchField
                placeholder={`For example: "${getPlaceholderText()}"`}
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                    setQuery(e.target.value)
                }
                ref={searchbarRef}
            />
            <SearchResults
                searchStatus={searchStatus}
                searchResults={hits}
                searchType={searchType}
            />
        </>
    );
};

export default SearchArea;
