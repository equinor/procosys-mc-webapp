import { Button } from '@equinor/eds-core-react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import useCommonHooks from '../../../utils/useCommonHooks';
import { SearchType } from '../Search';
import useSearchPageFacade from '../useSearchPageFacade';

const CaptureInput = styled.input`
    display: none;
`;

const CaptureButton = styled(Button)`
    position: absolute;
    right: 1.5%;
    top: 7px;
    z-index: 100;
`;

const TagPhotoRecognition = (): JSX.Element => {
    const { appConfig } = useCommonHooks();
    const { query, setQuery } = useSearchPageFacade(SearchType.Tag);
    const captureImageInputRef = useRef<HTMLInputElement>(
        document.createElement('input')
    );
    const onCapture = async (
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const currentFiles = e.currentTarget.files;
        if (!currentFiles) return;
        const uploadHeaders = new Headers();
        uploadHeaders.append('Content-Type', 'multipart/form-data');
        uploadHeaders.append('Accept', 'application/json');
        uploadHeaders.append(
            'Ocp-Apim-Subscription-Key',
            appConfig.ocr.subscriptionKey
        );

        const data = new FormData();
        data.append('photo_to_check', currentFiles[0]);

        const uploadConfig = {
            method: 'POST',
            headers: uploadHeaders,
            body: data,
        };

        const response = await fetch(appConfig.ocr.url, uploadConfig);
        console.log(response);
    };

    return (
        <>
            <CaptureInput
                type="file"
                onChange={onCapture}
                accept="image/*"
                capture="environment"
                ref={captureImageInputRef}
            />
            <CaptureButton
                variant={'ghost_icon'}
                onClick={(): void => captureImageInputRef.current.click()}
            >
                <EdsIcon name="camera_add_photo" />
            </CaptureButton>
        </>
    );
};

export default TagPhotoRecognition;
