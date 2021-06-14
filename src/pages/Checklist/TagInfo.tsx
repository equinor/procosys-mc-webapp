import { CollapsibleCard } from '@equinor/procosys-webapp-components';
import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import AsyncPage from '../../components/AsyncPage';
import { AsyncStatus } from '../../contexts/McAppContext';
import { AdditionalTagField, TagDetails } from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import useCommonHooks from '../../utils/useCommonHooks';

const InfoRow = styled.div`
    & > p {
        margin: 0;
        margin-bottom: 12px;
    }
    & > label {
        color: ${COLORS.darkGrey};
    }
`;

export const TagInfoWrapper = styled.main`
    min-height: calc(100vh - 203px);
    margin-bottom: 66px;
    box-sizing: border-box;
    padding: 4% 16px;
`;

type TagInfoProps = {
    tagId?: number;
};

const TagInfo = ({ tagId }: TagInfoProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [fetchTagStatus, setFetchTagStatus] = useState(AsyncStatus.LOADING);
    const [tagInfo, setTagInfo] = useState<TagDetails>();
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
                setTagInfo(tagResponse.tag);
                setAdditionalFields(tagResponse.additionalFields);
                setFetchTagStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchTagStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            cancel('Tag info component unmounted');
        };
    }, [tagId]);

    const infoRow = (
        label: string,
        value: string | null | undefined,
        code?: string | null
    ): JSX.Element => {
        return (
            <InfoRow>
                <label>{label}</label>
                <p>
                    {code ? `${code}, ` : ''}
                    {value ?? '-'}
                </p>
            </InfoRow>
        );
    };

    const isValidValue = (value: string | null): boolean => {
        if (typeof value === 'string' && value.length > 0) return true;
        return false;
    };

    const additionalFieldRow = (
        label: string,
        value: string | null,
        unit: string | null,
        key: number
    ): JSX.Element => {
        return (
            <InfoRow key={key}>
                <label>{label}</label>
                <p>
                    {isValidValue(value) ? value : '-'}{' '}
                    {isValidValue(value) && isValidValue(unit) ? unit : ''}
                </p>
            </InfoRow>
        );
    };

    return (
        <AsyncPage
            fetchStatus={fetchTagStatus}
            errorMessage={'Unable to load tag info. Please try again.'}
        >
            <TagInfoWrapper>
                <CollapsibleCard cardTitle={'Main tag info'}>
                    {infoRow('Tag number', tagInfo?.tagNo)}
                    {infoRow('Description', tagInfo?.description)}
                    {infoRow(
                        'Register',
                        tagInfo?.registerCode,
                        tagInfo?.registerDescription
                    )}
                    {infoRow(
                        'Tag function',
                        tagInfo?.tagFunctionDescription,
                        tagInfo?.tagFunctionCode
                    )}
                    {infoRow(
                        'System',
                        tagInfo?.systemDescription,
                        tagInfo?.systemCode
                    )}
                    {infoRow('Sequence', tagInfo?.sequence)}
                    {infoRow(
                        'Discipline',
                        tagInfo?.disciplineDescription,
                        tagInfo?.disciplineCode
                    )}
                    {infoRow(
                        'Area',
                        tagInfo?.areaDescription,
                        tagInfo?.areaCode
                    )}
                    {infoRow('Project', tagInfo?.projectDescription)}
                    {infoRow('MC Pkg', tagInfo?.mcPkgNo)}
                    {infoRow(
                        'Purchase order',
                        tagInfo?.purchaseOrderTitle,
                        tagInfo?.purchaseOrderNo
                    )}
                    {infoRow(
                        'Status',
                        tagInfo?.statusDescription,
                        tagInfo?.statusCode
                    )}
                    {infoRow(
                        'Engineering',
                        tagInfo?.engineeringCodeDescription,
                        tagInfo?.engineeringCodeCode
                    )}
                    {infoRow(
                        'Contractor',
                        tagInfo?.contractorDescription,
                        tagInfo?.contractorCode
                    )}
                    {infoRow('Mounted on', tagInfo?.mountedOnTagNo)}
                    {infoRow('Remark', tagInfo?.remark)}
                </CollapsibleCard>
                <CollapsibleCard cardTitle={'Details'}>
                    {additionalFields.map((field) =>
                        additionalFieldRow(
                            field.label,
                            field.value,
                            field.unit,
                            field.id
                        )
                    )}
                </CollapsibleCard>
            </TagInfoWrapper>
        </AsyncPage>
    );
};

export default TagInfo;
