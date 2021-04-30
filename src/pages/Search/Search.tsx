import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button, Search as SearchField } from '@equinor/eds-core-react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import useSearchPageFacade, { SearchStatus } from './useSearchPageFacade';
import SearchResults from './SearchResults/SearchResults';
import Navbar from '../../components/navigation/Navbar';
import PageHeader from '../../components/PageHeader';
import useCommonHooks from '../../utils/useCommonHooks';
import { Link, Redirect, Route, Switch, useParams } from 'react-router-dom';
import SearchArea from './SearchArea/SearchArea';
import { COLORS } from '../../style/GlobalStyles';

const SearchPageWrapper = styled.main`
    padding: 0 4%;
`;

const ButtonsWrapper = styled.div`
    margin-bottom: 5px;
    display: flex;
    height: 60px;
    & > button:not(:last-child) {
        margin-right: 10px;
    }
`;

const SearchTypeButton = styled(Button)<{ active: boolean }>`
    background-color: ${(props): string =>
        props.active ? COLORS.fadedBlue : COLORS.white};
    flex: 1;
    height: 100%;
`;

export enum SearchType {
    SAVED = 'SAVED',
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
}

type McParams = {
    plant: string;
    project: string;
    searchType: string;
};

const Search = (): JSX.Element => {
    const [searchType, setSearchType] = useState<SearchType | undefined>(
        SearchType.SAVED
    );

    const buttonsToRender: JSX.Element[] = [];

    for (const type in SearchType) {
        // TODO: style buttons to look right!
        // TODO: fill button when selected
        if (type != SearchType.SAVED) {
            buttonsToRender.push(
                <SearchTypeButton
                    variant={'outlined'}
                    onClick={(): void => {
                        setSearchType(
                            type === searchType
                                ? SearchType.SAVED
                                : Object.values(SearchType).find(
                                      (x) => x === type
                                  )
                        );
                    }}
                    key={type}
                    active={type === searchType}
                    disabled={type != SearchType.MC}
                >
                    {type}
                </SearchTypeButton>
            );
        }
    }

    const determineComponent = (): JSX.Element => {
        if (searchType === SearchType.SAVED || searchType === undefined) {
            return <></>;
        }
        return <SearchArea searchType={searchType} />;
    };

    return (
        <>
            <Navbar
                leftContent={{
                    name: 'hamburger',
                }}
            />
            <SearchPageWrapper>
                <p>Search for</p>
                <ButtonsWrapper>{buttonsToRender}</ButtonsWrapper>
                {determineComponent()}
            </SearchPageWrapper>
        </>
    );
};

export default withAccessControl(Search, ['COMMPKG/READ']);
