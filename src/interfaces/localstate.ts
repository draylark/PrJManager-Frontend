export interface LocalStateBase {
    state: {
        project?: {
            name: string;
            ID: string;
        }
        layer?: {
            layerName: string;
            layerID: string
        }
        repository?: {
            repoName: string;
            repoID: string;
        }
    }
}