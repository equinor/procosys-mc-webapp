import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import CommAppContext from '../../contexts/McAppContext';
import { COLORS } from '../../style/GlobalStyles';
import { PageHeader } from '@equinor/procosys-webapp-components';
import useCommonHooks from '../../utils/useCommonHooks';
import { Button } from '@equinor/eds-core-react';
import {
    ErrorPage,
    Navbar,
    ProcosysButton,
    ReloadButton,
} from '@equinor/procosys-webapp-components';
import SideMenu from '../../components/navigation/SideMenu';

export const SelectPlantWrapper = styled.main`
    display: flex;
    flex-direction: column;
    & button {
        border-radius: 0;
    }
`;

export const SelectorButton = styled(Link)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    padding: 16px 4%;
    margin: 0 10px;
    position: relative;
    & p {
        margin: 0 30px 0 0;
    }
    &:hover {
        background-color: ${COLORS.fadedBlue};
    }
    & svg {
        position: absolute;
        right: 10px;
    }
`;

const SelectPlant = (): JSX.Element => {
    const { availablePlants } = useContext(CommAppContext);
    const { auth, offlineState } = useCommonHooks();

    const content = (): JSX.Element => {
        if (availablePlants.length < 1) {
            return (
                <ErrorPage
                    title="No plants to show"
                    description="We were able to connect to the server, but there are no plants to show. Make sure you're logged in correctly, and that you have the necessary permissions"
                    actions={[
                        <Button key={'signOut'} onClick={auth.logout}>
                            Sign out
                        </Button>,
                        <ReloadButton key={'reload'} />,
                    ]}
                />
            );
        } else {
            return (
                <>
                    <PageHeader title={'Select plant'} />
                    {availablePlants.map((plant) => (
                        <SelectorButton key={plant.id} to={`/${plant.slug}`}>
                            <p>{plant.title}</p>
                            <EdsIcon
                                name="chevron_right"
                                title="chevron right"
                            />
                        </SelectorButton>
                    ))}
                </>
            );
        }
    };

    return (
        <>
            <Navbar
                leftContent={<ProcosysButton />}
                rightContent={<SideMenu />}
                isOffline={offlineState}
            />
            <SelectPlantWrapper>{content()}</SelectPlantWrapper>
        </>
    );
};

export default SelectPlant;
