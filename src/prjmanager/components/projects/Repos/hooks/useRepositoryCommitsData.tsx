import { useState, useEffect } from 'react'
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL
import '../styles/commits.css'

export const useRepositoryCommitsData = ( repository: string ) => {
  const [commits, setCommits] = useState([])
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
  }, []);

  return {
    isLoading,
    commitsData: commits,
  }
}
