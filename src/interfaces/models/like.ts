export interface LikeBase {
    _id: string; // Opcional si Mongoose lo genera automáticamente
    uid: string;
    commentId: string;
    isLike: boolean;
    createdAt: Date; // Opcional, agregado por timestamps
    updatedAt: Date; // Opcional, agregado por timestamps
}