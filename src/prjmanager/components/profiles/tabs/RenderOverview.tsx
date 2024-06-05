import { useState, useEffect } from 'react'
import { useProfileHeatMapData } from '../hooks/useProfileHeatMapData';
import { AnimatePresence, motion } from 'framer-motion';
import { ProfileHeatMap } from '../ProfileHeatMap';
import { TopReposGlowingStars } from '../ui/TopReposGlowingStars';
import { Typography } from '@mui/material';
import { FaGitAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { cleanUrl } from '../../projects/helpers/helpers';


export const RenderOverview = ({ user, topRepos, topProjects, location }) => {

    const [ animationStep, setAnimationStep ] = useState(0);
    const [ year, setYear ] = useState(new Date().getFullYear().toString());
    const { data, detailsMap, formatDateFromHeatMap, fetchingUserActivity, errorWhileFetching, errorMessage } = useProfileHeatMapData(location, year);
    const navigate = useNavigate();
    

    useEffect(() => {
        const maxSteps = 1; // Tienes 9 elementos animados aparte del welcome
        let step = 0;
        const interval = setInterval(() => {
          step++;
          setAnimationStep(step);
          if (step > maxSteps) {
            clearInterval(interval);
          }
        }, 1000); // Cada segundo se muestra un nuevo elemento

        return () => clearInterval(interval);
    }, []);

      return (
        <div className="flex flex-col h-[82%] w-[95%] mx-auto justify-end overflow-hidden relative rounded-2xl pb-6  text-xl md:text-4xl">
            <div className="flex flex-grow min-h-[390px] max-h-[390px] w-full mx-auto">
                <div id="Destacados" className="flex items-center w-1/2  rounded-lg">       
                    <TopReposGlowingStars topProjects={topProjects}/>          
                </div>
                <div id="Destacados" className="flex justify-center flex-col w-1/2 rounded-lg space-y-2 px-4">       
                    {        
                        topRepos.length === 0 
                        ? 
                            (
                                <div className='p-4 rounded-lg border-[1px] border-gray-400 treechart-container'>                             
                                        <h2 className="text-sm font-bold line-clamp-1">No featured repositories to show yet.</h2>                                        
                                </div>
                            )
                        :  
                            topRepos.map(repo => (
                                <div 
                                    key={repo.id} 
                                    className='min-h-[95px] p-4 rounded-lg border-[1px] border-gray-400 treechart-container hover:bg-blue-100 transition-colors duration-200 cursor-pointer'
                                    onClick={() => navigate(`/projects/${cleanUrl(repo.projectID.name)}/${cleanUrl(repo.layerID.name)}/${cleanUrl(repo.name)}`, {
                                        state: {
                                        project: {
                                            ID: repo.projectID._id,
                                            name: repo.projectID.name
                                        },
                                        layer: {
                                            layerID: repo.layerID._id,
                                            layerName: repo.layerID.name
                                        },
                                        repository: {
                                            repoID: repo._id,
                                            repoName: repo.name
                                        }
                                        }
                                    })}  
                                >
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold line-clamp-1">{repo.name}</h2>
                                        <FaGitAlt color="#80ed99"  className="text-2xl" />
                                    </div>
                                    <Typography className='line-clamp-2' variant="body2">{repo.description}</Typography>
                                </div>
                            ))
                    }      
                </div>
            </div>
            
            <div className="flex min-h-[280px]">
                {
                animationStep >= 1 && (
                    <AnimatePresence>
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"

                        >
                        <ProfileHeatMap 
                            user={user}  
                            year={year}
                            setYear={setYear}
                            data={data}
                            detailsMap={detailsMap}
                            formatDateFromHeatMap={formatDateFromHeatMap}
                            fetchingUserActivity={fetchingUserActivity}
                            errorWhileFetching={errorWhileFetching}
                            errorMessage={errorMessage}
                        />
                        </motion.div>
                    </AnimatePresence>
                )
                }
            </div>
        </div>
    )
  };