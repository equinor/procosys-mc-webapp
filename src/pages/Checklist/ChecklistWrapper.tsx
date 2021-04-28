import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navigation/Navbar';
import Checklist from '@equinor/procosys-mc-checklist-module';
import useCommonHooks from '../../utils/useCommonHooks';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import FooterButton from '../../components/navigation/FooterButton';
import EdsIcon from '../../components/icons/EdsIcon';
import styled from 'styled-components';
const Settings = require('../../settings.json');

const BottomSpacer = styled.div`
    height: 70px;
`;

const ChecklistWrapper = (): JSX.Element => {
    const { auth, history, url } = useCommonHooks();
    const [token, setToken] = useState('');

    useEffect(() => {
        (async (): Promise<void> => {
            const tempToken = await auth.getAccessToken(Settings.scope);
            setToken(tempToken);
        })();
    }, []);

    return (
        <>
            <Navbar
                leftContent={{ name: 'back' }}
                rightContent={{ name: 'newPunch' }}
            />
            {token.length > 1 && (
                <Checklist
                    checklistId="24580832"
                    plantId="NGPCS_TEST_BROWN"
                    baseUrl={Settings.baseUrl}
                    accessToken={token}
                />
            )}
            <BottomSpacer />
            <NavigationFooter>
                <FooterButton
                    active={true}
                    goTo={(): void => history.push(`${url}/scope`)}
                    icon={<EdsIcon name="list" />}
                    label={'Checklist'}
                />
                <FooterButton
                    active={false}
                    goTo={(): void => history.push(`${url}/scope`)}
                    icon={<EdsIcon name="info_circle" />}
                    label={'Tag info'}
                />
                <FooterButton
                    active={false}
                    goTo={(): void => history.push(`${url}/scope`)}
                    icon={<EdsIcon name="warning_filled" size={48} />}
                    label={'Punch list'}
                    numberOfItems={234}
                />
            </NavigationFooter>
        </>
    );
};

export default ChecklistWrapper;
