import { InfoItem } from '@equinor/procosys-webapp-components';
import React from 'react';
import styled from 'styled-components';
import AsyncPage from '../../components/AsyncPage';
import { AsyncStatus } from '../../contexts/McAppContext';
import { PunchPreview } from '../../services/apiTypes';
import removeSubdirectories from '../../utils/removeSubdirectories';
import useCommonHooks from '../../utils/useCommonHooks';

const FillHeightWrapper = styled.div`
    min-height: calc(100vh - 203px);
    margin-bottom: 66px;
    box-sizing: border-box;
`;

type ChecklistPunchListProps = {
    punchList?: PunchPreview[];
    fetchPunchListStatus: AsyncStatus;
};

const ChecklistPunchList = ({
    punchList,
    fetchPunchListStatus,
}: ChecklistPunchListProps): JSX.Element => {
    const { history, url } = useCommonHooks();
    return (
        <AsyncPage
            fetchStatus={fetchPunchListStatus}
            errorMessage={'Unable to get punch list. Please try again.'}
            emptyContentMessage={'The punch list is empty.'}
        >
            <FillHeightWrapper>
                {punchList?.map((punch) => (
                    <InfoItem
                        key={punch.id}
                        status={punch.status}
                        statusLetters={[
                            punch.cleared ? 'C' : null,
                            punch.verified ? 'V' : null,
                        ]}
                        attachments={punch.attachmentCount}
                        headerText={punch.id.toString()}
                        description={punch.description}
                        onClick={(): void =>
                            history.push(
                                `${removeSubdirectories(url, 1)}/punch-item/${
                                    punch.id
                                }`
                            )
                        }
                    />
                ))}
            </FillHeightWrapper>
        </AsyncPage>
    );
};

export default ChecklistPunchList;
