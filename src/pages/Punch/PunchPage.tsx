import React from 'react';
import withAccessControl from '../../services/withAccessControl';

const PunchPage = (): JSX.Element => {
    return (
        <>
            {
                // TODO: add navbar back goes to checklist punch list, + goes to new punch
                //(should new punch go somewhere else if user starts on punch page as opposed to the checklist page?)
            }
            {
                // TODO: add details (looks like a new one, check details card in clear punch & the old app)
            }
            {
                // TODO: add a switch to route within the punch page
            }

            {
                // TODO: add a footer
            }
        </>
    );
};

// TODO: change the permissions to the correct one(s)
export default withAccessControl(PunchPage, [
    'MCCR/READ',
    'PUNCHLISTITEM/READ',
]);
