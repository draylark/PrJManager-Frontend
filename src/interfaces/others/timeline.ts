export type ProjectCreated = {
    pid: string;
    name: string;
    createdAt: string;
    owner: string;
  }
  
export type LayerCreated = {
    _id: string;
    name: string;
    createdAt: string;
    creator: string;
    project: {
      _id: string;
      name: string
    }
  }
  
export type RepositoryCreated = {
    _id: string;
    name: string;
    createdAt: string;
    creator: string;
    projectID: {
      _id: string;
      name: string
    };
    layerID: {
      _id: string;
      name: string
    }
}
  
export type NewCommit = {
    _id: string;
    uuid: string;
    createdAt: string;
    branch: string;
    author: {
        name: string;
        photoUrl: string | null;
        uid: string
    };
    repository: {
        _id: string;
        name: string
    };
}

export type NewCommitWTask = {
    _id: string;
    uuid: string;
    createdAt: string;
    branch: string;
    author: {
        name: string;
        photoUrl: string | null;
        uid: string
    };
    repository: {
        _id: string;
        name: string
    };
    associated_task: {
        _id: string;
        task_name: string
    }
}

export type TaskCreated = {
    _id: string;
    assigned_to: string;
    createdAt: string;
    task_name: string;
    repository_related_id:  {
        _id: string;
        name: string
    };
}
export type TaskCompleted = {
    _id: string;
    assigned_to: string;
    completed_at: string;
    task_name: string;
    repository_related_id:  {
        _id: string;
        name: string
    };
}
export type TaskReviewSubmission = {
    _id: string;
    assigned_to: string;
    task_name: string;
    reviewSubmissionDate: string;
    repository_related_id:  {
        _id: string;
        name: string
    };
}
export type TaskContributorCompleted = {
    _id: string;
    assigned_to: string;
    task_name: string;
    completed_at: string;
    repository_related_id:  {
        _id: string;
        name: string
    };
}
export type TaskContributorReviewSubmission = {
    _id: string;
    assigned_to: string;
    task_name: string;
    reviewSubmissionDate: string;
    repository_related_id:  {
        _id: string;
        name: string
    };
}
export type TaskContributorMarkedReady = {
    _id: string;
    assigned_to: string;
    task_name: string;
    completed_at: string;
    repository_related_id:  {
        _id: string;
        name: string
    };
    readyContributorData: {
        uid: string;
        date: string;
        me: boolean;
        _id: string
    }
}
