import React, { useContext } from 'react';
import { Button } from '@equinor/eds-core-react';
import {
    AsyncStatus,
    Attachments,
    CollapsibleCard,
    ErrorPage,
    HomeButton,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import AsyncPage from '../../components/AsyncPage';
import { isOfType } from '../../services/apiTypeGuards';
import {
    IpoDetails,
    McPkgPreview,
    PoPreview,
    Tag,
    WoPreview,
} from '../../services/apiTypes';
import { Attachment } from '../../services/apiTypesCompletionApi';
import { removeHtmlFromText } from '../../utils/removeHtmlFromText';
import useCommonHooks from '../../utils/useCommonHooks';
import PlantContext from '../../contexts/PlantContext';
import { OfflineStatus } from '../../typings/enums';

const TagInfoWrapper = styled.main`
    min-height: 0px;
    padding: 16px 4% 16px 4%;
    & p {
        word-break: break-word;
        margin: 0;
    }
`;

const Description = styled.p`
    white-space: pre-line;
`;

type WorkOrderInfoProps = {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    fetchWorkOrderStatus: AsyncStatus;
    workOrder?: WoPreview | McPkgPreview | Tag | PoPreview | IpoDetails;
};

const WorkOrderInfo = ({
    setSnackbarText,
    fetchWorkOrderStatus,
    workOrder,
}: WorkOrderInfoProps): JSX.Element => {
    const { history, url, api, params, offlineState, completionApi } =
        useCommonHooks();
    const { permissions } = useContext(PlantContext);
    const abortController = new AbortController();
    const abortSignal = abortController.signal;
    if (
        workOrder === undefined ||
        isOfType<WoPreview>(workOrder, 'workOrderNo')
    ) {
        return (
            <AsyncPage
                fetchStatus={fetchWorkOrderStatus}
                errorMessage={
                    'Unable to load Work Order info. Please try again.'
                }
            >
                <TagInfoWrapper>
                    <CollapsibleCard cardTitle="Description">
                        <Description>
                            {workOrder?.description
                                ? removeHtmlFromText(workOrder?.description)
                                : 'A long description is not present, See the short description at the top of the page for all information available.'}
                        </Description>
                    </CollapsibleCard>

                    <h5>Attachments</h5>
                    <Attachments
                        getAttachments={(): Promise<Attachment[]> =>
                            completionApi.getPunchAttachments(
                                params.plant,
                                params.punchItemId
                            )
                        }
                        getAttachment={(
                            attachmentGuid: string
                        ): Promise<Blob> =>
                            api.getWorkOrderAttachment(
                                params.plant,
                                params.entityId,
                                attachmentGuid,
                                abortSignal
                            )
                        }
                        postAttachment={(
                            file: FormData,
                            title: string
                        ): Promise<void> =>
                            api.postWorkOrderAttachment(
                                params.plant,
                                params.entityId,
                                title,
                                file
                            )
                        }
                        deleteAttachment={(
                            attachmentId: string | number
                        ): Promise<void> =>
                            api.deleteWorkOrderAttachment(
                                params.plant,
                                params.entityId,
                                attachmentId as number
                            )
                        }
                        setSnackbarText={setSnackbarText}
                        readOnly={
                            !permissions.includes('WO/ATTACHFILE') ||
                            offlineState != OfflineStatus.ONLINE
                        }
                        abortController={abortController}
                    />
                </TagInfoWrapper>
            </AsyncPage>
        );
    } else {
        return (
            <ErrorPage
                title="Unable to load Work Order info."
                description="The Work Order info page is only available for Work Orders."
                actions={[
                    <HomeButton key={'home'} />,
                    <Button
                        key={'scopePage'}
                        onClick={(): void =>
                            history.push(removeSubdirectories(url, 1))
                        }
                    >
                        Scope page
                    </Button>,
                ]}
            />
        );
    }
};

export default WorkOrderInfo;
