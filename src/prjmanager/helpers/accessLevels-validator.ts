import { ProjectBase } from "../../interfaces/models/project";
import { LayerBase } from "../../interfaces/models/layer";
import { RepositoryBase } from "../../interfaces/models/repository";



export const tierS = (uid: string, project: ProjectBase | null, layer?: LayerBase | null, repository?: RepositoryBase | null ): boolean => {
    if( project && layer && repository ) {
        const hasAccess = 
            uid === project?.owner
            || project?.accessLevel === 'administrator'
            || layer?.accessLevel === 'administrator'
            || repository?.accessLevel === 'administrator'
        return hasAccess
    } else if ( project && layer ) {
        const hasAccess = 
            uid === project?.owner
            || project?.accessLevel === 'administrator'
            || layer?.accessLevel === 'administrator'
        return hasAccess
    } else {
        const hasAccess = 
        uid === project?.owner
        || project?.accessLevel === 'administrator'
        return hasAccess      
    }
};


export const tierA = (uid: string, project: ProjectBase | null, layer?: LayerBase | null, repository?: RepositoryBase | null ): boolean => {
    if( project && layer && repository ) {
        const hasAccess = 
            uid === project.owner
            || project?.accessLevel === 'coordinator'
            || layer?.accessLevel === 'coordinator'
            || repository?.accessLevel === 'coordinator'
        return hasAccess
    } else if ( project && layer ) {
        const hasAccess = 
            uid === project.owner
            || project?.accessLevel === 'coordinator'
            || layer?.accessLevel === 'coordinator'
        return hasAccess
    } else {
        const hasAccess = 
        uid === project?.owner
        || project?.accessLevel === 'coordinator'
        || project?.accessLevel === 'coordinator'
        return hasAccess      
    }
};


export const tierB = (uid: string, project: ProjectBase | null, layer?: LayerBase | null, repository?: RepositoryBase | null ): boolean =>  {
    if( project && layer && repository ) {
        const hasAccess = 
            uid === project.owner
            || project?.accessLevel === 'contributor'
            || layer?.accessLevel === 'contributor'
            || repository?.accessLevel === 'contributor'
        return hasAccess
    } else {
        const hasAccess = uid === project?.owner
        return hasAccess      
    }
};
