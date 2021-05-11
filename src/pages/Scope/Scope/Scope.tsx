import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { ChecklistPreview } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import ScopeItem from './ScopeItem';

// TODO: rename everything comm pkg related

export const CommPkgListWrapper = styled.div`
    padding-bottom: 85px;
    & h3 {
        text-align: center;
        margin-top: 16px;
    }
`;

// TODO: copy and change in punch list
export const PreviewButton = styled(Link)`
    display: flex;
    align-items: center;
    padding: 8px 0;
    margin: 10px 4% 0 4%;
    cursor: pointer;
    text-decoration: none;
    justify-content: space-between;
    & img {
        max-height: 20px;
        object-fit: contain;
        flex: 0.1;
    }
    & > div {
        margin-left: 24px;
        flex: 3;
        & p {
            margin: 0;
        }
    }
    & svg {
        flex: 0.5;
    }
`;

const Scope = (): JSX.Element => {
    const { params, api } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [fetchScopeStatus, setFetchScopeStatus] = useState(
        AsyncStatus.LOADING
    );
    useEffect(() => {
        (async (): Promise<void> => {
            setFetchScopeStatus(AsyncStatus.LOADING);
            try {
                const scopeFromApi = await api.getScope(
                    params.plant,
                    params.searchType,
                    params.itemId
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
    }, [params.plant, params.searchType, params.itemId, api]);

    return (
        <CommPkgListWrapper>
            <AsyncPage
                errorMessage={'Unable to load scope. Please try again.'}
                emptyContentMessage={'The scope is empty.'}
                fetchStatus={fetchScopeStatus}
            >
                {
                    // add filter (and # of forms??)
                }
                <div>
                    {
                        // TODO: style div above to look more like search results list
                    }
                    {scope?.map((checklist) => (
                        <ScopeItem checklist={checklist} key={checklist.id} />
                    ))}
                </div>
            </AsyncPage>
        </CommPkgListWrapper>
    );
};

export default Scope;
