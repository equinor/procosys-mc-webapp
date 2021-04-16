import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import ErrorPage from '../../components/error/ErrorPage';
import CommAppContext from '../../contexts/CommAppContext';
import { COLORS } from '../../style/GlobalStyles';
import PageHeader from '../../components/PageHeader';
import Navbar from '../../components/navigation/Navbar';

export const SelectPlantWrapper = styled.main`
    display: flex;
    flex-direction: column;
    & button {
        border-radius: 0;
    }
`;

export const SelectorButton = styled(Link)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    padding: 16px 4%;
    margin: 0 10px;
    position: relative;
    & p {
        margin: 0 30px 0 0;
    }
    &:hover {
        background-color: ${COLORS.fadedBlue};
    }
    & svg {
        position: absolute;
        right: 10px;
    }
`;

const SelectPlant = (): JSX.Element => {
    const { availablePlants } = useContext(CommAppContext);

    const content = (): JSX.Element => {
        if (availablePlants.length < 1) {
            return (
                <ErrorPage
                    title="No plants to show"
                    description="We were able to connect to the server, but there are no plants to show. Make sure you're logged in correctly, and that you have the necessary permissions"
                ></ErrorPage>
            );
        } else {
            return (
                <>
                    <PageHeader title={'Select plant'} />
                    {availablePlants.map((plant) => (
                        <SelectorButton key={plant.id} to={`/${plant.slug}`}>
                            <p>{plant.title}</p>
                            <EdsIcon
                                name="chevron_right"
                                title="chevron right"
                            />
                        </SelectorButton>
                    ))}
                </>
            );
        }
    };

    return (
        <>
            <Navbar leftContent={{ name: 'hamburger' }} />
            <SelectPlantWrapper>{content()}</SelectPlantWrapper>
        </>
    );
};

export default SelectPlant;
