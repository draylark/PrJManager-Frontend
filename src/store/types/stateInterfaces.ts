import { ProjectBase } from "../../interfaces/models/project";
import { LayerBase } from "../../interfaces/models/layer";
import { RepositoryBase } from '../../interfaces/models/repository';


interface TopProjects {
    _id: string;
    name: string;
}

export interface Auth {
    status: string;
    uid: string | null;
    email: string | null;
    username: string | null;
    photoUrl: string | null;
    description: string | null;
    followers: number;
    topProjects: TopProjects[];
    website: string | null;
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
    errorMessage: string | null;
    state: boolean  // <-- Reemplaza 'any' con el tipo apropiado si es posible
    gitlabAuth: boolean;    
}

export interface Project {
    projects: ProjectBase[];
    current: string[],
    topProjects: string[],
    loading: boolean,
    error: string | null,
}


export interface Platypus {
    currentProject: ProjectBase | null,
    layers: LayerBase[],
    repositories: RepositoryBase[],
    fetchingResources: boolean,
    errorWhileFetching: boolean | null,
    errorMessage: string | null,
    errorType: string | null,
}
