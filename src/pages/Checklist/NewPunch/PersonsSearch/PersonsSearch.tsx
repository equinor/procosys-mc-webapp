import { Button } from '@equinor/eds-core-react';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import styled from 'styled-components';
import SkeletonLoadingPage from '../../../../components/loading/SkeletonLoader';
import { COLORS } from '../../../../style/GlobalStyles';
import { TallSearchField } from '../../../Search/SearchArea/SearchArea';
import { SearchStatus } from '../../../Search/useSearchPageFacade';
import usePersonsSearchFacade from './usePersonsSearchFacade';

const PersonsSearchWrapper = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    z-index: 20;
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    background-color: ${COLORS.white};
    padding: 16px 4% 66px 4%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const StyledButton = styled(Button)`
    align-self: flex-end;
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
    setChosenPerson: (id: number, firstName: string, lastName: string) => void;
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

    const messageToUser = (message: string): JSX.Element => {
        return (
            <div>
                <p>
                    <i>{message}</i>
                </p>
            </div>
        );
    };

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
                                role="button"
                                onClick={(): void =>
                                    setChosenPerson(
                                        person.id,
                                        person.firstName,
                                        person.lastName
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
            return messageToUser('Start typing in the field above to search');
        }
        if (searchStatus === SearchStatus.ERROR) {
            return messageToUser(
                'An error occurred, please refresh this page and try again.'
            );
        }
        return messageToUser('No persons found for this search.');
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
