import { useState, ReactNode, useMemo } from "react";
import { ProfileNav, FadeInDiv } from "./ProfileTabsUI";
import { cn } from "../../../../utils/cn";
import { RenderOverview } from "../tabs/RenderOverview";
import { RenderProjects } from "../tabs/RenderProjects";
import './profile.css'

type Tab = {
  title: string;
  value: string;
  content?: string | ReactNode | any;
};


const tabsArr = [
    {
      title: "Overview",
      value: "overview",
    },
    {
      title: "Projects",
      value: "projects",
    }
];

export function ProfileTabs({ firstTime, setFirstTime, usersRelation, user, projects, topRepos, topProjects, location, isProfileFollowersModalOpen, setIsProfileFollowersModalOpen }) {
  

  const [tabToRender, setTabToRender] = useState('overview')
  const [tabs, setTabs] = useState<Tab[]>(tabsArr);
  const [active, setActive] = useState<Tab>(tabsArr[0]);
  const [hovering, setHovering] = useState(false);

  const memoizedRenderOverview = useMemo(() => 
    <RenderOverview user={user} topRepos={topRepos} topProjects={topProjects}  location={location} />
  , [user, location, tabToRender]);

  const renderTab = (render) => {
    switch (render) {
        case 'overview': 
        return memoizedRenderOverview
        case 'projects': 
         return (
           <RenderProjects projects={projects}/>
         )
        default:
          return memoizedRenderOverview
    }
  };

  return (
    <div  className="relative flex h-[97%] flex-col w-[98%] mx-auto  items-start justify-start">
      <ProfileNav 
        firstTime={firstTime} 
        setFirstTime={setFirstTime} 
        setTabToRender={setTabToRender} 
        tabs={tabsArr} setTabs={setTabs} 
        usersRelation={usersRelation}
        user={user} active={active} 
        setActive={setActive} 
        setHovering={setHovering} 
        isProfileFollowersModalOpen={isProfileFollowersModalOpen}
        setIsProfileFollowersModalOpen={setIsProfileFollowersModalOpen}
      />

      <FadeInDiv
        firstTime={firstTime}
        tabToRender={tabToRender}
        render={renderTab}
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn("mt-5")}
      />
    </div>
  );
}
   