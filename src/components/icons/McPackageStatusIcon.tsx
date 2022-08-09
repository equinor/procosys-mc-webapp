import React from 'react';
import { CompletionStatus } from '../../services/apiTypes';
// import OK from '../../assets/img/status/OK.png';
// import OS from '../../assets/img/status/OS.png';
// import PA from '../../assets/img/status/PA.png';
// import PB from '../../assets/img/status/PB.png';

type PackageStatusIconProps = {
    status: CompletionStatus;
};

const determineImage = (status: CompletionStatus): string => {
    // if (status === CompletionStatus.OS) return OS;
    // if (status === CompletionStatus.PA) return PA;
    // if (status === CompletionStatus.PB) return PB;
    // if (status === CompletionStatus.OK) return OK;
    return '';
};

export const McPackageStatusIcon = ({
    status,
}: PackageStatusIconProps): JSX.Element => {
    return (
        <>
            {/* <img
                src={determineImage(status)}
                alt={'MC package status indicator, left side'}
            /> */}
        </>
    );
};
