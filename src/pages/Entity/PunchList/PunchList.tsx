import React, { useEffect, useState } from 'react';
import { ScopeWrapper } from '../Scope/Scope';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { PunchPreview } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import Axios from 'axios';
import Punch from '../../../components/Punch';

const PunchList = (): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            setFetchPunchListStatus(AsyncStatus.LOADING);
            try {
                const punchListFromApi = await api.getPunchList(
                    params.plant,
                    params.searchType,
                    params.entityId,
                    source.token
                );
                setPunchList(punchListFromApi);
                if (punchListFromApi.length < 1) {
                    setFetchPunchListStatus(AsyncStatus.EMPTY_RESPONSE);
                } else {
                    setFetchPunchListStatus(AsyncStatus.SUCCESS);
                }
            } catch {
                setFetchPunchListStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [params.entityId, params.searchType, params.plant, api]);

    return (
        <ScopeWrapper>
            <AsyncPage
                fetchStatus={fetchPunchListStatus}
                errorMessage={
                    'Error: Unable to get punch list. Please try again.'
                }
                emptyContentMessage={'The punch list is empty.'}
            >
                <>
                    {punchList?.map((punch) => (
                        <Punch key={punch.id} punch={punch} />
                    ))}
                </>
            </AsyncPage>
        </ScopeWrapper>
    );
};

export default PunchList;
