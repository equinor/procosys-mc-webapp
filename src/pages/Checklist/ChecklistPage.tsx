import React from 'react';
import EdsIcon from '../../components/icons/EdsIcon';
import FooterButton from '../../components/navigation/FooterButton';
import Navbar from '../../components/navigation/Navbar';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import withAccessControl from '../../services/withAccessControl';
import useCommonHooks from '../../utils/useCommonHooks';

const ChecklistPage = (): JSX.Element => {
    const { history, url } = useCommonHooks();
    return (
        <>
            {
                // TODO: ask whether MCCR is the correct title for the page
            }
            <Navbar
                leftContent={{ name: 'back' }}
                midContent={'MCCR'}
                rightContent={{ name: 'newPunch' }}
            />
            {
                // TODO: add details card (which one??)
            }
            {
                // TODO: ask whether all content needs the bottom spaces from checklist wrapper, is yes: add a wrapper to content
            }
            {
                // TODO: add a switch that routes to the correct component
            }
            <NavigationFooter>
                {
                    // TODO: add correct urls
                }
                {
                    // TODO: ask abour number of items in checklist footer button, what is it?
                }
                <FooterButton
                    active={true}
                    goTo={(): void => history.push(`${url}/scope`)}
                    icon={<EdsIcon name="list" />}
                    label={'Checklist'}
                    numberOfItems={312}
                />
                <FooterButton
                    active={false}
                    goTo={(): void => history.push(`${url}/scope`)}
                    icon={<EdsIcon name="info_circle" />}
                    label={'Tag info'}
                />
                {
                    // TODO: change numberOfItems to length of punch list
                }
                <FooterButton
                    active={false}
                    goTo={(): void => history.push(`${url}/scope`)}
                    icon={<EdsIcon name="warning_filled" />}
                    label={'Punch list'}
                    numberOfItems={234}
                />
            </NavigationFooter>
        </>
    );
};

export default withAccessControl(ChecklistPage, []);
