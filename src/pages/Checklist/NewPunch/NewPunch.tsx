import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    ChecklistDetails,
    PunchCategory,
    PunchOrganization,
    PunchType,
} from '../../../services/apiTypes';
import { AsyncStatus } from '../../../contexts/McAppContext';
import NewPunchForm from './NewPunchForm';
import useFormFields from '../../../utils/useFormFields';
import { NewPunch as NewPunchType } from '../../../services/apiTypes';
import NewPunchSuccessPage from './NewPunchSuccessPage';
import useCommonHooks from '../../../utils/useCommonHooks';
import { PunchWrapper } from '../../Punch/ClearPunch/ClearPunch';
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
    description: string;
    raisedBy: string;
    clearingBy: string;
    actionByPerson: number | null;
    dueDate: Date | null;
    type: string; // TODO: is a null value needed here?
    sorting: number | null;
    priority: number | null;
    estimate: number | null; // TODO: decide how to do. Should be a number, but should be writeable and not selectable
};

export type TempAttachment = { id: string; file: File };

// TODO: figure out whether 0 is a better initial value for number type
const newPunchInitialValues = {
    category: '',
    description: '',
    raisedBy: '',
    clearingBy: '',
    actionByPerson: null,
    dueDate: null,
    type: '',
    sorting: null,
    priority: null,
    estimate: null,
};

const NewPunch = (): JSX.Element => {
    const { api, params } = useCommonHooks();
    const { formFields, createChangeHandler } = useFormFields(
        newPunchInitialValues
    );
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [persons, setPersons] = useState<any>(null); // TODO: add type
    const [sorts, setSorts] = useState<PunchOrganization[]>([]); // TODO add type
    const [priorities, setPriorities] = useState<any[]>([]); // TODO: add type
    const [fetchNewPunchStatus, setFetchNewPunchStatus] = useState(
        AsyncStatus.LOADING
    );
    const [submitPunchStatus, setSubmitPunchStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [checklistDetails, setChecklistDetails] =
        useState<ChecklistDetails>();
    const [tempAttachments, setTempAttachments] = useState<TempAttachment[]>(
        []
    );
    const [showUploadModal, setShowUploadModal] = useState(false);
    const { snackbar, setSnackbarText } = useSnackbar();
    const [showFullImageModal, setShowFullImageModal] = useState(false);
    const [attachmentToShow, setAttachmentToShow] = useState<TempAttachment>();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        // TODO: add new info to the NewPunchDTO
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
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const [
                    categoriesFromApi,
                    typesFromApi,
                    organizationsFromApi,
                    sortsFromApi,
                    prioritiesFromApi,
                    checklistFromApi,
                ] = await Promise.all([
                    api.getPunchCategories(params.plant, source.token),
                    api.getPunchTypes(params.plant, source.token),
                    api.getPunchOrganizations(params.plant, source.token),
                    api.getPunchSorts(params.plant, source.token),
                    api.getPunchPriorities(params.plant, source.token),
                    api.getChecklist(
                        params.plant,
                        params.checklistId,
                        source.token
                    ),
                ]);
                setCategories(categoriesFromApi);
                setTypes(typesFromApi);
                setOrganizations(organizationsFromApi);
                setSorts(sortsFromApi);
                setPriorities(prioritiesFromApi);
                setChecklistDetails(checklistFromApi.checkList);
                setFetchNewPunchStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchNewPunchStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [params.plant, params.checklistId, api]);

    if (submitPunchStatus === AsyncStatus.SUCCESS) {
        return <NewPunchSuccessPage />;
    }

    const content = (): JSX.Element => {
        if (checklistDetails) {
            return (
                <>
                    <NewPunchForm
                        categories={categories}
                        organizations={organizations}
                        persons={persons}
                        types={types}
                        sorts={sorts}
                        priorities={priorities}
                        formData={formFields}
                        buttonText={'Create punch'}
                        createChangeHandler={createChangeHandler}
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
