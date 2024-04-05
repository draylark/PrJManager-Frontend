import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaLayerGroup, FaGitAlt } from 'react-icons/fa';
import TaskComplete from '@ricons/carbon/TaskComplete';
import GitCompare from '@ricons/tabler/GitCompare';
import { ReadmeCard } from './ReadmeCard';
import { HeatMapComponent } from './HeatMap';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';


export const ProjectInfo = ({ project, firstTime, setFirstTime }) => {

    const [showWelcome, setShowWelcome] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    const [showLayers, setShowLayers] = useState(false);
    const [showRepositories, setShowRepositories] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const [showCommits, setShowCommits] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showHashtags, setShowHashtags] = useState(false);
    const [readmeIntro, setReadmeIntro] = useState(false)
    const [readmeCard, setReadmeCard] = useState(false)
    const [readmeContent, setReadmeContent] = useState('')



    useEffect(() => {
      if(project.readme){
      axios.get(`${backendUrl}/projects/readme/${project.readme}`, {
          headers: {
              'Authorization': localStorage.getItem('x-token')
          }
      })
      .then( response => {
          const content = response.data.readmeContent;
          setReadmeContent(content)
      })
      .catch( error => {
          console.log(error)
      })
      }

    }, [project.readme])

  
    useEffect(() => {
        if(firstTime){ 
          setShowWelcome(true);
      
          // Secuencia para mostrar los elementos gradualmente
          const timer0 = setTimeout(() => setShowDescription(true), 1000);
          const timer1 = setTimeout(() => setShowLayers(true), 2000);
          const timer2 = setTimeout(() => setShowRepositories(true), 3000);
          const timer4 = setTimeout(() => setShowCommits(true), 4000);
          const timer3 = setTimeout(() => setShowCompletedTasks(true), 5000);
          const timer5 = setTimeout(() => setShowHashtags(true), 6000);
          const timer6 = setTimeout(() => setReadmeIntro(true), 7000);
          const timer7 = setTimeout(() => setReadmeCard(true), 8000);
          const timer8 = setTimeout(() => setShowHeatmap(true), 9000);
          const timer9 = setTimeout(() => setFirstTime(false), 9500);

      
          return () => {
            clearTimeout(timer0);
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
            clearTimeout(timer6);
            clearTimeout(timer7);
            clearTimeout(timer8);
            clearTimeout(timer9);
          } 
        } else {
          setShowWelcome(true);
          setShowDescription(true);
          setShowLayers(true);
          setShowRepositories(true);
          setShowCommits(true);
          setShowCompletedTasks(true);
          setShowHashtags(true);
          setReadmeIntro(true);
          setReadmeCard(true);
          setShowHeatmap(true);
        }
      }, []);
  
    return (
        <div className='flex flex-col space-y-4 px-10 h-full w-full pt-9 pb-6'>
          {/* Resto del contenido */}
    
          {/* AnimatePresence para animaciones de entrada y salida */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className=''
              >
                <h2 className='absolute text-[50px] mb-2 font-bold top-6 '>Welcome to {project.name}</h2>
              </motion.div>
            )}
          </AnimatePresence>
    
          <AnimatePresence>
            {showDescription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.5 }} // Añade un retraso adicional para la descripción
              >
                <p className='text-2xl mt-2 font-semibold'>{project.description}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className='flex space-x-10'>

                <AnimatePresence>
                    {showLayers && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.5 }} // Añade un retraso adicional para la descripción
                    >
                        <div className='flex space-x-2 items-center'>
                            <FaLayerGroup className='w-8 h-8 text-pink-400 mr-3'/>
                                
                            <p className='flex  text-[20px] mt-2 font-extralight'>
                                <p className='font-semibold text-pink-400 mr-3'>
                                    {project.layers} 
                                </p>
                                Layers
                            </p>
                        </div>

                    </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showRepositories && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.5 }} // Añade un retraso adicional para la descripción
                    >
                        <div className='flex space-x-2 items-center'>
                            <FaGitAlt className='w-9 h-9 text-green-400 mr-3'/>
                                
                            <p className='flex  text-[20px] mt-2 font-extralight'>
                                <p className='font-semibold text-green-400 mr-3'>
                                    {project.repositories} 
                                </p>
                                Repositories
                            </p>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                  {showCommits && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: 0.5 }} // Añade un retraso adicional para la descripción
                    >
                      <div className='flex space-x-2 items-center'>
                          <GitCompare className='w-9 h-9 text-yellow-400 mr-3'/>
                              
                          <p className='flex  text-[20px] mt-2 font-extralight'>
                              <p className='font-semibold text-yellow-400 mr-3'>
                                  {project.commits} 
                              </p>
                              Commits
                          </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>


                <AnimatePresence>
                    {showCompletedTasks && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.5 }} // Añade un retraso adicional para la descripción
                    >
                        <div className='flex space-x-2 items-center'>
                            <TaskComplete className='w-8 h-8 text-blue-400 mr-3'/>
                                
                            <p className='flex  text-[20px] mt-2 font-extralight'>
                                <p className='font-semibold text-blue-400 mr-3'>
                                    {project.completedTasks} 
                                </p>
                                Completed Tasks
                            </p>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
          </div>

          <div className='flex space-x-6'>
              <AnimatePresence>
                {showHashtags && project.tags.map(( tag: string, index: number ) => (
                    <motion.span
                        key={tag}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.2, // Esto hará que cada etiqueta aparezca una después de la otra
                        }}
                        className="text-sm font-mono text-black glassi rounded-extra px-2 py-1 m-1"
                    >
                        {tag}
                    </motion.span>
                ))}
            </AnimatePresence>
          </div>

          {
              project.readme && readmeContent && (
                <AnimatePresence>
                {readmeIntro && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className='text-[30px] mb-2 font-extralight'>Here's a Quick Start:</h2>
                  </motion.div>
                )}
              </AnimatePresence>
              )
          }


          {
              project.readme && readmeContent && (
                <AnimatePresence>
                {readmeCard && (
                  <ReadmeCard readmeContent={readmeContent} />       
                )}
              </AnimatePresence>
              )
          }

        <AnimatePresence>
            {showHeatmap && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <HeatMapComponent project={project} />
              </motion.div>
            )}
        </AnimatePresence>
        

        </div>
      );

}

