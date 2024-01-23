import { Group } from "@ricons/carbon"


export type ProjectType = {
    pid: string
    name: string
    description: string
    endDate: string
    status: string
    owner: string
    priority: string
    tasks: []
    members: []
    tags: []
    files: []
    attachments: []
    clients: []
    comments: []
    startDate: string
    progress: []
    lastUpdated: string
    changeLogs: []
}

export type TaskType = {
    tid: string
    name: string
    description: string
    parentId: string;
    status: string;
    dueDate: Date | null;
    endDate: Date | null;
    projectId: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export type NotiType = {
    _id: string;
    title: string;
    description: string;
    status: boolean;
    to: string;
    by: string;
    createdAt: string;
    updatedAt: string;
}


export type ClientType = {
    cid: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    }
    company: string;
    createdAt: string;
    updatedAt: string;
}

export type EventType = {
    eid: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    allDay: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export type FriendType = {
    fid: string;
    firstName: string;
    lastName: string;
    email: string;
}


export type RepoType = {
    _id: string; // Identificador único del repositorio, generado por MongoDB
    name: string; // Nombre del repositorio
    description: string; // Descripción del repositorio
    project: string; // Identificador del proyecto asociado
    url: string; // URL del repositorio
    collaborators: string[]; // Lista de colaboradores en este repositorio
    branches: string[]; // Lista de ramas en este repositorio
    commits: CommitType[]; // Lista de commits en este repositorio
}


export type LayerType = {


    _id: string; // Identificador único de la capa, generado por MongoDB
    name: string; // Nombre de la capa
    description: string; // Descripción de la capa
    project: string; // Identificador del proyecto asociado
    url: string; // URL de la capa
    collaborators: string[]; // Lista de colaboradores en esta capa
    branches: string[]; // Lista de ramas en esta capa
    commits: CommitType[]; // Lista de commits en esta capa
    repositories: string[]; // Lista de repositorios en esta capa
    events: string[]; // Lista de eventos en esta capa
    createdAt: Date; // Fecha y hora de creación de la capa
    updatedAt: Date; // Fecha y hora de última actualización de la capa
    lastActivityAt: Date; // Fecha y hora de última actividad en la capa
    visibility: string; // Visibilidad de la capa
    shareWithGroupLock: boolean; // Bloqueo de compartir con el grupo
    requireTwoFactorAuthentication: boolean; // Requerir autenticación de dos factores
    twoFactorGracePeriod: number; // Periodo de gracia para autenticación de dos factores
    projectCreationLevel: string; // Nivel de creación de proyectos
    autoDevopsEnabled: boolean; // Activación automática de DevOps
    subgroupCreationLevel: string; // Nivel de creación de subgrupos
    emailsDisabled: boolean; // Desactivar emails
    mentionsDisabled: boolean; // Desactivar menciones
    lfsEnabled: boolean; // Activar LFS
    requestAccessEnabled: boolean; // Activar solicitud de acceso
    parent: string; // Identificador de la capa padre
    sharedRunnersMinutesLimit: number; // Límite de minutos de ejecución de runners compartidos



}

export type GroupType = {

    _id: string; // Identificador único del grupo, generado por MongoDB
    name: string; // Nombre del grupo
    description: string; // Descripción del grupo
    url: string; // URL del grupo
    tasks: string[]; // Lista de tareas en este grupo
    repositories: string[]; // Lista de repositorios en este grupo
    members: string[]; // Lista de miembros en este grupo
    subgroups: string[]; // Lista de subgrupos en este grupo
    events: string[]; // Lista de eventos en este grupo
    createdAt: Date; // Fecha y hora de creación del grupo
    updatedAt: Date; // Fecha y hora de última actualización del grupo
    lastActivityAt: Date; // Fecha y hora de última actividad en el grupo
    visibility: string; // Visibilidad del grupo
    shareWithGroupLock: boolean; // Bloqueo de compartir con el grupo
    requireTwoFactorAuthentication: boolean; // Requerir autenticación de dos factores
    twoFactorGracePeriod: number; // Periodo de gracia para autenticación de dos factores
    projectCreationLevel: string; // Nivel de creación de proyectos
    autoDevopsEnabled: boolean; // Activación automática de DevOps
    subgroupCreationLevel: string; // Nivel de creación de subgrupos
    emailsDisabled: boolean; // Desactivar emails
    mentionsDisabled: boolean; // Desactivar menciones
    lfsEnabled: boolean; // Activar LFS
    requestAccessEnabled: boolean; // Activar solicitud de acceso
    parent: string; // Identificador del grupo padre
    sharedRunnersMinutesLimit: number; // Límite de minutos de ejecución de runners compartidos

}





export type CommitType = {
    _id: string; // Identificador único del commit, generado por MongoDB
    author: string; // Nombre del autor del commit
    email: string; // Email del autor del commit
    date: Date; // Fecha y hora del commit
    message: string; // Mensaje del commit
    changes: ChangeType[]; // Lista de cambios en este commit
    project: string; // Identificador del proyecto asociado
    task: string; // Identificador de la tarea asociada
  }
  
export type ChangeType = {
    file: string; // Ruta del archivo modificado
    additions: number; // Número de líneas añadidas
    deletions: number; // Número de líneas eliminadas
    changes: number; // Número total de cambios (adiciones + eliminaciones)
  }