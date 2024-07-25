import { useState, useEffect } from 'react'
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL
import '../styles/commits.css'
import { LocalStateBase } from '../../../../../interfaces/localstate';
import { CommitBase, TaskBase } from '../../../../../interfaces/models';

interface Repository extends Omit<LocalStateBase, 'state'> {
    repoID: string;
    repoName: string;
}

export interface CommitFromServer extends Omit<CommitBase, 'hash' | 'associated_task'> {
  associated_task: Pick<TaskBase, '_id' | 'task_name'>
}


export const useRepositoryCommitsData = ( repository: Repository ) => {
  const [commits, setCommits] = useState<CommitFromServer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const fetchCommits = async () => {
    try {
      const response = await axios.get(`${backendUrl}/commits/${repository.repoID}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('x-token')
        }
      });
      const commits = response.data.commits;
      setIsLoading(false)
      setCommits(commits);  
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching commits:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true)
    fetchCommits()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    commitsData: commits,
  }
}
