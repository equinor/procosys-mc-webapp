import { Project } from '../../services/apiTypes';
import { FakerProject } from './fakerSimpleTypes';

export const CreateProjectList = (count: number): Array<Project> => {
    const projects = new Array<Project>();
    for (let i = 0; i < count; i++) {
        projects.push(FakerProject());
    }
    return projects;
};
