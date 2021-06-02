import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../../../style/GlobalStyles';
import { TallSearchField } from '../../../Search/SearchArea/SearchArea';

const PersonsSearchWrapper = styled.div`
    position: fixed;
    left: 0;
    top: 54px;
    height: 100%; // TODO: something better?? it's slightly too long
    width: 92%;
    background-color: ${COLORS.white};
    padding: 16px 4%;
`;

type PersonsSearchProps = {
    onChange: () => void; // TODO: input value types to onChange
};

const PersonsSearch = ({ onChange }: PersonsSearchProps): JSX.Element => {
    // TODO: make the search field something similar to the search thing from the search page, but with persons search instead
    const [query, setQuery] = useState<string>('');
    const searchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );

    useEffect(() => {
        searchbarRef.current?.focus();
    }, []);

    // TODO: render search results in a list below the search field
    // TODO: call onChange with pertinent info when user clicks on a search result
    return (
        <PersonsSearchWrapper>
            {
                // TODO: style the above div
            }
            {
                // TODO: should the search field be the tall search field used in the search page??
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
