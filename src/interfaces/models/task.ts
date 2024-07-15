import { ProjectBase } from './project';
import { LayerBase } from './layer';
import { RepositoryBase } from './repository';
import { UserBase } from './user';



export interface TaskBase {
    _id: string; // Opcional si Mongoose lo genera automáticamente
    type: 'open' | 'assigned';
    repository_number_task?: string | null;
    task_name: string;
    task_description: string;
    project: string | ProjectBase;
    layer_related_id: string | LayerBase;
    repository_related_id: string | RepositoryBase;
    goals: string[];
    commits_hashes: string[];
    status: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    conclusion_date?: Date;
    additional_info: {
      estimated_hours: number;
      actual_hours: number;
      notes: (string | null)[];
    };
    reasons_for_rejection: ReasonForRejection[];
    assigned_to: string| null;
    contributorsIds: string[] | PopulatedContributorsIds[];
    readyContributors: ReadyContributor[];
    reviewSubmissionDate?: Date | null;
    reviewSubmissionDates: Date[];
    deadline: Date | string;
    completed_at?: string | null;
    creator: string;
    createdAt: string; // Opcional, agregado por timestamps
    updatedAt: string; // Opcional, agregado por timestamps
}


export interface PopulatedContributorsIds extends Pick<UserBase, 'username' | 'photoUrl' | '_id'> {}

export interface ModifiedTaskBase extends Omit<TaskBase, 'contributorsIds'> {
    contributors: PopulatedContributorsIds[];
}

interface ReasonForRejection {
    uid: string | UserBase;
    text: string;
    date: Date;
    taskSubmissionDate?: Date | null;
}

interface ReadyContributor {
    uid: string | UserBase;
    date: Date;
    me: boolean;
}

export interface PLRPopulatedTask extends TaskBase {
    project: ProjectBase;
    layer_related_id: LayerBase;
    repository_related_id: RepositoryBase;
}

export interface PopulatedContributor {
    _id: string;
    uid: Pick<UserBase, '_id' | 'username' | 'photoUrl'>;
    date: string;
    me: boolean;
}

export interface PopulatedReasonForRejection {
    _id: string;
    uid: Pick<UserBase, '_id' | 'username' | 'photoUrl'>;
    text: string;
    date: string;
    taskSubmissionDate: string;
}

export interface WorkspaceTask extends Omit<TaskBase, 'project' | 'layer_related_id' | 'repository_related_id' | 'readyContributors' | 'reasons_for_rejection'> {
    project: ProjectBase;
    layer_related_id: LayerBase;
    repository_related_id: RepositoryBase;
    readyContributors: PopulatedContributor[];
    reasons_for_rejection: PopulatedReasonForRejection[];
}