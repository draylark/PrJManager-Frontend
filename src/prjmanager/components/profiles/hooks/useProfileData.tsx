import { useState, useEffect } from 'react'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useSelector } from 'react-redux';

export const useProfileData = (location) => {

    const { uid } = useSelector( (state) => state.auth )
    const [fetchingUserData, setFetchingUserData] = useState(true);    
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);    
    const [profileProjects, setProfileProjects] = useState(null)
    const [topProjects, setTopProjects] = useState(null)
    const [topRepos, setTopRepos] = useState(null);
    const [profile, setProfile] = useState(null);
    const [usersRelation, setusersRelation] = useState({
        followsMe: false,
        iFollow: false,
        friendship: false
    })

    const fetchUserData = (profileUID) => {
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
