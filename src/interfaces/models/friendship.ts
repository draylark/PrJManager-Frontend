export interface FriendshipBase {
    _id: string; // Opcional si Mongoose lo genera automáticamente
    ids: [string, string]; // Array de dos ObjectIds
    active: boolean; // Opcional, ya que tiene un valor por defecto
    createdAt: string; // Opcional, agregado por timestamps
    updatedAt: string; // Opcional, agregado por timestamps
}