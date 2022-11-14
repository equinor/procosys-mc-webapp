import React, { useContext } from 'react';
import { Button } from '@equinor/eds-core-react';
import {
    Attachments,
    CollapsibleCard,
    ErrorPage,
    HomeButton,
    removeSubdirectories,
    useSnackbar,
} from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import AsyncPage from '../../components/AsyncPage';
import { AsyncStatus } from '../../contexts/McAppContext';
import { isOfType } from '../../services/apiTypeGuards';
import {
    Attachment,
    IpoDetails,
    McPkgPreview,
    PoPreview,
    Tag,
    WoPreview,
} from '../../services/apiTypes';
import { removeHtmlFromText } from '../../utils/removeHtmlFromText';
import useCommonHooks from '../../utils/useCommonHooks';
import PlantContext from '../../contexts/PlantContext';

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
    workOrder?: WoPreview | McPkgPreview | Tag | PoPreview | IpoDetails;
    fetchWorkOrderStatus: AsyncStatus;
};

const WorkOrderInfo = ({
    workOrder,
    fetchWorkOrderStatus,
}: WorkOrderInfoProps): JSX.Element => {
    const { history, url, api, params, offlineState } = useCommonHooks();
    const { permissions } = useContext(PlantContext);
    const { snackbar, setSnackbarText } = useSnackbar();
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
                            api.getWorkOrderAttachments(
                                params.plant,
                                params.entityId,
                                abortSignal
                            )
                        }
                        getAttachment={(attachmentId: number): Promise<Blob> =>
                            api.getWorkOrderAttachment(
                                params.plant,
                                params.entityId,
                                attachmentId,
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
                            attachmentId: number
                        ): Promise<void> =>
                            api.deleteWorkOrderAttachment(
                                params.plant,
                                params.entityId,
                                attachmentId
                            )
                        }
                        setSnackbarText={setSnackbarText}
                        readOnly={
                            !permissions.includes('WO/ATTACHFILE') ||
                            offlineState
                        }
                        abortController={abortController}
                    />
                    {snackbar}
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
