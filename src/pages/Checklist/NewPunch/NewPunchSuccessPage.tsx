import { Button } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../../../components/icons/EdsIcon';
import removeSubdirectories from '../../../utils/removeSubdirectories';
import useCommonHooks from '../../../utils/useCommonHooks';

const ButtonGroup = styled.div`
    display: flex;
    & button:first-of-type {
        margin-right: 16px;
    }
`;

const NewPunchSuccess = styled.div`
    padding: 0 4%;
    margin-top: 48px;
    height: calc(100vh - 54px);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const NewPunchSuccessPage = (): JSX.Element => {
    const { history, params, url } = useCommonHooks();
    return (
        <NewPunchSuccess>
            <EdsIcon name="check" size={40} />
            <h4>Successfully added new punch</h4>
            <ButtonGroup>
                <Button
                    onClick={(): void =>
                        history.push(removeSubdirectories(url, 1))
                    }
                >
                    Back to checklist
                </Button>
                <Button
                    onClick={(): void =>
                        history.push(
                            `/${params.plant}/${params.project}/${params.commPkg}/punch-list`
                        )
                    }
                >
                    Go to punch list
                </Button>
            </ButtonGroup>
        </NewPunchSuccess>
    );
};

export default NewPunchSuccessPage;
