import React, { useEffect, useState } from 'react';
import { Checklist } from '@equinor/procosys-webapp-components';
import useCommonHooks from '../../utils/useCommonHooks';
import styled from 'styled-components';
const Settings = require('../../settings.json');

const BottomSpacer = styled.div`
    height: 70px;
`;

const ChecklistWrapper = (): JSX.Element => {
    const { auth, params } = useCommonHooks();
    const [token, setToken] = useState('');

    useEffect(() => {
        (async (): Promise<void> => {
            const tempToken = await auth.getAccessToken(Settings.scope);
            setToken(tempToken);
        })();
    }, []);

    return (
        <>
            {token.length > 1 && (
                <Checklist
                    checklistId={params.checklistId}
                    plantId={params.plant}
                    baseUrl={Settings.baseUrl}
                    accessToken={token}
                />
            )}
            <BottomSpacer />
        </>
    );
};

export default ChecklistWrapper;
