import { Search } from '@equinor/eds-core-react';
import React from 'react';

type PersonsSearchProps = {
    onChange: () => void; // TODO: input value types to onChange
};

const PersonsSearch = ({ onChange }: PersonsSearchProps): JSX.Element => {
    // TODO: use useRef thingy to autofocus on the search field
    // TODO: make the search field something similar to the search thing from the search page, but with persons search instead
    // TODO: render search results in a list below the search field
    // TODO: call onChange with pertinent info when user clicks on a search result
    return (
        <div>
            {
                // TODO: style the above div
            }
            {
                // TODO: should the search field be the tall search field used in the search page??
            }
            <Search />
            {
                // TODO: add search results
            }
        </div>
    );
};

export default PersonsSearch;
