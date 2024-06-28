import React from 'react';
import { Button, Typography } from '@equinor/eds-core-react';
import styled from 'styled-components';

const LandingPageWrapper = styled.main`
    width: 100vw;
    & h4 {
        margin-top: 0;
        margin-bottom: 12px;
    }
`;
const AppSection = styled.section`
    height: 50vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const CommAppSection = styled(AppSection)`
    background-color: #ffecf0;
`;

function App() {
    return (
        <LandingPageWrapper>
            <CommAppSection>
                <div
                    style={{
                        display: 'flex',
                        textAlign: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 36,
                        backgroundColor: 'white',
                        borderRadius: '10px',
                    }}
                >
                    <Typography variant={'h4'}>
                        This domain has been retired, click on the button below
                        to be redirected to the new page
                    </Typography>
                    <Typography variant={'h4'}>
                        If you have this page as a favorite, please change it to
                        the new URL
                    </Typography>
                    <a href={'https://apps.procosys.equinor.com'}>
                        <Button color={'danger'}>
                            Go to apps.procosys.equinor.com
                        </Button>
                    </a>
                </div>
            </CommAppSection>
        </LandingPageWrapper>
    );
}

export default App;
