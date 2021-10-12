import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../icons/EdsIcon';
import PlantContext from '../../contexts/PlantContext';
import useCommonHooks from '../../utils/useCommonHooks';
import { COLORS } from '../../style/GlobalStyles';
import { StorageKey } from '@equinor/procosys-webapp-components';

const SideMenuWrapper = styled.aside<{ isActive: boolean }>`
    width: 297px;
    position: fixed;
    top: 0;
    height: calc(100vh);
    left: 0;
    z-index: 1000;
    background-color: ${COLORS.white};
    border-right: 2px solid ${COLORS.fadedBlue};
    overflow-y: auto;
    opacity: ${(props): string => (props.isActive ? '1' : '0')};
    transform: ${(props): string =>
        props.isActive ? 'translateX(0)' : 'translateX(-300px)'};
    transition: transform 0.4s ease-in;
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

const Backdrop = styled.div<{ isActive: boolean }>`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: ${COLORS.white};
    backdrop-filter: blur(1px);
    z-index: 500;
    transition: transform 0.4s ease-in;
    opacity: ${(props): string => (props.isActive ? '0.6' : '0')};
    display: ${(props): string => (props.isActive ? 'block' : 'none')};
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

const SideMenu = (): JSX.Element => {
    const { auth, history, params } = useCommonHooks();
    const { currentPlant, currentProject } = useContext(PlantContext);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    return (
        <>
            <Button variant="ghost" onClick={(): void => setDrawerIsOpen(true)}>
                <EdsIcon name={'menu'} color={COLORS.darkGrey} title="Menu" />
                Menu
            </Button>
            <Backdrop
                isActive={drawerIsOpen}
                onClick={(): void => setDrawerIsOpen(false)}
            />
            <SideMenuWrapper isActive={drawerIsOpen}>
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
