import React, { useEffect, useState } from 'react';
import { CommPkgListWrapper, PreviewButton } from '../Scope/Scope';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import { Typography } from '@equinor/eds-core-react';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { PunchPreview } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';

const InfoRow = styled.div`
    &:first-child {
        margin-right: 20px;
    }
`;

const ModuleAndTagWrapper = styled.div`
    display: flex;
`;

const PunchList = (): JSX.Element => {
    const { api, url, params } = useCommonHooks();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async (): Promise<void> => {
            setFetchPunchListStatus(AsyncStatus.LOADING);
            try {
                const punchListFromApi = await api.getPunchList(
                    params.plant,
                    params.commPkg
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
    }, [params.commPkg, params.plant, api]);

    return (
        <CommPkgListWrapper>
            <AsyncPage
                fetchStatus={fetchPunchListStatus}
                errorMessage={
                    'Error: Unable to get punch list. Please try again.'
                }
                emptyContentMessage={'The punch list is empty.'}
            >
                <>
                    {punchList?.map((punch) => (
                        <PreviewButton
                            to={
                                punch.cleared
                                    ? `${url}/${punch.id}/verify`
                                    : `${url}/${punch.id}/clear`
                            }
                            key={punch.id}
                        >
                            <CompletionStatusIcon status={punch.status} />
                            <div>
                                <Typography variant="body_short" lines={2}>
                                    {punch.cleared ? 'Cleared: ' : null}
                                    {punch.description}
                                </Typography>
                                <ModuleAndTagWrapper>
                                    <InfoRow>
                                        <label>Module: </label>
                                        <p>{punch.systemModule}</p>
                                    </InfoRow>
                                    <InfoRow>
                                        <label>Tag: </label>
                                        <Typography
                                            variant="body_short"
                                            lines={1}
                                        >
                                            {punch.tagDescription}
                                        </Typography>
                                    </InfoRow>
                                </ModuleAndTagWrapper>
                            </div>
                            <EdsIcon name="chevron_right" />
                        </PreviewButton>
                    ))}
                </>
            </AsyncPage>
        </CommPkgListWrapper>
    );
};

export default PunchList;
