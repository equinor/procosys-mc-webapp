import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
    CollapsibleCard,
    SkeletonLoadingPage,
} from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import useCommonHooks from '../utils/useCommonHooks';
import { AsyncStatus } from '../contexts/McAppContext';
import { SavedSearch } from '../services/apiTypes';

const OutstandingIpoWrapper = styled.div`
    margin: 16px 0;
`;

const OutstandingIpo = (): JSX.Element => {
    const { params, api } = useCommonHooks();
    const [searches, setSearches] = useState<SavedSearch[]>([]);
    const [fetchSearchesStatus, setFetchSearchesStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const searchesFromApi = await api.getSavedSearches(
                    params.plant,
                    source.token
                );
                if (searchesFromApi.length > 0) {
                    setSearches(searchesFromApi);
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
            searches != undefined
        ) {
            return (
                <div>
                    {searches.map(() => {
                        return <></>;
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
