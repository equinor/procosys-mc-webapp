import { Button } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import { IconWrapper } from '../../../components/detailCards/EntityDetails';
import EdsIcon from '../../../components/icons/EdsIcon';
import { SavedSearch, SavedSearchType } from '../../../services/apiTypes';
import { Caption, COLORS } from '../../../style/GlobalStyles';

const SavedSearchWrapper = styled.article`
    cursor: pointer;
    display: flex;
    padding: 16px 0px;
    margin: 0;
    text-decoration: none;
    &:hover {
        opacity: 0.7;
    }
`;

const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    & > h6 {
        margin: 0;
        color: ${COLORS.mossGreen};
    }
    & > p {
        margin: 0;
    }
`;

const DeleteButtonWrapper = styled.div`
    padding-top: 3px;
    margin-left: 16px;
`;

type SavedSearchProps = {
    search: SavedSearch;
    deleteSavedSearch: (id: number) => void;
};

const SavedSearchResult = ({
    search,
    deleteSavedSearch,
}: SavedSearchProps): JSX.Element => {
    const determineIcon = (): JSX.Element => {
        if (search.type === SavedSearchType.CHECKLIST) {
            return <EdsIcon name="playlist_added" />;
        } else {
            return <EdsIcon name="warning_outlined" />;
        }
    };

    return (
        <SavedSearchWrapper
            role="link"
            onClick={(): void => console.log('route to new page')}
        >
            <IconWrapper>{determineIcon()}</IconWrapper>
            <ContentWrapper>
                <h6>{search.name}</h6>
                <Caption>{search.description}</Caption>
            </ContentWrapper>
            <DeleteButtonWrapper
                role="button"
                aria-label="Delete saved search"
                onClick={(e): void => {
                    e.stopPropagation();
                    deleteSavedSearch(search.id);
                }}
            >
                <EdsIcon name="delete_forever" color={COLORS.mossGreen} />
            </DeleteButtonWrapper>
        </SavedSearchWrapper>
    );
};

export default SavedSearchResult;
