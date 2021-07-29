import React from 'react';
import { ScopeWrapper } from '../Scope/Scope';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { PunchPreview } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import removeSubdirectories from '../../../utils/removeSubdirectories';
import { InfoItem } from '@equinor/procosys-webapp-components';
import Filter from '../Filter';
import { useState } from 'react';

type PunchListProps = {
    punchList?: PunchPreview[];
    fetchPunchListStatus: AsyncStatus;
};

const PunchList = ({
    punchList,
    fetchPunchListStatus,
}: PunchListProps): JSX.Element => {
    const { history, url } = useCommonHooks();
    const [filteredPunchList, setFilteredPunchList] = useState<
        PunchPreview[] | undefined
    >(punchList);

    return (
        <ScopeWrapper>
            <AsyncPage
                fetchStatus={fetchPunchListStatus}
                errorMessage={
                    'Error: Unable to get punch list. Please try again.'
                }
                emptyContentMessage={'The punch list is empty.'}
            >
                <>
                    <Filter
                        setShownPunches={setFilteredPunchList}
                        punchItems={punchList}
                    />
                    {filteredPunchList?.map((punch) => (
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
                            chips={[punch.formularType, punch.responsibleCode]}
                            tag={punch.tagNo}
                            onClick={(): void =>
                                history.push(
                                    `${removeSubdirectories(
                                        url,
                                        1
                                    )}/punch-item/${punch.id}`
                                )
                            }
                        />
                    ))}
                </>
            </AsyncPage>
        </ScopeWrapper>
    );
};

export default PunchList;
