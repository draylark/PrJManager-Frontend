import {  NotiType, TaskType, ClientType, EventType, FriendType, RepoType, CommitType} from "./stateTypes";
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

export interface Notification {
    notis: NotiType[];
    isSaving: boolean;
}

export interface Project {
    projects: ProjectBase[];
    current: string[],
    topProjects: string[],
    loading: boolean,
    error: string | null,
}

export interface Task {
    tasks: TaskType[],
    current: string[],
    loading: false,
    error: null,
}

export interface Client {
    clients: ClientType[],
    current: string[],
    loading: false,
    error: null,
}


export interface Event {
    events: EventType[],
    current: string[],
    loading: false,
    error: null,
}

export interface Friend {
    friends: FriendType[],
    current: [],
    loading: false,
    error: null,
}


export interface Repository {
    repos: RepoType[],
    current: [],
    loading: boolean,
    error: null,
}

export interface Commit {
    commits: CommitType[],
    current: [],
    loading: false,
    error: null,
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
