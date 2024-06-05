import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../../utils/cn";
import { getInitialsAvatar } from "../../projects/helpers/helpers";
import { IosLink, LogoLinkedin } from '@ricons/ionicons4';
import Github from '@ricons/fa/Github';
import { FaXTwitter } from 'react-icons/fa6';
import { Friendship, UserAdmin } from '@ricons/carbon'
import { PlusOutlined, CheckRound } from '@ricons/material'
import { Icon } from '@ricons/utils'
import axios from 'axios'
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import { abbreviateNumber } from "../../../helpers/helpers";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

export const ProfileNav = ({
  firstTime,
  setFirstTime,
  setTabToRender,
  tabs: propTabs,
  setTabs,
  active,
  setActive,
  setHovering,
  usersRelation,
  user,
  isProfileFollowersModalOpen,
  setIsProfileFollowersModalOpen,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  firstTime: boolean;
  setFirstTime: (firstTime: boolean) => void;
  setTabToRender: (tab: string) => void;
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
  active: Tab;
  setActive: (tab: Tab) => void;
  setHovering: (hovering: boolean) => void;
  user: any;
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {

  const { uid, username, photoUrl } = useSelector( (state) => state.auth )
  const [following, setFollowing] = useState(usersRelation.iFollow || false)
  const [followsMe, setFollowsMe] = useState(usersRelation.followsMe || false)
  const [friends, setFriends] = useState(usersRelation.friendship || false)



  const handleUnfollowRes = (type) => {
    switch (type) {
      case 'friendship':
        setFriends(false)
        setFollowing(false)      
        break;
      
      case 'follower':
        setFollowing(false)
        break;
    
      default:
        setFollowing(false)
        break;
    }
  };

  const handleFollowRes = (type) => {
    switch (type) {
      case 'friendship':
        setFriends(true)
        setFollowing(true)      
        break;
      
      case 'follower':
        setFollowing(true)
        break;
    
      default:
        setFollowing(true)
        break;
    }
  };

  const followProfile = (profileUID) => {
    axios.post(`${backendUrl}/users/follow-profile`,{ profileUID, uid, username, photoUrl })
    .then( res => {
      // console.log(res)
      handleFollowRes(res.data.type)
    })
    .catch( error => {
      console.log(error)
    })
  };

  const unfollowProfile = (profileUID) => {
    axios.delete(`${backendUrl}/users/unfollow-profile/${profileUID}`, { 
        params: { uid }
    })
    .then( res => {
      // console.log(res)
      handleUnfollowRes(res.data.type)
    })
    .catch( error => {
      console.log(error)
    })
  };

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
    setTabToRender(newTabs[0].value);
  };



  return (
      <div
        className={cn(
          "bg-blue-50 absolute top-14 left-8 pb-4 z-10 px-1 flex flex-row justify-between [perspective:1000px] overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-[95%]",
          containerClassName
        )}
      >
          <div id="profile" className="flex space-x-4 h-full ">
              <img src={user.photoUrl || getInitialsAvatar(user.username)} alt={user.username} className="h-[120px] w-[120px] rounded-2xl" />
              <div className="flex flex-col pt-1">
                  <h3 className="text-2xl">@{user.username}</h3>
                  <div className="flex flex-col">
                    <p className="text-sm"><span className="font-semibold">{abbreviateNumber(user.followers || 0)}</span> <span onClick={() => setIsProfileFollowersModalOpen(true)} className="cursor-pointer hover:text-gray-700 transition-colors duration-200">Followers</span></p>

                    <div className="links  space-y-1  mt-1">               
                      <div className="set1 flex space-x-2">
                        {
                          user?.website && (
                            <a href={user?.website} target="_blank" rel="noreferrer" className="flex items-center space-x-1">
                              <IosLink className="w-4 h-4 text-gray-700" />
                              <span className="text-[13px] text-gray-700">Website</span>
                            </a>
                          )
                        }
                        {
                          user?.github && (
                            <a href={user?.github} target="_blank" rel="noreferrer" className="flex items-center space-x-1">
                              <Github className="w-4 h-4 text-gray-700" />
                              <span className="text-[13px] text-gray-700">Github</span>
                            </a>
                          )
                        }
                      </div>

                      <div className="set2 flex space-x-2">
                        {
                          user?.linkedin && (
                            <a href={user?.linkedin} target="_blank" rel="noreferrer" className="flex items-center space-x-1">
                              <LogoLinkedin className="w-4 h-4 text-gray-700" />
                              <span className="text-[13px] text-gray-700">Linkedin</span>
                            </a>
                          )
                        }
                        {
                          user?.twitter && (
                            <a href={user?.twitter} target="_blank" rel="noreferrer" className="flex items-center space-x-1">
                              <FaXTwitter className="w-4 h-4 text-gray-700" />
                              <span className="text-[13px] text-gray-700">Twitter</span>
                            </a>
                          )
                        }
                      </div>
                    </div>
                  </div>
              </div>
          </div>

          <div id="profile-interactive-buttons" className="flex space-x-8">

            {

              user.uid === uid 
              ? (
                  <p className="text-[13px] text-gray-700">This is your public profile.</p>
                )
              : (
                  <div id="profile-actions" className='flex space-x-6 justify-center h-full'>                      
                      <div className='flex flex-col justify-center items-center h-12 mt-1'>
                        {

                          friends 
                        ? 
                            (
                                <Tooltip
                                  title="Unfollow"
                                  placement="top"
                                  className=""
                                >
                                    <button 
                                      onClick={ () => unfollowProfile(user.uid)}
                                      className='flex items-center justify-center w-10 h-8 rounded-xl glassi border-1 border-black mx-auto hover:bg-blue-300/40 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'>
                                        <Icon >
                                            <Friendship className='text-green-600'/>
                                        </Icon>
                                    </button>
                                    <p className='text-[9px] mx-auto text-center'>Friends</p>                   
                                </Tooltip>                       
                            )
                        :
                          followsMe 
                        ? 
                            (
                                <Tooltip
                                  title="Follow back?"
                                  placement="top"                             
                                >
                                    <button 
                                      onClick={ () => followProfile(user.uid)}
                                      className='flex items-center justify-center w-10 h-8 rounded-xl glassi border-1 border-black mx-auto hover:bg-blue-300/40 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'>
                                        <Icon >
                                            <UserAdmin className='text-green-600' />
                                        </Icon>
                                    </button>
                                    <p className='text-[9px] mx-auto text-center'>Follows you</p>                   
                                </Tooltip>             
                            )
                        :
                          following 
                        ? 
                          (                 
                              <Tooltip
                                title="Unfollow"
                                placement="top"                      
                              >
                                <button 
                                  onClick={ () => unfollowProfile(user.uid)}
                                  className='flex items-center justify-center w-10 h-8 rounded-xl glassi border-1 border-black mx-auto hover:bg-blue-300/40 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'>
                                    <Icon>
                                        <CheckRound/>
                                    </Icon>
                                </button>
                                <p className='text-[9px] mx-auto text-center'>Following</p>      
                              </Tooltip>
                          ) 
                        : 
                          (
                              <>                   
                                <button 
                                  onClick={ () => followProfile(user.uid)}
                                  className='w-10 h-8 rounded-xl glassi border-1 border-black mx-auto hover:bg-blue-300/40 transition-all duration-150 ease-in-out transform active:translate-y-[2px]'>
                                    <Icon >
                                        <PlusOutlined/>
                                    </Icon>
                                </button>
                                <p className='text-[9px] mx-auto text-center'>Follow</p>            
                              </>
                          )
                        }
                      </div>
                  </div> 
                )

            }

            <div id="profile-nav" className="">
                {propTabs.map((tab, idx) => (
                  <button
                      key={tab.title}
                      onClick={() => {
                        moveSelectedTabToTop(idx);
                        firstTime === true && setFirstTime(false);
                      }}
                      onMouseEnter={() => setHovering(true)}
                      onMouseLeave={() => setHovering(false)}
                      className={cn("relative px-4 py-2 rounded-full", tabClassName)}
                      style={{
                      transformStyle: "preserve-3d",
                      }}
                  >
                      {active.value === tab.value && (
                      <motion.div
                          layoutId="clickedbutton"
                          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                          className={cn(
                          "absolute inset-0 bg-slate-600 dark:bg-zinc-800 rounded-full ",
                          activeTabClassName
                          )}
                      />
                      )}

                      <span className={`relative block ${active.value === tab.value ? 'text-white' : 'text-black dark:text-black'}`}>
                      {tab.title}
                      </span>
                  </button>
                ))}
            </div>
          </div>
      </div>
    
  );
};

export const FadeInDiv = ({
  firstTime,
  tabToRender,
  render,
  className,
  tabs,
  hovering,
}: {
  firstTime: boolean;
  tabToRender: string;
  render: (tab: string) => React.ReactNode;
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value && !firstTime;
  };
  return (
    <div className="w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 10, 0] : 0,
          }}
          className={cn("flex w-full h-full items-end absolute rounded-2xl border-[1px] border-gray-400 bg-blue-50 treechart-container", className)}
        >
          {render(tabToRender)}
        </motion.div>
      ))}
    </div>
  );
};
