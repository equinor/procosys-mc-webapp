import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { ChecklistPreview } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';

export const CommPkgListWrapper = styled.div`
    padding-bottom: 85px;
    & h3 {
        text-align: center;
        margin-top: 16px;
    }
`;

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

const FormulaTypeText = styled.p`
    padding-left: 12px;
    flex: 1;
`;

const Scope = (): JSX.Element => {
    const { params, api, url } = useCommonHooks();
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
                    params.commPkg
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
    }, [params.plant, params.commPkg, api]);

    return (
        <CommPkgListWrapper>
            <AsyncPage
                errorMessage={'Unable to load scope. Please try again.'}
                emptyContentMessage={'The scope is empty.'}
                fetchStatus={fetchScopeStatus}
            >
                <>
                    {scope?.map((checklist) => (
                        <PreviewButton
                            key={checklist.id}
                            to={`${url}/${checklist.id}`}
                        >
                            <CompletionStatusIcon status={checklist.status} />
                            <div>
                                <label>{checklist.tagNo}</label>
                                <p>{checklist.tagDescription}</p>
                            </div>
                            <FormulaTypeText>
                                {checklist.formularType}
                            </FormulaTypeText>
                            <EdsIcon name="chevron_right" />
                        </PreviewButton>
                    ))}
                </>
            </AsyncPage>
        </CommPkgListWrapper>
    );
};

export default Scope;
