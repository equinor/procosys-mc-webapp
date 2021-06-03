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
    top: 54px;
    z-index: 20;
    height: 100%; // TODO: something better?? it's slightly too long
    width: 92%;
    background-color: ${COLORS.white};
    padding: 16px 4%;
`;

type PersonsSearchProps = {
    onChange: React.Dispatch<React.SetStateAction<ChosenPerson>>;
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

    const determineContentToRender = (): JSX.Element => {
        if (searchStatus === SearchStatus.LOADING) {
            return <SkeletonLoadingPage fullWidth />;
        }
        if (searchStatus === SearchStatus.SUCCESS && hits.persons.length > 0) {
            return (
                <div>
                    {hits.persons.map((person) => {
                        return (
                            <>
                                <p>Name of person</p>
                                {
                                    // TODO: add content here
                                }
                            </>
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
                            {
                                // TODO: change, as it doesn't have to be a name they search for
                            }
                            Start typing a name in the field above. <br />
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
                    {
                        // TODO: change empty message
                    }
                    <i>No persons found for this search.</i>
                </p>
            </div>
        );
    };

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
            {determineContentToRender()}
        </PersonsSearchWrapper>
    );
};

export default PersonsSearch;
