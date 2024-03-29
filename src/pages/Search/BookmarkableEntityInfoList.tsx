import {
    EntityDetails,
    isArrayOfType,
    SearchType,
    TextIcon,
} from '@equinor/procosys-webapp-components';
import React from 'react';
import McDetails from '../../components/detailCards/McDetails';
import {
    IpoDetails,
    IPOPreview,
    McPkgBookmark,
    McPkgPreview,
    PoPreview,
    TagBookmark,
    TagPreview,
    WoPreview,
} from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import useCommonHooks from '../../utils/useCommonHooks';

interface BookmarkableEntityInfoListProps {
    searchType: string;
    isBookmarked: (searchType: SearchType, id: number) => boolean;
    handleBookmarkClicked: (
        entityType: SearchType,
        entityId: number,
        isBookmarked: boolean
    ) => Promise<void>;
    entityInfoList?:
        | McPkgPreview[]
        | McPkgBookmark[]
        | TagPreview[]
        | TagBookmark[]
        | WoPreview[]
        | PoPreview[]
        | IpoDetails[];
    offlinePlanningState: boolean;
}

const BookmarkableEntityInfoList = ({
    searchType,
    isBookmarked,
    handleBookmarkClicked,
    entityInfoList,
    offlinePlanningState,
}: BookmarkableEntityInfoListProps): JSX.Element => {
    const { history, url } = useCommonHooks();
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
                            offlinePlanningState={offlinePlanningState}
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
                            offlinePlanningState={offlinePlanningState}
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
                            offlinePlanningState={offlinePlanningState}
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
                            offlinePlanningState={offlinePlanningState}
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
    } else if (
        searchType === SearchType.IPO &&
        isArrayOfType<IPOPreview>(entityInfoList, 'id')
    ) {
        return (
            <>
                {entityInfoList.map((entityInfo) => {
                    const id = entityInfo.id;
                    return (
                        <EntityDetails
                            key={id}
                            icon={
                                <TextIcon color={COLORS.ipoIcon} text="IPO" />
                            }
                            headerText={entityInfo.id.toString()}
                            description={entityInfo.title}
                            details={[entityInfo.type, entityInfo.projectName]}
                            onClick={(): void =>
                                history.push(`${url}/IPO/${id}`)
                            }
                            offlinePlanningState={offlinePlanningState}
                        />
                    );
                })}
            </>
        );
    }
    return <></>;
};

export default BookmarkableEntityInfoList;
