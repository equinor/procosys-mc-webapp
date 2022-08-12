import {
    EntityDetails,
    isArrayOfType,
    TextIcon,
} from '@equinor/procosys-webapp-components';
import React from 'react';
import McDetails from '../../components/detailCards/McDetails';
import {
    McPkgBookmark,
    McPkgPreview,
    PoPreview,
    TagBookmark,
    TagPreview,
    WoPreview,
} from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import useBookmarks from '../../utils/useBookmarks';
import useCommonHooks from '../../utils/useCommonHooks';
import { SearchType } from './Search';

interface BookmarkableEntityInfoListProps {
    searchType: string;
    entityInfoList:
        | McPkgPreview[]
        | McPkgBookmark[]
        | TagPreview[]
        | TagBookmark[]
        | WoPreview[]
        | PoPreview[];
}

const BookmarkableEntityInfoList = ({
    searchType,
    entityInfoList,
}: BookmarkableEntityInfoListProps): JSX.Element => {
    const { history, url } = useCommonHooks();
    const { isBookmarked, handleBookmarkClicked } = useBookmarks();
    // TODO: get offline planning state
    if (
        searchType === SearchType.MC &&
        (isArrayOfType<McPkgPreview>(entityInfoList, 'mcPkgNo') ||
            isArrayOfType<McPkgBookmark>(entityInfoList, 'mcPkgNo'))
    ) {
        return (
            <>
                {entityInfoList.map((entityInfo) => {
                    const id = entityInfo.id;
                    const bookmarked = isBookmarked(SearchType.MC, id);
                    return (
                        <McDetails
                            key={id}
                            mcPkgDetails={entityInfo}
                            isBookmarked={bookmarked}
                            offlinePlanningState={true} // TODO: change to actual
                            handleBookmarkClicked={(): Promise<void> =>
                                handleBookmarkClicked(
                                    SearchType.MC,
                                    id,
                                    bookmarked
                                )
                            }
                        />
                    );
                })}
            </>
        );
    } else if (
        searchType === SearchType.WO &&
        isArrayOfType<WoPreview>(entityInfoList, 'workOrderNo')
    ) {
        return (
            <>
                {entityInfoList.map((entityInfo) => {
                    const id = entityInfo.id;
                    const bookmarked = isBookmarked(SearchType.WO, id);
                    return (
                        <EntityDetails
                            key={id}
                            icon={
                                <TextIcon
                                    color={COLORS.workOrderIcon}
                                    text="WO"
                                />
                            }
                            headerText={entityInfo.workOrderNo}
                            description={entityInfo.title}
                            details={
                                entityInfo.disciplineCode
                                    ? [
                                          `${entityInfo.disciplineCode}, ${entityInfo.disciplineDescription}`,
                                      ]
                                    : undefined
                            }
                            onClick={(): void =>
                                history.push(`${url}/WO/${id}`)
                            }
                            isBookmarked={bookmarked}
                            offlinePlanningState={true} // TODO: change to actual
                            handleBookmarkClicked={(): Promise<void> =>
                                handleBookmarkClicked(
                                    SearchType.WO,
                                    id,
                                    bookmarked
                                )
                            }
                        />
                    );
                })}
            </>
        );
    } else if (
        searchType === SearchType.Tag &&
        isArrayOfType<TagPreview>(entityInfoList, 'tagNo')
    ) {
        return (
            <>
                {entityInfoList.map((entityInfo) => {
                    const id = entityInfo.id;
                    const bookmarked = isBookmarked(SearchType.Tag, id);
                    return (
                        <EntityDetails
                            key={id}
                            icon={
                                <TextIcon color={COLORS.tagIcon} text="Tag" />
                            }
                            headerText={entityInfo.tagNo}
                            description={entityInfo.description}
                            onClick={(): void =>
                                history.push(`${url}/Tag/${id}`)
                            }
                            isBookmarked={bookmarked}
                            offlinePlanningState={true} // TODO: change to actual
                            handleBookmarkClicked={(): Promise<void> =>
                                handleBookmarkClicked(
                                    SearchType.Tag,
                                    id,
                                    bookmarked
                                )
                            }
                        />
                    );
                })}
            </>
        );
    } else if (
        searchType === SearchType.PO &&
        isArrayOfType<PoPreview>(entityInfoList, 'isPurchaseOrder')
    ) {
        return (
            <>
                {entityInfoList.map((entityInfo) => {
                    const id = entityInfo.callOffId;
                    const bookmarked = isBookmarked(SearchType.PO, id);
                    return (
                        <EntityDetails
                            key={id}
                            icon={
                                <TextIcon
                                    color={COLORS.purchaseOrderIcon}
                                    text="PO"
                                />
                            }
                            headerText={entityInfo.title}
                            description={entityInfo.description}
                            details={[entityInfo.responsibleCode]}
                            onClick={(): void =>
                                history.push(`${url}/PO/${id}`)
                            }
                            isBookmarked={bookmarked}
                            offlinePlanningState={true} // TODO: change to actual
                            handleBookmarkClicked={(): Promise<void> =>
                                handleBookmarkClicked(
                                    SearchType.PO,
                                    id,
                                    bookmarked
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

export default BookmarkableEntityInfoList;