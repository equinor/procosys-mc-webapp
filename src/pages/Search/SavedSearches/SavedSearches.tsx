import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { SavedSearch } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import { CollapsibleCard } from '@equinor/procosys-webapp-components';
import EntityDetails from '../../../components/detailCards/EntityDetails';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';

const SavedSearches = (): JSX.Element => {
    const [searches, setSearches] = useState<SavedSearch[]>();
    const [fetchSearchesStatus, setFetchSearchesStatus] = useState(
        AsyncStatus.LOADING
    );
    const { params, api } = useCommonHooks();

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
        if (fetchSearchesStatus === AsyncStatus.LOADING) {
            return <SkeletonLoadingPage nrOfRows={5} />;
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
                    <i> No saved searches in ProCoSys.</i>
                </p>
            );
        } else {
            // TODO: change icon based on which search type
            // TODO: exchange entity details with component for saved searches
            return (
                <div>
                    {searches?.map((search) => {
                        <EntityDetails
                            key={search.id}
                            headerText={search.name}
                            icon={<></>}
                            description={search.description}
                            onClick={(): void => {
                                // TODO: routing for saved searches
                            }}
                        />;
                    })}
                </div>
            );
        }
    };

    // TODO: add space before the collaprible card starts. See WorkOrderInfo or TagInfo page
    return (
        <CollapsibleCard cardTitle="Saved Searches">
            {determineContent()}
        </CollapsibleCard>
    );
};

export default SavedSearches;
