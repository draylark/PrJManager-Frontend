
import { ProjectBase } from "./project";
import { LayerBase } from "./layer";

export interface RepositoryBase {
    _id: string; 
    name: string;
    description: string;
    visibility: 'open' | 'internal' | 'restricted';
    gitUrl: string;
    webUrl: string;
    branches: {
      _id: string;
      name: string;
      default: boolean;
    }[];
    defaultBranch: string;
    projectID: string | ProjectBase;
    layerID: string | LayerBase;
    gitlabId: number;
    commits: number;
    creator: string;
    accessLevel?: string;
    createdAt?: Date | string; // Opcional, agregado por timestamps
    updatedAt?: Date | string; // Opcional, agregado por timestamps
}