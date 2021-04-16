import React, { useContext } from 'react';
import EdsIcon from '../../components/icons/EdsIcon';
import Navbar from '../../components/navigation/Navbar';
import PageHeader from '../../components/PageHeader';
import PlantContext from '../../contexts/PlantContext';
import { SelectPlantWrapper, SelectorButton } from '../SelectPlant/SelectPlant';
import AsyncPage from '../../components/AsyncPage';

const SelectProject = (): JSX.Element => {
    const {
        availableProjects: projects,
        currentPlant,
        fetchProjectsAndPermissionsStatus,
    } = useContext(PlantContext);

    return (
        <>
            <Navbar leftContent={{ name: 'hamburger' }} />
            <SelectPlantWrapper>
                <AsyncPage
                    fetchStatus={fetchProjectsAndPermissionsStatus}
                    errorMessage={'Unable to load projects. Please try again.'}
                    emptyContentMessage={
                        'There are no projects available. Try selecting a different plant.'
                    }
                >
                    <>
                        <PageHeader
                            title={'Select project'}
                            subtitle={currentPlant?.title}
                        />
                        {projects?.map((project) => (
                            <SelectorButton
                                key={project.id}
                                to={`/${currentPlant?.slug}/${project.title}`}
                            >
                                <div>
                                    <label>{project.title}</label>
                                    <p>{project.description}</p>
                                </div>
                                <EdsIcon
                                    name="chevron_right"
                                    title="chevron right"
                                />
                            </SelectorButton>
                        ))}
                    </>
                </AsyncPage>
            </SelectPlantWrapper>
        </>
    );
};

export default SelectProject;
