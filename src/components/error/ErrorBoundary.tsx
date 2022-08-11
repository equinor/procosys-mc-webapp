import React, { ErrorInfo } from 'react';
import {
    ErrorPage,
    HomeButton,
    ReloadButton,
} from '@equinor/procosys-webapp-components';

type ErrorProps = {
    children: JSX.Element;
};

type ErrorState = {
    name?: string;
    message?: string;
    hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
    constructor(props: ErrorProps) {
        super(props);
        this.state = { hasError: false, message: '', name: '' };
    }

    static getDerivedStateFromError(): ErrorState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({
            ...this.state,
            message: error.message,
            name: error.name,
        });
        // console.error('CRITICAL ERROR OCCURED');
        // console.error('Error: ', error);
        // console.error('ErrorInfo: ', errorInfo);
    }

    render(): JSX.Element {
        if (this.state.hasError) {
            return (
                <ErrorPage
                    title={this.state.name ?? ''}
                    description={this.state.message ?? ''}
                    actions={[
                        <ReloadButton key={'reload'} />,
                        <HomeButton key={'home'} />,
                    ]}
                />
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
