import React, { ChangeEvent, useEffect, useRef } from 'react';
import { Search as SearchField } from '@equinor/eds-core-react';
import useSearchPageFacade from '../useSearchPageFacade';
import SearchResults from '../SearchResults/SearchResults';

const SearchArea = (): JSX.Element => {
    const searchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );
    const { hits, searchStatus, query, setQuery } = useSearchPageFacade();

    useEffect(() => {
        searchbarRef.current?.focus();
    }, []);

    return (
        <>
            {
                // TODO: Change placeholder based on search type
            }
            <SearchField
                placeholder={'For example: "1002-D01"'}
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                    setQuery(e.target.value)
                }
                ref={searchbarRef}
            />
            {
                // TODO: pass needed props
            }
            <SearchResults
                commPackages={hits.items}
                searchStatus={searchStatus}
            />
        </>
    );
};

export default SearchArea;
