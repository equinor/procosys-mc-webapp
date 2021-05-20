import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { ChecklistPreview } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import ScopeItem from './ScopeItem';
import Axios from 'axios';

export const ScopeWrapper = styled.div`
    padding-bottom: 85px;
    & h3 {
        text-align: center;
        margin-top: 16px;
    }
`;

const Scope = (): JSX.Element => {
    const { params, api } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [fetchScopeStatus, setFetchScopeStatus] = useState(
        AsyncStatus.LOADING
    );
    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            setFetchScopeStatus(AsyncStatus.LOADING);
            try {
                const scopeFromApi = await api.getScope(
                    params.plant,
                    params.searchType,
                    params.itemId,
                    source.token
                );
                const sortedScope = scopeFromApi.sort((a, b) =>
                    a.tagNo.localeCompare(b.tagNo)
                );
                setScope(sortedScope);
                if (scopeFromApi.length < 1) {
                    setFetchScopeStatus(AsyncStatus.EMPTY_RESPONSE);
                } else {
                    setFetchScopeStatus(AsyncStatus.SUCCESS);
                }
            } catch {
                setFetchScopeStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [params.plant, params.searchType, params.itemId, api]);

    return (
        <ScopeWrapper>
            <AsyncPage
                errorMessage={'Unable to load scope. Please try again.'}
                emptyContentMessage={'The scope is empty.'}
                fetchStatus={fetchScopeStatus}
            >
                <div>
                    {scope?.map((checklist) => (
                        <ScopeItem checklist={checklist} key={checklist.id} />
                    ))}
                </div>
            </AsyncPage>
        </ScopeWrapper>
    );
};

export default Scope;
