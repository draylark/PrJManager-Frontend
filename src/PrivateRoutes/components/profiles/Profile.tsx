import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfileData, ProfileData, ProfileProjects, TopProjects, TopRepos } from './hooks/useProfileData';
import { ScaleLoader } from 'react-spinners';
import { ProfileTabs } from './ui/ProfileTabs';
import { ProfileFollowers } from './modals/ProfileFollowers';


export const Profile = () => {

  const location = useLocation();
  const [firstTime, setFirstTime] = useState(true)  
  const [isProfileFollowersModalOpen, setIsProfileFollowersModalOpen] = useState(false)  
  const { usersRelation, profile, topRepos, topProjects, profileProjects, fetchingUserData, errorWhileFetching, errorMessage } = useProfileData(location);

  if (fetchingUserData ) {
    return (
      <div className='flex w-full h-full justify-center items-center'>
        <ScaleLoader color='#0c4a6e' loading={true} />
      </div>
    );
  }
  
  return (
    <div className='flex flex-col w-full h-full py-4'>

      {
        isProfileFollowersModalOpen && (
          <ProfileFollowers 
            isProfileFollowersModalOpen={isProfileFollowersModalOpen} 
            setIsProfileFollowersModalOpen={setIsProfileFollowersModalOpen} 
            profileUID={profile?.uid as string} 
            profileName={profile?.username as string} 
          />
        )
      }

      {
        errorWhileFetching ? (
          <div className='flex w-full h-full justify-center items-center'>
            <p className='text-xl text-red-500'>{errorMessage}</p>
          </div>
        ) : 
          <ProfileTabs 
            firstTime={firstTime} 
            setFirstTime={setFirstTime} 
            usersRelation={usersRelation}  
            user={profile as ProfileData} 
            projects={profileProjects as ProfileProjects[]} 
            topRepos={topRepos as TopRepos[]} 
            topProjects={topProjects as TopProjects[]}  
            location={location} 
            isProfileFollowersModalOpen={isProfileFollowersModalOpen}
            setIsProfileFollowersModalOpen={setIsProfileFollowersModalOpen}
          /> 
      }
    </div>
  );
};

