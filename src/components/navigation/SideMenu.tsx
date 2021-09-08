import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { animated, AnimatedValue, useSpring } from 'react-spring';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../icons/EdsIcon';
import PlantContext, { StorageKey } from '../../contexts/PlantContext';
import useCommonHooks from '../../utils/useCommonHooks';
import { COLORS } from '../../style/GlobalStyles';

const SideMenuWrapper = styled(animated.aside)`
    width: 297px;
    position: fixed;
    top: 0;
    height: calc(100vh);
    left: 0;
    z-index: 1000;
    background-color: ${COLORS.white};
    border-right: 2px solid ${COLORS.fadedBlue};
    overflow-y: auto;
`;

const TopContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
`;

const UserInfo = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    & p {
        margin: 0;
    }
    & button {
        width: fit-content;
        margin-bottom: 24px;
    }
`;

const UserNameText = styled.p`
    padding-bottom: 15px;
    color: ${COLORS.darkGrey};
`;

const Backdrop = styled(animated.div)`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: ${COLORS.white};
    backdrop-filter: blur(1px);
    z-index: 500;
`;

const PlantInfo = styled.div`
    & h4 {
        margin: 0 0 4px 0;
    }
    & p {
        margin: 16px 0 0 0;
    }
    & button {
        width: fit-content;
        margin-bottom: 24px;
    }
    padding: 16px;
    display: flex;
    flex-direction: column;
    background-color: ${COLORS.fadedBlue};
`;

type SideMenuProps = {
    animation: AnimatedValue<any>;
    backdropAnimation: AnimatedValue<any>;
    setDrawerIsOpen: (drawerIsOpen: boolean) => void;
};

const SideMenu = (): JSX.Element => {
    const { auth, history, params } = useCommonHooks();
    const { currentPlant, currentProject } = useContext(PlantContext);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const sideDrawerAnimation = useSpring({
        transform: drawerIsOpen ? 'translateX(0px)' : 'translateX(-300px)',
    });
    const backdropAnimation = useSpring({
        opacity: drawerIsOpen ? 0.6 : 0,
        display: drawerIsOpen ? 'block' : 'none',
    });

    return (
        <>
            <Button variant="ghost" onClick={(): void => setDrawerIsOpen(true)}>
                <EdsIcon name={'menu'} color={COLORS.darkGrey} title="Menu" />
                Menu
            </Button>
            <Backdrop
                style={backdropAnimation}
                onClick={(): void => setDrawerIsOpen(false)}
            />
            <SideMenuWrapper style={sideDrawerAnimation}>
                <TopContent>
                    <h2>Welcome</h2>
                    <Button
                        variant="ghost"
                        onClick={(): void => setDrawerIsOpen(false)}
                    >
                        <EdsIcon name="close" color={COLORS.black} />
                    </Button>
                </TopContent>
                <UserInfo>
                    <p>Signed in as:</p>
                    <UserNameText>{auth.getUserName()}</UserNameText>
                    <Button variant="outlined" onClick={auth.logout}>
                        Sign out
                    </Button>
                </UserInfo>
                <PlantInfo>
                    <p>Selected plant:</p>
                    <h4>{currentPlant ? currentPlant.title : 'None'}</h4>
                    <Button
                        onClick={(): void => {
                            window.localStorage.removeItem(StorageKey.PLANT);
                            window.localStorage.removeItem(StorageKey.PROJECT);
                            setDrawerIsOpen(false);
                            history.push('/');
                        }}
                    >
                        Change plant
                        <EdsIcon name="chevron_right" />
                    </Button>
                    {currentPlant && (
                        <>
                            <p>Selected project:</p>
                            <h4>
                                {currentProject
                                    ? currentProject.description
                                    : 'None'}
                            </h4>
                            <Button
                                onClick={(): void => {
                                    window.localStorage.removeItem(
                                        StorageKey.PROJECT
                                    );
                                    setDrawerIsOpen(false);
                                    history.push(`/${params.plant}`);
                                }}
                            >
                                Change project
                                <EdsIcon name="chevron_right" />
                            </Button>
                        </>
                    )}
                </PlantInfo>
            </SideMenuWrapper>
        </>
    );
};

export default SideMenu;
