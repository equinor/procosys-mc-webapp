import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Search as SearchField } from '@equinor/eds-core-react';
import useSearchPageFacade from '../useSearchPageFacade';
import SearchResults from './SearchResults';
import { SearchType } from '../Search';
import styled from 'styled-components';
import { TagPhotoRecognition } from '@equinor/procosys-webapp-components';
import useCommonHooks from '../../../utils/useCommonHooks';

export const TallSearchField = styled(SearchField)`
    height: 54px;
    margin-top: 18px;
`;

const SearchAreaWrapper = styled.div`
    position: relative;
`;

type SearchAreaProps = {
    searchType: string;
};

const SearchArea = ({ searchType }: SearchAreaProps): JSX.Element => {
    const searchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );
    const callOffSearchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );
    const { appConfig, offlineState } = useCommonHooks();
    const {
        hits,
        searchStatus,
        query,
        setQuery,
        callOffQuery,
        setCallOffQuery,
    } = useSearchPageFacade(searchType);

    useEffect(() => {
        searchbarRef.current?.focus();
    }, []);

    const getPlaceholderText = (): string => {
        if (searchType === SearchType.MC) {
            return '1002-A001';
        } else if (searchType === SearchType.WO) {
            return '21317165';
        } else {
            return '#M-2601-P013';
        }
    };

    return (
        <SearchAreaWrapper>
            {searchType === SearchType.Tag && offlineState == false ? (
                <TagPhotoRecognition
                    setQuery={setQuery}
                    tagOcrEndpoint={appConfig.ocrFunctionEndpoint}
                />
            ) : null}
            <TallSearchField
                placeholder={
                    searchType === SearchType.PO
                        ? 'Type to search PO no'
                        : `For example: "${getPlaceholderText()}"`
                }
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                    setQuery(e.target.value)
                }
                ref={searchbarRef}
                aria-label="Searchbar"
            />
            {searchType === SearchType.PO ? (
                <TallSearchField
                    placeholder={'Type to search call off no'}
                    value={callOffQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                        setCallOffQuery(e.target.value)
                    }
                    ref={callOffSearchbarRef}
                    aria-label="CallOffSearchbar"
                />
            ) : null}
            <SearchResults
                searchStatus={searchStatus}
                searchResults={hits}
                searchType={searchType}
            />
        </SearchAreaWrapper>
    );
};

export default SearchArea;
