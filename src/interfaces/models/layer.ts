import { ProjectBase } from "./project";

export interface LayerBase {
    _id: string; // Opcional si Mongoose lo genera automáticamente
    name: string;
    path: string;
    description: string;
    visibility: 'open' | 'internal' | 'restricted';
    project?: string | ProjectBase; 
    repositories?: number; // Opcional, ya que tiene un valor por defecto
    gitlabId?: number;
    status?: boolean; // Opcional, ya que tiene un valor por defecto
    creator: string;
    __v?: number; // Opcional, ya que tiene un valor por defecto
    accessLevel?: string;
    createdAt?: Date | string; // Opcional, agregado por timestamps
    updatedAt?: Date | string; // Opcional, agregado por timestamps
}