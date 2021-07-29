import React, { useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { ChecklistPreview, PunchPreview } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import { InfoItem } from '@equinor/procosys-webapp-components';
import useFilterFacade from '../useFilterFacade';
import Filter from '../Filter';

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
    const [shownScope, setShownScope] = useState<
        ChecklistPreview[] | undefined
    >(scope);

    return (
        <ScopeWrapper>
            <AsyncPage
                errorMessage={'Unable to load scope. Please try again.'}
                emptyContentMessage={'The scope is empty.'}
                fetchStatus={fetchScopeStatus}
            >
                <div>
                    <Filter setShownScope={setShownScope} scopeItems={scope} />
                    {shownScope?.map((checklist) => (
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
