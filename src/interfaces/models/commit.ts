import { RepositoryBase } from "./repository";
import { TaskBase } from "./task";

export interface CommitBase{
    _id: string; // Opcional si Mongoose lo genera automáticamente
    project: string;
    layer: string;
    repository: string | RepositoryBase;
    branch: string;
    date: Date;
    author: {
      uid: string;
      name: string;
      photoUrl?: string;
    };
    message: string;
    hash: string;
    uuid: string;
    associated_task: null | string | TaskBase ;
    createdAt: string; // Opcional, agregado por timestamps
    updatedAt: Date; // Opcional, agregado por timestamps
}

export interface CommitWithATPopulated extends Omit<CommitBase, 'associated_task'> {
    associated_task: TaskBase | null;
}

export interface CommitForWTask extends Pick<CommitBase, '_id' | 'uuid' | 'createdAt' | 'author'> {}