import { Button } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { SavedSearch, ApiSavedSearchType } from '../../../services/apiTypes';
import { Caption, COLORS } from '../../../style/GlobalStyles';
import useCommonHooks from '../../../utils/useCommonHooks';

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

const DeleteButton = styled(Button)`
    padding: 3px 0 0 0;
    margin: 0 0 0 16px;
    width: 24px;
    height: 24px;
`;

const IconWrapper = styled.div`
    padding-top: 3px;
    margin-right: 16px;
`;

export enum SavedSearchType {
    CHECKLIST = 'checklist',
    PUNCH = 'punch',
}

type SavedSearchProps = {
    search: SavedSearch;
    deleteSavedSearch: React.Dispatch<React.SetStateAction<number>>;
    deleteSavedSearchStatus: AsyncStatus;
};

const SavedSearchResult = ({
    search,
    deleteSavedSearch,
    deleteSavedSearchStatus,
}: SavedSearchProps): JSX.Element => {
    const { history, url } = useCommonHooks();

    const determineIcon = (): JSX.Element => {
        if (search.type === ApiSavedSearchType.CHECKLIST) {
            return <EdsIcon name="playlist_added" />;
        } else {
            return <EdsIcon name="warning_outlined" />;
        }
    };

    return (
        <SavedSearchWrapper
            role="link"
            onClick={(): void =>
                history.push(
                    `${url}/saved-search/${
                        search.type === ApiSavedSearchType.CHECKLIST
                            ? 'checklist'
                            : 'punch'
                    }/${search.id}`
                )
            }
        >
            <IconWrapper>{determineIcon()}</IconWrapper>
            <ContentWrapper>
                <h6>{search.name}</h6>
                <Caption>{search.description}</Caption>
            </ContentWrapper>
            <DeleteButton
                aria-label="Delete saved search"
                onClick={(e): void => {
                    e.stopPropagation();
                    deleteSavedSearch(search.id);
                }}
                variant="ghost_icon"
                disabled={deleteSavedSearchStatus === AsyncStatus.LOADING}
            >
                <EdsIcon name="delete_to_trash" color={COLORS.danger} />
            </DeleteButton>
        </SavedSearchWrapper>
    );
};

export default SavedSearchResult;
