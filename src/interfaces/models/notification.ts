export interface NotiBase {
    _id: string; // Opcional si Mongoose lo genera automáticamente
    type: 
      | 'friend-request' 
      | 'project-invitation' 
      | 'task-invitation'
      | 'new-follower' 
      | 'new-commit' 
      | 'new-task-commit'
      | 'task-approved' 
      | 'task-assignation'
      | 'task-rejected' 
      | 'added-to-repo' 
      | 'added-to-layer';
    title: string;
    description?: string; // Opcional, ya que tiene un valor por defecto
    status?: boolean; // Opcional, ya que tiene un valor por defecto
    recipient: string;
    from: {
      name: string;
      ID: string;
      photoUrl?: string;
    };
    additionalData: { 
        project_name: string;
        projectID: string, 
        accessLevel: string, 
        ref: string 
    }; // Opcional, ya que tiene un valor por defecto
    createdAt?: string; // Opcional, agregado por timestamps
    updatedAt?: string; // Opcional, agregado por timestamps
}