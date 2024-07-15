import { useState, useEffect } from 'react'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { FollowerBase, FriendshipBase } from '../../../../interfaces/models';

export interface Follower extends Pick<FollowerBase, 'mutualFollow'> {
    followerId: {
        username: string;
        photoUrl: string | null;
        uid: string
    }
}

export interface Following extends Pick<FollowerBase, 'mutualFollow'> {
    uid: {
        username: string;
        photoUrl: string | null;
        uid: string
    }
}

export interface Friend extends Omit<FriendshipBase, 'ids'> {
    ids: {
        username: string;
        photoUrl: string | null;
        uid: string
    }[]
}

export const useFollowersData = (uid: string) => {

    const [fetchingUsers, setfetchingUsers] = useState(true)
    const [fetchingMoreFollowers, setFetchingMoreFollowers] = useState(false)
    const [fetchingMoreFollowing, setFetchingMoreFollowing] = useState(false)
    const [fetchingMoreFriends, setFetchingMoreFriends] = useState(false)

    const [followersLength, setfollowersLength] = useState(0)
    const [followingLength, setfollowingLength] = useState(0)
    const [friendsLength, setfriendsLength] = useState(0)

    const [followers, setFollowers] = useState<Follower[]>([])
    const [following, setFollowing] = useState<Following[]>([])
    const [friends, setFriends] = useState<Friend[]>([])

    const [FriendsPage, setFriendsPage] = useState(0)
    const [FollowersPage, setFollowersPage] = useState(0)
    const [FollowingPage, setFollowingPage] = useState(0)   

    const [totalFriendsPages, setTotalFriendsPages] = useState(0)
    const [totalFollowersPages, setTotalFollowersPages] = useState(0)
    const [totalFollowingPages, setTotalFollowingPages] = useState(0)

    const [followingMap, setFollowingMap] = useState<Map<string, boolean>>(new Map())
        
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
        .catch(() => {
            setfetchingUsers(false)
        })
    };

    const fetchMoreFollowers = () => {
        setFetchingMoreFollowers(true)
        axios.get(`${backendUrl}/users/get-fll/${uid}?page=${FollowersPage}`)
        .then((response) => {
            const { followers: moreFollowers } = response.data;
            setFollowers([...followers, ...moreFollowers])
            const filterMutalFollowers = moreFollowers.filter( (user: Follower) => user.mutualFollow )
            setMoreFollowingToMap(filterMutalFollowers, 'followers')
            setFetchingMoreFollowers(false)
        })
        .catch(() => {
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
        .catch(() => {
            setFetchingMoreFriends(false)
        })
    };


    const setMoreFollowingToMap = (
        following: Following[] | Follower[], 
        type: 'followers' | 'following'
    ) => {
        const updatedFollowingMap = new Map<string, boolean>(followingMap);
    
        switch (type) {
            case 'followers':
                (following as Follower[]).forEach(user => {
                    updatedFollowingMap.set(user.followerId.uid, true);
                });
                break;
            case 'following':
                (following as Following[]).forEach(user => {
                    updatedFollowingMap.set(user.uid.uid as string, true);
                });
                break;
        }
    
        setFollowingMap(updatedFollowingMap);
    };

    const setFollowingToMap = (following: Following[]) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [FollowersPage])

    useEffect(() => {
        if (FollowingPage > 1) {
            fetchMoreFollowing()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [FollowingPage])

    useEffect(() => {
        if (FriendsPage > 1) {
            fetchMoreFriends()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [FriendsPage])

    useEffect(() => {
        fetchInitialUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // console.log('followers', followers)
    // console.log('following', following)
    // console.log('friends', friends)

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
