import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { useHistory, useRouteMatch } from 'react-router-dom';
import CompletionStatusIcon from '../../components/icons/CompletionStatusIcon';
import { CompletionStatus } from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';

export const CommPkgFooterBase = styled.div`
    width: 100%;
    max-width: 768px;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1) 25%,
        rgba(255, 255, 255, 1)
    );
    display: flex;
    height: 100px;
`;

const CommPkgFooterWrapper = styled(CommPkgFooterBase)`
    padding-bottom: 5px;
    justify-content: space-evenly;
    align-items: flex-end;
`;

const FooterButton = styled.button<{ active: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: none;
    flex: 1;
    cursor: pointer;
    height: 75px;
    max-width: 100px;
    margin: 0 15px 0 15px;
    padding: 20px 0 0 0;
    opacity: ${(props): string => (props.active ? '1' : '0.8')};
    background-color: ${COLORS.white};
    position: relative;
    & img {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }
    & p {
        margin: 0;
        font-weight: ${(props): string =>
            props.active ? 'initial' : 'initial'};
        border-bottom: ${(props): string =>
            props.active ? `3px solid ${COLORS.darkGrey}` : 'initial'};
        margin-bottom: ${(props): string => (props.active ? '3px' : 'initial')};
    }
    &:focus,
    &:hover,
    &:active {
        background-color: initial;
        outline: none;
    }
`;

const ItemCount = styled.span`
    position: absolute;
    top: 5px;
    right: 15px;
    background-color: #f0f0f0;
    border-radius: 15px;
    min-width: 16px;
    padding: 4px 5px 2px 5px;
    & p {
        text-align: center;
        font-size: 12px;
        color: ${COLORS.black};
        border: none;
    }
`;

const ButtonText = styled.div`
    position: relative;
`;

type CommPkgFooterProps = {
    numberOfChecklists: number;
    numberOfTasks: number;
    numberOfPunches: number;
    status: CompletionStatus;
};

const NavigationFooter = ({
    numberOfChecklists,
    numberOfTasks,
    numberOfPunches,
    status,
}: CommPkgFooterProps): JSX.Element => {
    const history = useHistory();
    const { url } = useRouteMatch();

    return (
        <CommPkgFooterWrapper>
            <FooterButton
                data-testid="scope-button"
                active={history.location.pathname.includes('/scope')}
                onClick={(): void => history.push(`${url}/scope`)}
            >
                {numberOfChecklists > 0 && (
                    <ItemCount>
                        <p>{numberOfChecklists}</p>
                    </ItemCount>
                )}
                <EdsIcon name="list" />
                <ButtonText>
                    <p>Scope</p>
                </ButtonText>
            </FooterButton>
            <FooterButton
                active={history.location.pathname.includes('/tasks')}
                onClick={(): void => history.push(`${url}/tasks`)}
            >
                {numberOfTasks > 0 && (
                    <ItemCount>
                        <p>{numberOfTasks}</p>
                    </ItemCount>
                )}
                <EdsIcon name="paste" />
                <ButtonText>
                    <p>Tasks</p>
                </ButtonText>
            </FooterButton>
            <FooterButton
                active={history.location.pathname.includes('/punch-list')}
                onClick={(): void => history.push(`${url}/punch-list`)}
            >
                {numberOfPunches > 0 && (
                    <ItemCount>
                        <p>{numberOfPunches}</p>
                    </ItemCount>
                )}
                {status === CompletionStatus.OK ? (
                    <EdsIcon name="warning_filled" alt="punch list" />
                ) : (
                    <CompletionStatusIcon status={status} />
                )}
                <ButtonText>
                    <p>Punch list</p>
                </ButtonText>
            </FooterButton>
        </CommPkgFooterWrapper>
    );
};

export default NavigationFooter;
