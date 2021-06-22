import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { ChecklistPreview } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import { InfoItem } from '@equinor/procosys-webapp-components';

export const ScopeWrapper = styled.div`
    & h3 {
        text-align: center;
        margin-top: 16px;
    }
`;

type ScopeProps = {
    scope?: ChecklistPreview[];
    fetchScopeStatus: AsyncStatus;
};

const Scope = ({ scope, fetchScopeStatus }: ScopeProps): JSX.Element => {
    const { url, history } = useCommonHooks();

    return (
        <ScopeWrapper>
            <AsyncPage
                errorMessage={'Unable to load scope. Please try again.'}
                emptyContentMessage={'The scope is empty.'}
                fetchStatus={fetchScopeStatus}
            >
                <div>
                    {scope?.map((checklist) => (
                        <InfoItem
                            isScope
                            key={checklist.id}
                            attachments={checklist.attachmentCount}
                            status={checklist.status}
                            statusLetters={[
                                checklist.isSigned ? 'S' : null,
                                checklist.isVerified ? 'V' : null,
                            ]}
                            headerText={checklist.tagNo.toString()}
                            description={checklist.tagDescription}
                            chips={[
                                checklist.formularType,
                                checklist.responsibleCode,
                            ]}
                            onClick={(): void =>
                                history.push(`${url}/checklist/${checklist.id}`)
                            }
                        />
                    ))}
                </div>
            </AsyncPage>
        </ScopeWrapper>
    );
};

export default Scope;
