import { Button } from '@equinor/eds-core-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SkeletonLoadingPage from '../../../../components/loading/SkeletonLoader';
import { COLORS } from '../../../../style/GlobalStyles';
import { TallSearchField } from '../../../Search/SearchArea/SearchArea';
import { SearchStatus } from '../../../Search/useSearchPageFacade';
import { ChosenPerson } from '../NewPunch';
import usePersonsSearchFacade from './usePersonsSearchFacade';

const PersonsSearchWrapper = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    z-index: 20;
    height: 100%;
    width: 92%;
    background-color: ${COLORS.white};
    padding: 16px 4%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const StyledButton = styled(Button)`
    align-self: flex-end;
    margin-bottom: 32px;
    min-height: 40px;
`;

const NameWrapper = styled.p`
    display: flex;
    padding: 8px 0;
`;

const Header = styled.h4`
    margin: 0;
`;

type PersonsSearchProps = {
    setChosenPerson: (id: number, name: string) => void;
    setShowPersonSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

const PersonsSearch = ({
    setChosenPerson,
    setShowPersonSearch,
}: PersonsSearchProps): JSX.Element => {
    const searchbarRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );
    const { hits, searchStatus, query, setQuery } = usePersonsSearchFacade();

    useEffect(() => {
        searchbarRef.current?.focus();
    }, []);

    const determineContentToRender = (): JSX.Element => {
        if (searchStatus === SearchStatus.LOADING) {
            return <SkeletonLoadingPage fullWidth />;
        }
        if (searchStatus === SearchStatus.SUCCESS && hits.persons.length > 0) {
            return (
                <div>
                    {hits.persons.map((person) => {
                        return (
                            <NameWrapper
                                key={person.id}
                                onClick={(): void =>
                                    setChosenPerson(
                                        person.id,
                                        `${person.firstName} ${person.lastName}`
                                    )
                                }
                            >
                                {person.firstName} {person.lastName}
                            </NameWrapper>
                        );
                    })}
                </div>
            );
        }
        if (searchStatus === SearchStatus.INACTIVE) {
            return (
                <div>
                    <p>
                        <i>
                            Start typing in the field above to search. <br />
                        </i>
                    </p>
                </div>
            );
        }
        if (searchStatus === SearchStatus.ERROR) {
            return (
                <div>
                    <p>
                        <i>
                            {
                                // TODO: change error message
                            }
                            An error occurred, please refresh this page and try
                            again.
                        </i>
                    </p>
                </div>
            );
        }
        return (
            <div>
                <p>
                    <i>No persons found for this search.</i>
                </p>
            </div>
        );
    };

    return (
        <PersonsSearchWrapper>
            <div>
                <Header>Person Search</Header>
                <TallSearchField
                    placeholder={''}
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                        setQuery(e.target.value)
                    }
                    ref={searchbarRef}
                />
                {determineContentToRender()}
            </div>
            <StyledButton onClick={(): void => setShowPersonSearch(false)}>
                Cancel
            </StyledButton>
        </PersonsSearchWrapper>
    );
};

export default PersonsSearch;
