import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CommPkg } from '../../services/apiTypes';
import EdsIcon from '../../components/icons/EdsIcon';
import { Button, DotProgress } from '@equinor/eds-core-react';
import useBookmarks from '../Bookmarks/useBookmarks';
import { COLORS, SHADOW } from '../../style/GlobalStyles';
import { PackageStatusIcon } from '../../components/icons/PackageStatusIcon';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/CommAppContext';
import DetailsCardShell from './DetailsCardShell';
import axios from 'axios';

const DetailsWrapper = styled.div<{ atBookmarksPage?: boolean }>`
    display: grid;
    grid-template-columns: repeat(2, 1fr) repeat(2, 0.5fr);
    grid-template-rows: repeat(2);
    grid-column-gap: 8px;
    grid-row-gap: 8px;
    padding: 16px 4%;
    border-radius: 5px;
    cursor: ${(props): string =>
        props.atBookmarksPage ? 'pointer' : 'initial'};
    background-color: ${(props): any =>
        props.atBookmarksPage ? COLORS.white : COLORS.fadedBlue};
    box-shadow: ${(props): string => (props.atBookmarksPage ? SHADOW : 'none')};
    margin: ${(props): string =>
        props.atBookmarksPage ? '0 4% 10px 4%' : '0'};
`;

const Description = styled.div`
    grid-area: 1 / 1 / 2 / 5;
    & h4 {
        margin: 0;
    }
`;
const StatusIconWrapper = styled.div`
    grid-area: 2 / 3 / 2 / 4;
    text-align: center;
    & img {
        height: 20px;
        margin-top: 10px;
        margin-right: -1.2px;
    }
`;
const BookmarkIconWrapper = styled.div`
    grid-area: 2 / 4 / 2 / 4;
    display: flex;
    justify-content: center;
`;
const CommPkgNumberWrapper = styled.div`
    grid-area: 2 / 1 / 3 / 3;
    & p {
        margin: 0;
    }
`;
const MCStatusWrapper = styled.div`
    grid-area: 2 / 2 / 3 / 3;
    & p {
        margin: 0;
    }
`;

type DetailsCardProps = {
    commPkgId: string;
    atBookmarksPage?: boolean;
    onClickAction?: () => void;
};

const DetailsCard = ({
    commPkgId,
    atBookmarksPage = false,
    onClickAction,
}: DetailsCardProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const { isBookmarked, setIsBookmarked } = useBookmarks(commPkgId);
    const [details, setDetails] = useState<CommPkg>();
    const [fetchDetailsStatus, setFetchDetailsStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const detailsFromApi = await api.getCommPackageDetails(
                    source.token,
                    params.plant,
                    commPkgId
                );
                setDetails(detailsFromApi);
                setFetchDetailsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setFetchDetailsStatus(AsyncStatus.ERROR);
                }
            }
        })();
        return (): void => {
            source.cancel('Detailscard unmounted');
        };
    }, [params, api, commPkgId]);

    if (fetchDetailsStatus === AsyncStatus.ERROR) {
        return (
            <DetailsCardShell atBookmarksPage={atBookmarksPage}>
                <p>Unable to load comm package details. Try reloading.</p>
            </DetailsCardShell>
        );
    }
    if (fetchDetailsStatus === AsyncStatus.SUCCESS && details) {
        return (
            <DetailsWrapper
                atBookmarksPage={atBookmarksPage}
                onClick={onClickAction}
            >
                <Description>
                    <h4>{details.description}</h4>
                </Description>
                <StatusIconWrapper>
                    <PackageStatusIcon
                        mcStatus={details.mcStatus}
                        commStatus={details.commStatus}
                    />
                </StatusIconWrapper>
                <BookmarkIconWrapper>
                    <Button
                        variant="ghost_icon"
                        onClick={(e: React.MouseEvent<HTMLElement>): void => {
                            e.stopPropagation();
                            setIsBookmarked((prev) => !prev);
                        }}
                    >
                        <EdsIcon
                            color={COLORS.mossGreen}
                            name={
                                isBookmarked
                                    ? 'bookmark_filled'
                                    : 'bookmark_outlined'
                            }
                        />
                    </Button>
                </BookmarkIconWrapper>
                <CommPkgNumberWrapper>
                    <label>PKG number:</label> <p>{details.commPkgNo}</p>
                </CommPkgNumberWrapper>
                <MCStatusWrapper>
                    <label>MC Status:</label> <p>{details.mcStatus}</p>
                </MCStatusWrapper>
            </DetailsWrapper>
        );
    }

    return (
        <DetailsCardShell atBookmarksPage={atBookmarksPage}>
            <DotProgress color="primary" />
        </DetailsCardShell>
    );
};

export default DetailsCard;
