export interface UserBase {
    _id: string; // Opcional si Mongoose lo genera automáticamente
    username: string;
    email: string;
    password: string;
    photoUrl: string; // Opcional, ya que tiene un valor por defecto
    description: string; // Opcional, ya que tiene un valor por defecto
    state: boolean; // Opcional, ya que tiene un valor por defecto
    createdAt: Date; // Opcional, agregado por timestamps
    updatedAt: Date; // Opcional, agregado por timestamps
    google: boolean;
    website: string; // Opcional, ya que tiene un valor por defecto
    github: string; // Opcional, ya que tiene un valor por defecto
    twitter: string; // Opcional, ya que tiene un valor por defecto
    linkedin: string; // Opcional, ya que tiene un valor por defecto
    projects: number; // Opcional, ya que tiene un valor por defecto
    followers: number; // Opcional, ya que tiene un valor por defecto
    following: number; // Opcional, ya que tiene un valor por defecto
    friends: number; // Opcional, ya que tiene un valor por defecto
    topProjects?: string[]; // Opcional, ya que tiene un valor por defecto
    personalAccessToken?: string; // Opcional, ya que tiene un valor por defecto
}