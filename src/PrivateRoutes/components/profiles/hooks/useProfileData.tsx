import { useState, useEffect } from 'react'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useSelector } from 'react-redux';
import { Location } from 'react-router-dom';
import { RootState } from '../../../../store/store';
import { UserBase, ProjectBase, RepositoryBase, LayerBase } from '../../../../interfaces/models';

export interface UserRelation {
    followsMe: boolean;
    iFollow: boolean;
    friendship: boolean;
}
export interface TopRepos extends Pick<RepositoryBase, '_id' | 'name' | 'visibility' | 'description'> {
    commitCount: number;
    layerID: Pick<LayerBase, '_id' | 'name' | 'visibility'>;
    projectID: Pick<ProjectBase,  'name' | 'description'> & { _id: string };
}
export interface ProfileProjects extends Pick<ProjectBase, 'name' | 'description' | 'commits' | 'repositories' | 'layers' | 'completedTasks' | 'updatedAt'> {
    pid: string;
}
export interface TopProjects extends Pick<ProjectBase, 'name' | 'description' | 'commits'> {
    pid: string;
    type?: unknown;
}
export interface ProfileData extends Pick<UserBase, 'username' | 'photoUrl' | 'website' | 'github' | 'linkedin' | 'twitter' | 'description' | 'createdAt' | 'followers'> {
    uid: string;
}

export const useProfileData = (location: Location) => {

    const { uid } = useSelector( ( state: RootState ) => state.auth )
    const [fetchingUserData, setFetchingUserData] = useState(true);    
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);    
    const [profileProjects, setProfileProjects] = useState<ProfileProjects[] | null>(null)
    const [topProjects, setTopProjects] = useState<TopProjects[] | null>(null)
    const [topRepos, setTopRepos] = useState<TopRepos[] | null>(null);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [usersRelation, setusersRelation] = useState<UserRelation>({
        followsMe: false,
        iFollow: false,
        friendship: false
    })

    const fetchUserData = (profileUID: string) => {
        setFetchingUserData(true)

        axios.all([
            axios.get(`${backendUrl}/projects/get-profile-public-projects/${profileUID}`),
            axios.get(`${backendUrl}/projects/get-profile-top-projects/${profileUID}`),
            axios.get(`${backendUrl}/repos/get-top-profile-repos/${profileUID}`),
            axios.get(`${backendUrl}/users/get-profile/${profileUID}`),
            axios.get(`${backendUrl}/users/get-users-relation`, {
                params: {
                    profileUID,
                    uid
                }
            }),
        ])
        .then(axios.spread(( projects, topProjects, repos, user, relation) => {
            setProfileProjects(projects.data.projects)
            setTopProjects(topProjects.data.topProjects)
            setTopRepos(repos.data.topRepos)
            setProfile(user.data.user)
            setusersRelation(relation.data)
            setFetchingUserData(false)
        }))
        .catch((error) => {
            // console.log(error)
            setErrorMessage(error?.response?.data.message || 'An error occurred while fetching user data')
            setErrorWhileFetching(true)
            setFetchingUserData(false)
        })
    }

    useEffect(() => {
        fetchUserData(location.state.user.uid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])
    
  return {
    usersRelation,
    profile,
    topRepos,
    topProjects,
    profileProjects,
    fetchingUserData,
    errorMessage,
    errorWhileFetching,
  }
}
