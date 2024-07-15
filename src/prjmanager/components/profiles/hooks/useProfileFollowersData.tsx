import { useState, useEffect } from 'react'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { FollowerBase } from '../../../../interfaces/models';


export interface Follower extends Pick<FollowerBase, '_id'> {
    followerId: { uid: string; username: string; photoUrl: string | null }
}
export interface Following extends Pick<FollowerBase, '_id'> {
    uid: { uid: string; username: string; photoUrl: string | null }
}



export const useProfileFollowersData = (profileUID: string) => {

    const [fetchingUsers, setfetchingUsers] = useState(true);
    const [fetchingMoreFollowers, setFetchingMoreFollowers] = useState(false)
    const [fetchingMoreFollowing, setFetchingMoreFollowing] = useState(false)

    const [followers, setFollowers] = useState<Follower[]>([]);
    const [following, setFollowing] = useState<Following[]>([]);

    const [followersLength, setfollowersLength] = useState(0)
    const [followingLength, setfollowingLength] = useState(0)

    const [FollowersPage, setFollowersPage] = useState(0)
    const [FollowingPage, setFollowingPage] = useState(0)   

    const [totalFollowersPages, setTotalFollowersPages] = useState(0)
    const [totalFollowingPages, setTotalFollowingPages] = useState(0)

    
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);



    const fetchMoreFollowing = () => {
        setFetchingMoreFollowing(true)
        axios.get(`${backendUrl}/users/get-flly/${profileUID}?page=${FollowingPage}`)
        .then((response) => {
            const { following: moreFollowing } = response.data;
            setFollowing([...following, ...moreFollowing])
            setfetchingUsers(false)
            setFetchingMoreFollowing(false)
        })
        .catch(() => {
            setFetchingMoreFollowing(false)
        })
    }

    const fetchMoreFollowers = () => {
        setFetchingMoreFollowers(true)
        axios.get(`${backendUrl}/users/get-fll/${profileUID}?page=${FollowersPage}`)
        .then((response) => {
            console.log('fetchMoreFollowers',response)
            const { followers: moreFollowers } = response.data;
            setFollowers([...followers, ...moreFollowers])
            setFetchingMoreFollowers(false)
        })
        .catch(() => {
            setFetchingMoreFollowers(false)
        })
    }

    const fetchInitialUsers = () => {
        axios.get(`${backendUrl}/users/get-profile-followers-following/${profileUID}`)
        .then((response) => {
            console.log(response)
            const { followers, following, followersLength, followingLength, totalFollowersPages, totalFollowingPages } = response.data;

            setFollowers(followers)
            setFollowing(following)

            setfollowersLength(followersLength)
            setfollowingLength(followingLength)

            setTotalFollowersPages(totalFollowersPages)
            setTotalFollowingPages(totalFollowingPages)

            setFollowersPage(1)
            setFollowingPage(1)

            setfetchingUsers(false)
        })
        .catch((error) => {
            setfetchingUsers(false)
            setErrorWhileFetching(true)
            setErrorMessage(error.response.data.message || 'An error occurred while fetching the data')
        })
    }

    useEffect(() => {
        fetchInitialUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        if (FollowersPage > 1) {
            fetchMoreFollowers()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [FollowersPage])


    useEffect(() => {
        if (FollowingPage > 1) {
            fetchMoreFollowing()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [FollowingPage])

  return {
    followers,
    following,
    fetchingUsers,

    followersLength,
    followingLength,

    FollowersPage,
    FollowingPage,

    totalFollowersPages,
    totalFollowingPages,

    fetchingMoreFollowers,
    fetchingMoreFollowing,

    setFollowersPage,
    setFollowingPage,

    errorWhileFetching,
    errorMessage

  }
}
