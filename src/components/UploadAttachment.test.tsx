import { render, screen } from '@testing-library/react';
import { withPlantContext } from '../test/contexts';
import UploadAttachment from './UploadAttachment';
import React, { Dispatch, SetStateAction } from 'react';

const renderUploadModal = (): void => {
    render(
        withPlantContext({
            Component: (
                <UploadAttachment
                    parentId={'123'}
                    updateAttachments={(): void => {
                        return;
                    }}
                    setSnackbarText={(): void => {
                        return;
                    }}
                    setShowModal={(): void => {
                        return;
                    }}
                    postAttachment={(): Promise<void> => {
                        return Promise.resolve();
                    }}
                />
            ),
        })
    );
};

describe('<UploadAttachment/>', () => {
    it('Renders modal', () => {
        renderUploadModal();
        expect(screen.getByText('Choose image...')).toBeInTheDocument();
    });
    test.todo('It allows user to select an image');
    test.todo('It allows user to upload the image');
    test.todo('It renders an error message if image upload fails');
});
