import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
    CollapsibleCard,
    SkeletonLoadingPage,
} from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import useCommonHooks from '../utils/useCommonHooks';
import { AsyncStatus } from '../contexts/McAppContext';
import { OutstandingIposType } from '../services/apiTypes';
import OutstandingIpoResult from './OutstandingIpoResult';

const OutstandingIpoWrapper = styled.div`
    margin: 16px 0;
`;

const OutstandingIpos = (): JSX.Element => {
    const { params, ipoApi } = useCommonHooks();
    const [outstandingIpos, setOutstandingIpos] =
        useState<OutstandingIposType>();
    const [fetchIpoStatus, setFetchIpoStatus] = useState(AsyncStatus.LOADING);

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const outstandingIposFromApi = await ipoApi.getOutstandingIpos(
                    params.plant
                );
                if (outstandingIposFromApi.items.length > 0) {
                    setOutstandingIpos(outstandingIposFromApi);
                    setFetchIpoStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchIpoStatus(AsyncStatus.EMPTY_RESPONSE);
                }
            } catch {
                setFetchIpoStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [params.plant]);

    const determineContent = (): JSX.Element => {
        if (
            fetchIpoStatus === AsyncStatus.SUCCESS &&
            outstandingIpos != undefined
        ) {
            return (
                <div>
                    {outstandingIpos.items.map((ipo) => {
                        return (
                            <OutstandingIpoResult
                                key={ipo.invitationId}
                                ipo={ipo}
                            />
                        );
                    })}
                </div>
            );
        } else if (fetchIpoStatus === AsyncStatus.ERROR) {
            return (
                <p>
                    <i>
                        An error occurred, please refresh this page and try
                        again.
                    </i>
                </p>
            );
        } else if (fetchIpoStatus === AsyncStatus.EMPTY_RESPONSE) {
            return (
                <p>
                    <i> No outstanding IPOs in ProCoSys.</i>
                </p>
            );
        } else {
            return <SkeletonLoadingPage />;
        }
    };

    return (
        <OutstandingIpoWrapper>
            <CollapsibleCard cardTitle="Outstanding IPOs">
                {determineContent()}
            </CollapsibleCard>
        </OutstandingIpoWrapper>
    );
};

export default OutstandingIpos;
