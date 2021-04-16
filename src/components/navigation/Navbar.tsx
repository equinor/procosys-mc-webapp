import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EdsIcon from '../icons/EdsIcon';
import { useSpring } from 'react-spring';
import SideMenu from './SideMenu';
import { BREAKPOINT, COLORS } from '../../style/GlobalStyles';
import removeSubdirectories from '../../utils/removeSubdirectories';

const NavbarWrapper = styled.nav<{ noBorder: boolean }>`
    height: 54px;
    width: 100%;
    max-width: 768px;
    background-color: ${COLORS.white};
    border-bottom: ${(props): string =>
        props.noBorder ? 'none' : `1px solid ${COLORS.fadedBlue}`};
    display: flex;
    flex-grow: 100;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 4px 28px;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    & img {
        width: 24px;
        height: 24px;
        transform: scale(1.3);
    }
    & h4 {
        margin: 0;
    }
    & button {
        padding: 0;
    }
    ${BREAKPOINT.standard} {
        padding: 4px 4%;
    }
`;

type LeftNavbarContent = {
    name: 'hamburger' | 'back';
    label?: string;
    url?: string;
};
type RightNavbarContent = {
    name: 'newPunch' | 'search';
    label?: string;
    url?: string;
};

type NavbarProps = {
    leftContent?: LeftNavbarContent;
    midContent?: string;
    rightContent?: RightNavbarContent;
    noBorder?: boolean;
};

const Navbar = ({
    leftContent,
    midContent = '',
    rightContent,
    noBorder = false,
}: NavbarProps): JSX.Element => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const history = useHistory();
    const { url } = useRouteMatch();
    const sideDrawerAnimation = useSpring({
        transform: drawerIsOpen ? 'translateX(0px)' : 'translateX(-300px)',
    });
    const backdropAnimation = useSpring({
        opacity: drawerIsOpen ? 0.6 : 0,
        display: drawerIsOpen ? 'block' : 'none',
    });

    const determineLeftContent = (): JSX.Element => {
        if (leftContent?.name === 'hamburger') {
            return (
                <Button
                    variant="ghost"
                    onClick={(): void => setDrawerIsOpen(true)}
                >
                    <EdsIcon
                        name={'menu'}
                        color={COLORS.darkGrey}
                        title="Menu"
                    />
                    Menu
                </Button>
            );
        }
        if (leftContent?.name === 'back') {
            return (
                <Button
                    variant="ghost"
                    onClick={(): void => {
                        if (leftContent.url) {
                            history.push(leftContent.url);
                        } else {
                            history.push(removeSubdirectories(url, 1));
                        }
                    }}
                >
                    <EdsIcon name={'arrow_back'} title="Back" />
                    {leftContent.label}
                </Button>
            );
        }
        return <></>;
    };

    const determineRightContent = (): JSX.Element => {
        if (rightContent?.name === 'search') {
            return (
                <Button
                    variant="ghost_icon"
                    onClick={(): void => history.push(`${url}/search`)}
                >
                    <EdsIcon name={'search'} title="Search" />
                </Button>
            );
        }
        if (rightContent?.name === 'newPunch') {
            return (
                <Button
                    variant="ghost"
                    onClick={(): void => history.push(`${url}/new-punch`)}
                >
                    New punch
                </Button>
            );
        }
        return <></>;
    };

    return (
        <>
            <NavbarWrapper noBorder={noBorder}>
                {determineLeftContent()}
                <h4>{midContent}</h4>
                {determineRightContent()}
            </NavbarWrapper>
            <SideMenu
                setDrawerIsOpen={setDrawerIsOpen}
                animation={sideDrawerAnimation}
                backdropAnimation={backdropAnimation}
            />
        </>
    );
};

export default Navbar;
