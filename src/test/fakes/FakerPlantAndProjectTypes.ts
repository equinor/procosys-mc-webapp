import { faker } from '@faker-js/faker';
import { Plant, Project } from '../../services/apiTypes';
import { CreateProjectList } from './fakerCreateProjectListType';
import { FakerId, FakerTitle, FakerDescription } from './fakerSimpleTypes';

export const FakerPlant = (count: number): Plant => {
    return {
        id: FakerId().toString(),
        title: faker.lorem.paragraph(1),
        slug: 'slug',
        projects: CreateProjectList(count),
    };
};

export const FakerProject = (): Project => {
    return {
        description: FakerDescription(),
        id: FakerId(),
        title: FakerTitle(),
    };
};
