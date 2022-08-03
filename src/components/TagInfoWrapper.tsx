import { TagInfo } from '@equinor/procosys-webapp-components';
import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { AsyncStatus } from '../contexts/McAppContext';
import { AdditionalTagField, TagDetails } from '../services/apiTypes';
import useCommonHooks from '../utils/useCommonHooks';

type TagInfoWrapperProps = {
    tagId?: number;
};

const TagInfoWrapper = ({ tagId }: TagInfoWrapperProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [fetchTagStatus, setFetchTagStatus] = useState(AsyncStatus.LOADING);
    const [tagInfo, setTagInfo] = useState<TagDetails>();
    const [additionalFields, setAdditionalFields] = useState<
        AdditionalTagField[]
    >([]);
    const controller = new AbortController();
    const abortSignal = controller.signal;

    useEffect(() => {
        if (!tagId) return;
        (async (): Promise<void> => {
            try {
                const tagResponse = await api.getTag(
                    params.plant,
                    tagId,
                    abortSignal
                );
                setTagInfo(tagResponse.tag);
                setAdditionalFields(tagResponse.additionalFields);
                setFetchTagStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchTagStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            controller.abort('Tag info component unmounted');
        };
    }, [tagId]);

    return (
        <>
            <TagInfo
                tagInfo={tagInfo}
                fetchTagStatus={fetchTagStatus}
                additionalFields={additionalFields}
            />
        </>
    );
};

export default TagInfoWrapper;
