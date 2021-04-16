import React, { useEffect, useState } from 'react';
import {
    ChecklistDetails,
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../../../services/apiTypes';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import Navbar from '../../../components/navigation/Navbar';
import ChecklistDetailsCard from '../../Checklist/ChecklistDetailsCard';
import NewPunchForm from './NewPunchForm';
import useFormFields from '../../../utils/useFormFields';
import { NewPunch as NewPunchType } from '../../../services/apiTypes';
import NewPunchSuccessPage from './NewPunchSuccessPage';
import useCommonHooks from '../../../utils/useCommonHooks';
import { PunchWrapper } from '../ClearPunch/ClearPunch';
import { Button, Scrim } from '@equinor/eds-core-react';
import {
    AttachmentImage,
    AttachmentsWrapper,
    ImageModal,
    UploadImageButton,
} from '../../../components/Attachment';
import EdsIcon from '../../../components/icons/EdsIcon';
import UploadAttachment from '../../../components/UploadAttachment';
import EdsCard from '../../../components/EdsCard';
import useSnackbar from '../../../utils/useSnackbar';
import AsyncPage from '../../../components/AsyncPage';

export type PunchFormData = {
    category: string;
    type: string;
    description: string;
    raisedBy: string;
    clearingBy: string;
};

export type TempAttachment = { id: string; file: File };

const newPunchInitialValues = {
    category: '',
    type: '',
    description: '',
    raisedBy: '',
    clearingBy: '',
};

const NewPunch = (): JSX.Element => {
    const { api, params } = useCommonHooks();
    const { formFields, createChangeHandler } = useFormFields(
        newPunchInitialValues
    );
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [fetchNewPunchStatus, setFetchNewPunchStatus] = useState(
        AsyncStatus.LOADING
    );
    const [submitPunchStatus, setSubmitPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [checklistDetails, setChecklistDetails] = useState<
        ChecklistDetails
    >();
    const [tempAttachments, setTempAttachments] = useState<TempAttachment[]>(
        []
    );
    const [showUploadModal, setShowUploadModal] = useState(false);
    const { snackbar, setSnackbarText } = useSnackbar();
    const [showFullImageModal, setShowFullImageModal] = useState(false);
    const [attachmentToShow, setAttachmentToShow] = useState<TempAttachment>();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const NewPunchDTO: NewPunchType = {
            CheckListId: parseInt(params.checklistId),
            CategoryId: parseInt(formFields.category),
            Description: formFields.description,
            TypeId: parseInt(formFields.type),
            RaisedByOrganizationId: parseInt(formFields.raisedBy),
            ClearingByOrganizationId: parseInt(formFields.clearingBy),
            TemporaryFileIds: tempAttachments.map((attachment) => {
                return attachment.id;
            }),
        };
        setSubmitPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postNewPunch(params.plant, NewPunchDTO);
            setSubmitPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setSubmitPunchStatus(AsyncStatus.ERROR);
        }
    };

    const handleDelete = (attachmentId: string): void => {
        setTempAttachments((attachments) =>
            attachments.filter((item) => item.id !== attachmentId)
        );
        setShowFullImageModal(false);
    };

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const [
                    categoriesFromApi,
                    typesFromApi,
                    organizationsFromApi,
                    checklistFromApi,
                ] = await Promise.all([
                    api.getPunchCategories(params.plant),
                    api.getPunchTypes(params.plant),
                    api.getPunchOrganizations(params.plant),
                    api.getChecklist(params.plant, params.checklistId),
                ]);
                setCategories(categoriesFromApi);
                setTypes(typesFromApi);
                setOrganizations(organizationsFromApi);
                setChecklistDetails(checklistFromApi.checkList);
                setFetchNewPunchStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchNewPunchStatus(AsyncStatus.ERROR);
            }
        })();
    }, [params.plant, params.checklistId, api]);

    if (submitPunchStatus === AsyncStatus.SUCCESS) {
        return <NewPunchSuccessPage />;
    }

    const content = (): JSX.Element => {
        if (checklistDetails) {
            return (
                <>
                    <ChecklistDetailsCard
                        details={checklistDetails}
                        descriptionLabel={'New punch for:'}
                    />
                    <NewPunchForm
                        categories={categories}
                        types={types}
                        organizations={organizations}
                        formData={formFields}
                        createChangeHandler={createChangeHandler}
                        buttonText={'Create punch'}
                        handleSubmit={handleSubmit}
                        submitPunchStatus={submitPunchStatus}
                    >
                        <EdsCard title={'Add attachments'}>
                            <AttachmentsWrapper>
                                <UploadImageButton
                                    onClick={(): void =>
                                        setShowUploadModal(true)
                                    }
                                >
                                    <EdsIcon name="camera_add_photo" />
                                </UploadImageButton>
                                {tempAttachments.map((attachment) => (
                                    <>
                                        <AttachmentImage
                                            key={attachment.id}
                                            src={URL.createObjectURL(
                                                attachment.file
                                            )}
                                            alt={
                                                'Temp attachment ' +
                                                attachment.id
                                            }
                                            onClick={(): void => {
                                                setAttachmentToShow(attachment);
                                                setShowFullImageModal(true);
                                            }}
                                        />
                                    </>
                                ))}
                            </AttachmentsWrapper>
                        </EdsCard>
                    </NewPunchForm>
                    {showFullImageModal && attachmentToShow ? (
                        <Scrim
                            isDismissable
                            onClose={(): void => setShowFullImageModal(false)}
                        >
                            <ImageModal>
                                <img
                                    src={URL.createObjectURL(
                                        attachmentToShow?.file
                                    )}
                                    alt={
                                        'Temp attachment ' + attachmentToShow.id
                                    }
                                />
                                <Button
                                    onClick={(): void =>
                                        handleDelete(attachmentToShow.id)
                                    }
                                >
                                    Delete
                                </Button>
                                <Button
                                    onClick={(): void =>
                                        setShowFullImageModal(false)
                                    }
                                >
                                    Close
                                </Button>
                            </ImageModal>
                        </Scrim>
                    ) : null}
                    {showUploadModal ? (
                        <UploadAttachment
                            setShowModal={setShowUploadModal}
                            postAttachment={api.postTempPunchAttachment}
                            parentId={''}
                            setSnackbarText={setSnackbarText}
                            updateTempAttachments={setTempAttachments}
                        />
                    ) : null}
                </>
            );
        }
        return <></>;
    };

    return (
        <>
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Checklist' }}
            />
            <AsyncPage
                fetchStatus={fetchNewPunchStatus}
                errorMessage={
                    'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
                }
                loadingMessage={'Loading new punch.'}
            >
                <PunchWrapper>{content()}</PunchWrapper>
            </AsyncPage>
            {snackbar}
        </>
    );
};

export default NewPunch;
