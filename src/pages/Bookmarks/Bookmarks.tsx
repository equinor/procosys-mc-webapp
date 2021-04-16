import React, { useContext } from 'react';
import styled from 'styled-components';
import DetailsCard from '../CommPkg/DetailsCard';
import PageHeader from '../../components/PageHeader';
import { getCurrentBookmarks } from './useBookmarks';
import { Button } from '@equinor/eds-core-react';
import PlantContext from '../../contexts/PlantContext';
import Navbar from '../../components/navigation/Navbar';
import EdsIcon from '../../components/icons/EdsIcon';
import useCommonHooks from '../../utils/useCommonHooks';
import withAccessControl from '../../services/withAccessControl';

const BookmarksWrapper = styled.main`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-bottom: 70px;
    & h3 {
        text-align: center;
    }
`;

const NewBookmarkWrapper = styled.div`
    margin: 12px 4% 10px 4%;
    display: flex;
    justify-content: flex-end;
`;

const Bookmarks = (): JSX.Element => {
    const { url, history } = useCommonHooks();
    const { currentProject, currentPlant } = useContext(PlantContext);
    const bookmarks = currentProject
        ? getCurrentBookmarks(currentProject.id.toString())
        : [];
    const bookmarksToDisplay = bookmarks.map((bookmark) => (
        <DetailsCard
            key={bookmark}
            commPkgId={bookmark}
            atBookmarksPage={true}
            onClickAction={(): void => history.push(`${url}/${bookmark}`)}
        />
    ));

    const content = (): JSX.Element => {
        if (bookmarks.length < 1) {
            return <PageHeader title="No bookmarks to display" />;
        } else {
            return (
                <>
                    <PageHeader
                        title={'Bookmarks'}
                        subtitle={currentPlant?.title}
                    />
                    {bookmarksToDisplay}
                </>
            );
        }
    };

    return (
        <main>
            <Navbar
                leftContent={{ name: 'hamburger' }}
                rightContent={{ name: 'search' }}
            />
            <BookmarksWrapper>
                {content()}
                <NewBookmarkWrapper>
                    <Button onClick={(): void => history.push(`${url}/search`)}>
                        <EdsIcon name="search" color="white" />
                        Find comm. pkg
                    </Button>
                </NewBookmarkWrapper>
            </BookmarksWrapper>
        </main>
    );
};

export default withAccessControl(Bookmarks, ['COMMPKG/READ']);
