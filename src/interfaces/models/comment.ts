export interface CommentBase {
    _id: string; // Opcional si Mongoose lo genera automáticamente
    content: string;
    project: string;
    createdBy: string; 
    commentParent: string| null;
    answering_to: string | null;
    likes: number; // Opcional, ya que tiene un valor por defecto
    replies: number; // Opcional, ya que tiene un valor por defecto
    total_pages: number; // Opcional, ya que tiene un valor por defecto
    state: boolean; // Opcional, ya que tiene un valor por defecto
    createdAt: Date; // Opcional, agregado por timestamps
    updatedAt: Date; // Opcional, agregado por timestamps
}