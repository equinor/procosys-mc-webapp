import { CollapsibleCard } from '@equinor/procosys-webapp-components';
import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import AsyncPage from '../../../components/AsyncPage';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { AdditionalTagField, TagDetails } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';

type TagInfoProps = {
    tagId?: number;
};

const TagInfo = ({ tagId }: TagInfoProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [fetchTagStatus, setFetchTagStatus] = useState(AsyncStatus.LOADING);
    const [tagDetails, setTagDetails] = useState<TagDetails>();
    const [additionalFields, setAdditionalFields] = useState<
        AdditionalTagField[]
    >([]);
    const { token, cancel } = axios.CancelToken.source();

    useEffect(() => {
        if (!tagId) return;
        (async (): Promise<void> => {
            try {
                const tagResponse = await api.getTag(
                    params.plant,
                    tagId,
                    token
                );
                setTagDetails(tagResponse.tag);
                setAdditionalFields(tagResponse.additionalFields);
                setFetchTagStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                console.log(error);
                setFetchTagStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            cancel('Tag info component unmounted');
        };
    }, [tagId]);

    return (
        <AsyncPage
            fetchStatus={fetchTagStatus}
            errorMessage={'Unable to load tag info. Please try again.'}
        >
            <CollapsibleCard cardTitle={'Main tag info'}>
                <>
                    <h6>Tag number:</h6>
                    {tagDetails?.tagNo}
                </>
            </CollapsibleCard>
        </AsyncPage>
    );
};

export default TagInfo;
