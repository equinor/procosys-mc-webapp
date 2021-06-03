import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../../../style/GlobalStyles';
import { TallSearchField } from '../../../Search/SearchArea/SearchArea';
import usePersonsSearchFacade from './usePersonsSearchFacade';

const PersonsSearchWrapper = styled.div`
    position: fixed;
    left: 0;
    top: 54px;
    z-index: 20;
    height: 100%; // TODO: something better?? it's slightly too long
    width: 92%;
    background-color: ${COLORS.white};
    padding: 16px 4%;
`;

type PersonsSearchProps = {
    onChange: () => void; // TODO: input value types to onChange
};

const PersonsSearch = ({ onChange }: PersonsSearchProps): JSX.Element => {
    const searchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );
    // TODO: use searchStatus to show loading state (?) (see how it's done in SearchPage thing (search area/results))
    const { hits, searchStatus, query, setQuery } = usePersonsSearchFacade();

    useEffect(() => {
        console.log(hits);
    }, [hits]);

    useEffect(() => {
        searchbarRef.current?.focus();
    }, []);
    // TODO: call onChange with pertinent info when user clicks on a search result
    return (
        <PersonsSearchWrapper>
            {
                // TODO: style the above div
            }
            <TallSearchField
                placeholder={''}
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                    setQuery(e.target.value)
                }
                ref={searchbarRef}
            />
            {
                // TODO: add search results
            }
        </PersonsSearchWrapper>
    );
};

export default PersonsSearch;
