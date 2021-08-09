import React from 'react';
import styled from 'styled-components';
import { Banner, Button } from '@equinor/eds-core-react';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../icons/EdsIcon';
import useCommonHooks from '../../utils/useCommonHooks';

interface WebAppError {
    title: string;
    description?: string;
    actions?: JSX.Element[];
}

const ErrorPageWrapper = styled.main`
    display: flex;
    flex-direction: column;
`;

const ErrorPage = ({
    title,
    description,
    actions,
}: WebAppError): JSX.Element => {
    const { params, history } = useCommonHooks();
    // bruk below hvis common hooks et problem
    //const history = useHistory();
    return (
        <ErrorPageWrapper>
            <Banner>
                <Banner.Icon variant={'warning'}>
                    <EdsIcon
                        color={COLORS.danger}
                        name="error_outlined"
                        title="Error icon"
                    />
                </Banner.Icon>
                <Banner.Message variant="h4">{title}</Banner.Message>
            </Banner>
            {description && description.length > 0 && (
                <Banner>
                    <Banner.Icon>
                        <EdsIcon name="info_circle" title="Error icon" />
                    </Banner.Icon>
                    <Banner.Message>{description}</Banner.Message>
                    {actions ? (
                        <Banner.Actions placement={'bottom'}>
                            {actions.map((button) => button)}
                        </Banner.Actions>
                    ) : (
                        <Banner.Actions placement={'bottom'}>
                            <Button
                                onClick={(): void => window.location.reload()}
                            >
                                Refresh
                            </Button>
                            <Button onClick={(): void => history.push(``)}>
                                Home
                            </Button>
                        </Banner.Actions>
                    )}
                </Banner>
            )}
        </ErrorPageWrapper>
    );
};

export default ErrorPage;
