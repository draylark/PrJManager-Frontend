export interface FollowerBase {
    _id: string; // Opcional si Mongoose lo genera automáticamente
    uid: string; 
    followerId: string;
    active: boolean; // Opcional, ya que tiene un valor por defecto
    mutualFollow: boolean; // Opcional, ya que tiene un valor por defecto
    followedAt: string; // Opcional, ya que tiene un valor por defecto
    createdAt: string; // Opcional, agregado por timestamps
    updatedAt: string; // Opcional, agregado por timestamps
}