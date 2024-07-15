export interface ProjectBase {
    pid: string; 
    name: string;
    description: string;
    visibility: 'public' | 'private'; 
    startDate: Date | string; 
    endDate: Date | string;
    lastUpdated: Date; 
    tags: string[];
    priority: string;
    collaborators: number; 
    layers: number; 
    repositories: number; 
    commits: number; 
    completedTasks: number; 
    tasks: number; 
    praises: number;
    readme: string | null;
    owner: string;
    accessLevel?: string;
    createdAt?: string | Date; // Opcional, agregado por timestamps
    updatedAt?: Date; // Opcional, agregado por timestamps
}
  