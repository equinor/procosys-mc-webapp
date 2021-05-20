import React from 'react';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { PunchPreview } from '../../../services/apiTypes';

const Punch = (punch: PunchPreview): JSX.Element => {
    return (
        <>
            {
                // TODO: exchange empty tag above w. preview button imported from scopeItem
            }
            <>
                {
                    // TODO: exchange empty tag above w. status image wrapper imported from McDetails
                }
                <CompletionStatusIcon status={punch.status} />
                <>
                    {
                        // TODO: exchange empty tag above w. statusTextWrapper imported from scopeItem
                    }
                    {
                        // TODO: add the status text things (once checked which they are & pulled the correct punch type version)
                    }
                </>
            </>
            <>
                {
                    // TODO: exchange empty tag above w. DetailsWrapper imported from McDetails
                }
                {
                    // TODO: add caption containing punch nr.
                }
                <>
                    {
                        // TODO: exchange empty tag above w. DetailsHeaderWrapper imported from ScopeItem
                    }
                    {
                        // TODO: add captions with: tagNo, formularType & responsibleCode
                    }
                </>
                <>
                    {
                        // TODO: exchange empty tag above w. DetailsBodyWrapper imported from ScopeItem
                    }
                </>
            </>
        </>
    );
};

export default Punch;
