import React from 'react';
import styled from 'styled-components';
import { Banner } from '@equinor/eds-core-react';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../icons/EdsIcon';

interface CommError {
    title: string;
    description?: string;
    actions?: JSX.Element[];
}

const ErrorPageWrapper = styled.main`
    display: flex;
    flex-direction: column;
`;

const ErrorPage = ({ title, description, actions }: CommError): JSX.Element => {
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
                    ) : null}
                </Banner>
            )}
        </ErrorPageWrapper>
    );
};

export default ErrorPage;
