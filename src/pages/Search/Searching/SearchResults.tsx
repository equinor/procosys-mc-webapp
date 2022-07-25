import React from 'react';
import { SearchStatus } from '../useSearchPageFacade';
import {
    McPkgPreview,
    PoPreview,
    SearchResults as SearchResultsType,
    TagPreview,
    WoPreview,
} from '../../../services/apiTypes';
import McDetails from '../../../components/detailCards/McDetails';
import styled from 'styled-components';
import { isArrayOfType } from '../../../services/apiTypeGuards';
import useCommonHooks from '../../../utils/useCommonHooks';
import { COLORS } from '../../../style/GlobalStyles';
import {
    EntityDetails,
    SkeletonLoadingPage,
    TextIcon,
} from '@equinor/procosys-webapp-components';
import { SearchType } from '../../../typings/enums';

const SearchResultAmountWrapper = styled.h6`
    margin: 10px 0px;
`;

type SearchResultsProps = {
    searchStatus: SearchStatus;
    searchResults: SearchResultsType;
    searchType: string;
};

const SearchResults = ({
    searchStatus,
    searchResults,
    searchType,
}: SearchResultsProps): JSX.Element => {
    const { history, url } = useCommonHooks();

    const getPlaceholderTextType = (): string => {
        if (searchType === SearchType.MC) {
            return 'MC Package number';
        } else if (searchType === SearchType.WO) {
            return 'Work Order number';
        } else if (searchType === SearchType.Tag) {
            return 'Tag number';
        } else {
            return 'Purchase Order number and/or call off number';
        }
    };

    const getSearchResultType = (): string => {
        if (searchType === SearchType.MC) {
            return 'MC packages';
        } else if (searchType === SearchType.WO) {
            return 'Work Orders';
        } else if (searchType === SearchType.Tag) {
            return 'Tags';
        } else {
            return 'Purchase Orders';
        }
    };

    const determineContentToRender = (): JSX.Element => {
        if (
            searchType === SearchType.MC &&
            isArrayOfType<McPkgPreview>(searchResults.items, 'mcPkgNo')
        ) {
            return (
                <>
                    {searchResults.items.map((searchResult) => {
                        return (
                            <McDetails
                                key={searchResult.id}
                                mcPkgDetails={searchResult}
                            />
                        );
                    })}
                </>
            );
        } else if (
            searchType === SearchType.WO &&
            isArrayOfType<WoPreview>(searchResults.items, 'workOrderNo')
        ) {
            return (
                <>
                    {searchResults.items.map((searchResult) => {
                        return (
                            <EntityDetails
                                key={searchResult.id}
                                icon={
                                    <TextIcon
                                        color={COLORS.workOrderIcon}
                                        text="WO"
                                    />
                                }
                                headerText={searchResult.workOrderNo}
                                description={searchResult.title}
                                details={
                                    searchResult.disciplineCode
                                        ? [
                                              `${searchResult.disciplineCode}, ${searchResult.disciplineDescription}`,
                                          ]
                                        : undefined
                                }
                                onClick={(): void =>
                                    history.push(`${url}/WO/${searchResult.id}`)
                                }
                            />
                        );
                    })}
                </>
            );
        } else if (
            searchType === SearchType.Tag &&
            isArrayOfType<TagPreview>(searchResults.items, 'tagNo')
        ) {
            return (
                <>
                    {searchResults.items.map((searchResult) => {
                        return (
                            <EntityDetails
                                key={searchResult.id}
                                icon={
                                    <TextIcon
                                        color={COLORS.tagIcon}
                                        text="Tag"
                                    />
                                }
                                headerText={searchResult.tagNo}
                                description={searchResult.description}
                                onClick={(): void =>
                                    history.push(
                                        `${url}/Tag/${searchResult.id}`
                                    )
                                }
                            />
                        );
                    })}
                </>
            );
        } else if (
            searchType === SearchType.PO &&
            isArrayOfType<PoPreview>(searchResults.items, 'isPurchaseOrder')
        ) {
            return (
                <>
                    {searchResults.items.map((searchResult) => {
                        return (
                            <EntityDetails
                                key={searchResult.callOffId}
                                icon={
                                    <TextIcon
                                        color={COLORS.purchaseOrderIcon}
                                        text="PO"
                                    />
                                }
                                headerText={searchResult.title}
                                description={searchResult.description}
                                details={[searchResult.responsibleCode]}
                                onClick={(): void =>
                                    history.push(
                                        `${url}/PO/${searchResult.callOffId}`
                                    )
                                }
                            />
                        );
                    })}
                </>
            );
        }
        return <></>;
    };

    if (searchType in SearchType === false) {
        return (
            <div>
                <p>
                    <i>
                        The chosen search type is not supported. Please choose a
                        supported search type by clicking one of the buttons
                        above.
                    </i>
                </p>
            </div>
        );
    } else if (
        searchStatus === SearchStatus.SUCCESS &&
        searchResults.items.length > 0
    ) {
        return (
            <div>
                <SearchResultAmountWrapper>
                    Displaying {searchResults.items.length} out of{' '}
                    {searchResults.maxAvailable} {getSearchResultType()}
                </SearchResultAmountWrapper>
                {determineContentToRender()}
            </div>
        );
    } else if (searchStatus === SearchStatus.LOADING) {
        return <SkeletonLoadingPage fullWidth />;
    } else if (searchStatus === SearchStatus.INACTIVE) {
        return (
            <div>
                <p>
                    <i>
                        Start typing your {getPlaceholderTextType()} in the
                        field{searchType === SearchType.PO ? 's' : ''} above.
                    </i>
                </p>
            </div>
        );
    } else if (searchStatus === SearchStatus.ERROR) {
        return (
            <div>
                <p>
                    <i>
                        An error occurred, please refresh this page and try
                        again.
                    </i>
                </p>
            </div>
        );
    } else {
        return (
            <div>
                <p>
                    <i>No {getSearchResultType()} found for this search.</i>
                </p>
            </div>
        );
    }
};

export default SearchResults;
