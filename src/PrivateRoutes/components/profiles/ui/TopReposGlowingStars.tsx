import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "./glowing-stars";
import { TopProjects } from "../hooks/useProfileData"; 


export function TopReposGlowingStars({ topProjects }: {topProjects: TopProjects[]}) {

  const navigate = useNavigate();
  const [mouseEnter, setMouseEnter] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % topProjects.length);
  };

  const emptyData = {
    name: "No projects",
    description: "This user has no featured projects to show yet.",
    type: "empty"
  }

  const currentProject = topProjects.length > 0 ? topProjects[currentIndex] : emptyData;

  return (  
      <GlowingStarsBackgroundCard mouseEnter={mouseEnter}>
        <GlowingStarsTitle  setMouseEnter={setMouseEnter} currentProject={currentProject as TopProjects} navigate={navigate}>
          {currentProject.name}
        </GlowingStarsTitle>
        <div className="flex flex-grow w-full justify-between  min-h-[55px] items-end">
          <GlowingStarsDescription>
            {currentProject.description}
          </GlowingStarsDescription>
          
          {
            topProjects.length > 0 && (
              <div
                onClick={ topProjects.length > 0 ? handleNext : () => {} }
                className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center cursor-pointer">
                <Icon />
              </div>
            )
          }
        </div>
      </GlowingStarsBackgroundCard> 
  );
}
 
const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="h-4 w-4 text-white stroke-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
};