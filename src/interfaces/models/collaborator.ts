import { ProjectBase } from "./project";
import { LayerBase } from "./layer";
import { RepositoryBase } from "./repository";

export interface CollaboratorBase {
    _id: string; // Opcional si Mongoose lo genera automáticamente
    project?: {
      _id: string | ProjectBase;
      accessLevel: 'contributor' | 'coordinator' | 'manager' | 'administrator';
    };
    layer?: {
      _id: string | LayerBase;
      accessLevel: 'contributor' | 'coordinator' | 'manager' | 'administrator';
    };
    repository?: {
      _id: string | RepositoryBase;
      accessLevel: 'reader' | 'editor' | 'manager' | 'administrator';
      layer: string;
    };
    projectID: string;
    uid: string;
    name: string; // Opcional, ya que tiene un valor por defecto
    photoUrl: string | null; // Opcional, ya que tiene un valor por defecto
    state: boolean; // Opcional, ya que tiene un valor por defecto
}