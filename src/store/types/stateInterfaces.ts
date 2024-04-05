import { Gitlab } from "@ricons/fa";
import { ProjectType, NotiType, TaskType, ClientType, EventType, FriendType, RepoType, GroupType, LayerType, CommitType} from "./stateTypes";

export interface Auth {
    status: string;
    uid: string | null;
    email: string | null;
    username: string | null;
    photoURL: string | null;
    description: string | null;
    site: string | null;
    gitlabAuth: boolean;
    errorMessage: string | null;
    state: boolean  // <-- Reemplaza 'any' con el tipo apropiado si es posible
    friendsRequests: string[];
    friends: string[];
}

export interface Notification {
    notis: NotiType[];
    isSaving: boolean;
}

export interface Project {
    projects: ProjectType[];
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
    currentProject: ProjectType | null,
    layers: LayerType[],
    currentLayer: LayerType | null,
    layerRepositories: RepoType[],
}
