import { useState, useEffect } from 'react'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useFollowersData = (uid) => {

    const [fetchingUsers, setfetchingUsers] = useState(true)
    const [fetchingMoreFollowers, setFetchingMoreFollowers] = useState(false)
    const [fetchingMoreFollowing, setFetchingMoreFollowing] = useState(false)
    const [fetchingMoreFriends, setFetchingMoreFriends] = useState(false)

    const [followersLength, setfollowersLength] = useState(0)
    const [followingLength, setfollowingLength] = useState(0)
    const [friendsLength, setfriendsLength] = useState(0)

    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [friends, setFriends] = useState([])

    const [FriendsPage, setFriendsPage] = useState(0)
    const [FollowersPage, setFollowersPage] = useState(0)
    const [FollowingPage, setFollowingPage] = useState(0)   

    const [totalFriendsPages, setTotalFriendsPages] = useState(0)
    const [totalFollowersPages, setTotalFollowersPages] = useState(0)
    const [totalFollowingPages, setTotalFollowingPages] = useState(0)

    const [followingMap, setFollowingMap] = useState(new Map())

    const [errorMessage, setErrorMessage] = useState(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);

    const fetchMoreFollowing = () => {
        setFetchingMoreFollowing(true)
        axios.get(`${backendUrl}/users/get-flly/${uid}?page=${FollowingPage}`)
        .then((response) => {
            const { following: moreFollowing } = response.data;
            setMoreFollowingToMap(moreFollowing, 'following')
            setFollowing([...following, ...moreFollowing])
            setfetchingUsers(false)
        })
        .catch((error) => {
            setfetchingUsers(false)
        })
    };

    const fetchMoreFollowers = () => {
        setFetchingMoreFollowers(true)
        axios.get(`${backendUrl}/users/get-fll/${uid}?page=${FollowersPage}`)
        .then((response) => {
            const { followers: moreFollowers } = response.data;
            setFollowers([...followers, ...moreFollowers])
            const filterMutalFollowers = moreFollowers.filter( user => user.mutualFollow )
            setMoreFollowingToMap(filterMutalFollowers, 'followers')
            setFetchingMoreFollowers(false)
        })
        .catch((error) => {
            setFetchingMoreFollowers(false)
        })
    };

    const fetchMoreFriends = () => {
        setFetchingMoreFriends(true)
        axios.get(`${backendUrl}/users/get-friends/${uid}?page=${FriendsPage}`)
        .then((response) => {
            const { friends: moreFriends } = response.data;
            setFriends([...friends, ...moreFriends])
            setFetchingMoreFriends(false)
        })
        .catch((error) => {
            setFetchingMoreFriends(false)
        })
    };


    const setMoreFollowingToMap = (following, type) => {
        const updatedFollowingMap = new Map(followingMap)
        if( type === 'followers' ) {
            following.forEach( user => {
                updatedFollowingMap.set(user.followerId.uid, true)
            })
        } else {
            following.forEach( user => {
                updatedFollowingMap.set(user.uid.uid, true)
            })
        }
        setFollowingMap(updatedFollowingMap)
    };

    const setFollowingToMap = (following) => {
        const followingMap = new Map()
        following.forEach( user => {
            followingMap.set(user.uid.uid, true)
        })
        // console.log('followingMap', followingMap)
        setFollowingMap(followingMap)
    };

    const fetchInitialUsers = () => {
        axios.get(`${backendUrl}/users/get-fll-flly-friends/${uid}`)
        .then((response) => {
            const { followers, following, friends, 
                    followersLength, followingLength, 
                    friendsLength, totalFollowersPages, totalFollowingPages, totalFriendsPages } = response.data;

            setFollowers(followers)
            setFollowing(following)
            setFriends(friends)
            setfetchingUsers(false)
            setFollowingToMap(following)

            setTotalFollowersPages(totalFollowersPages)
            setTotalFollowingPages(totalFollowingPages)
            setTotalFriendsPages(totalFriendsPages)

            setFollowersPage(1)
            setFollowingPage(1)
            setFriendsPage(1)

            setfollowersLength(followersLength)
            setfollowingLength(followingLength)
            setfriendsLength(friendsLength)
        })
        .catch((error) => {     
            setfetchingUsers(false)
            setErrorWhileFetching(true)
            setErrorMessage(error.response.data.message || 'An error occurred while fetching the data')
        })
    };



    useEffect(() => {
        if (FollowersPage > 1) {
            fetchMoreFollowers()
        }
    }, [FollowersPage])

    useEffect(() => {
        if (FollowingPage > 1) {
            fetchMoreFollowing()
        }
    }, [FollowingPage])

    useEffect(() => {
        if (FriendsPage > 1) {
            fetchMoreFriends()
        }
    }, [FriendsPage])

    useEffect(() => {
        fetchInitialUsers()
    }, [])


  return {
    fetchingUsers,
    fetchingMoreFollowers,
    fetchingMoreFollowing,
    fetchingMoreFriends,

    followers,
    following,
    friends,

    followingMap,
    setFollowingMap,
    setFollowing,
    setFriends,

    totalFollowersPages,
    totalFollowingPages,
    totalFriendsPages,

    FollowingPage,
    FollowersPage,
    FriendsPage,

    setFollowingPage,
    setFollowersPage,
    setFriendsPage,

    followersLength,
    followingLength,
    friendsLength,

    setfollowersLength,
    setfollowingLength,
    setfriendsLength,

    errorMessage,
    errorWhileFetching
  }
}
