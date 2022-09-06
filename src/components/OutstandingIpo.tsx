import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
    CollapsibleCard,
    SkeletonLoadingPage,
} from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import useCommonHooks from '../utils/useCommonHooks';
import { AsyncStatus } from '../contexts/McAppContext';
import { OutstandingIpos } from '../services/apiTypes';
import OutstandingIpoResult from './OutstandingIpoResult';

const OutstandingIpoWrapper = styled.div`
    margin: 16px 0;
`;

const OutstandingIpo = (): JSX.Element => {
    const { params, api, ipoApi } = useCommonHooks();
    const [outstandingIpos, setOutstandingIpos] = useState<OutstandingIpos>();
    const [fetchSearchesStatus, setFetchSearchesStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const outstandingIposFromApi = await ipoApi.getOutstandingIpos(
                    params.plant
                );
                if (outstandingIposFromApi.items.length > 0) {
                    setOutstandingIpos(outstandingIposFromApi);
                    setFetchSearchesStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchSearchesStatus(AsyncStatus.EMPTY_RESPONSE);
                }
            } catch {
                setFetchSearchesStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [params.plant]);

    const determineContent = (): JSX.Element => {
        if (
            fetchSearchesStatus === AsyncStatus.SUCCESS &&
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
        } else if (fetchSearchesStatus === AsyncStatus.ERROR) {
            return (
                <p>
                    <i>
                        An error occurred, please refresh this page and try
                        again.
                    </i>
                </p>
            );
        } else if (fetchSearchesStatus === AsyncStatus.EMPTY_RESPONSE) {
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

export default OutstandingIpo;
