import React from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { COLORS } from '../../style/GlobalStyles';
import { SearchType } from './Search';

const SearchTypeButtonWrapper = styled(Button)<{ active: boolean }>`
    background-color: ${(props): string =>
        props.active ? COLORS.fadedBlue : COLORS.white};
    flex: 1;
    height: 100%;
`;

type SearchTypeButtonProps = {
    searchType: SearchType;
    currentSearchType: SearchType | null;
    setCurrentSearchType: React.Dispatch<
        React.SetStateAction<SearchType | null>
    >;
};

const SearchTypeButton = ({
    searchType,
    currentSearchType,
    setCurrentSearchType,
}: SearchTypeButtonProps): JSX.Element => {
    return (
        <SearchTypeButtonWrapper
            variant={'outlined'}
            onClick={(): void => {
                setCurrentSearchType(
                    searchType === currentSearchType ? null : searchType
                );
            }}
            active={searchType === currentSearchType}
            disabled={
                searchType != SearchType.MC && searchType != SearchType.WO
            }
        >
            {searchType}
        </SearchTypeButtonWrapper>
    );
};

export default SearchTypeButton;
