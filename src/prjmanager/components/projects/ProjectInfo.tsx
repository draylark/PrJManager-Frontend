import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaLayerGroup, FaGitAlt } from 'react-icons/fa';
import TaskComplete from '@ricons/carbon/TaskComplete';
import GitCompare from '@ricons/tabler/GitCompare';
import { ReadmeCard } from './ReadmeCard';
import { HeatMapComponent } from './HeatMap';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
import './styles/idk.css'


export const ProjectInfo = ({ project, projectID, firstTime, setFirstTime }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [readmeContent, setReadmeContent] = useState('');
  const [showWelcome, setShowWelcome] = useState(true)



  useEffect(() => {
    if (project.readme) {
      axios.get(`${backendUrl}/projects/readme/${project.readme}`, {
        headers: {
          'Authorization': localStorage.getItem('x-token'),
        },
      })
      .then((response) => {
        const content = response.data.readmeContent;
        setReadmeContent(content);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [project.readme]);

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
      const maxSteps = 9; // Tienes 9 elementos animados aparte del welcome
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setAnimationStep(step);
        if (step > maxSteps) {
          clearInterval(interval);
        }
      }, 1000); // Cada segundo se muestra un nuevo elemento

      return () => clearInterval(interval);
    } else {
      setShowWelcome(false)
      setAnimationStep(10); // Directamente muestra todos los elementos si no es la primera vez
    }
  }, []);

  return (
    <div className='flex flex-col space-y-4 px-10 h-full w-full pt-9 pb-6'>
      {
        // animationStep > 0 && (
          <AnimatePresence>   
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className='absolute text-[45px] mb-2 font-bold top-6 animated-element truncate w-[57%]'
            >
              {showWelcome ? `Welcome to ${project.name}` : project.name}
            </motion.div>         
        </AnimatePresence>
        // )
      }


      {animationStep > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='animated-element'
          >
            <p className='text-2xl line-clamp-2 w-[95%]'>{project.description}</p>
          </motion.div>
        </AnimatePresence>
      )}

      {animationStep > 1 && (
        <div className='flex space-x-10'>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className='animated-element'
            >
              <div className='flex space-x-2 items-center'>
                <FaLayerGroup className='w-8 h-8 text-pink-400 mr-3'/>
                <p className='flex text-[20px] mt-2 font-extralight'>
                  <span className='font-semibold text-pink-400 mr-3'>{project.layers}</span>
                  Layers
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {animationStep > 2 && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className='animated-element'
              >
                <div className='flex space-x-2 items-center'>
                  <FaGitAlt className='w-9 h-9 text-green-400 mr-3'/>
                  <p className='flex text-[20px] mt-2 font-extralight'>
                    <span className='font-semibold text-green-400 mr-3'>{project.repositories}</span>
                    Repositories
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {animationStep > 3 && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className='animated-element'
              >
                <div className='flex space-x-2 items-center'>
                  <GitCompare className='w-9 h-9 text-yellow-400 mr-3'/>
                  <p className='flex text-[20px] mt-2 font-extralight'>
                    <span className='font-semibold text-yellow-400 mr-3'>{project.commits}</span>
                    Commits
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {animationStep > 4 && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className='animated-element'
              >
                <div className='flex space-x-2 items-center'>
                  <TaskComplete className='w-8 h-8 text-blue-400 mr-3'/>
                  <p className='flex text-[20px] mt-2 font-extralight'>
                    <span className='font-semibold text-blue-400 mr-3'>{project.completedTasks}</span>
                    Completed Tasks
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {animationStep > 5 && (
        <div className='flex space-x-6'>
          <AnimatePresence>
            {project.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.5,
                  delay: 1 + index * 0.1, // Cada etiqueta aparece un poco después de la anterior
                }}
                className={`text-sm font-mono text-black rounded-extra px-2 py-1 m-1 glassi`}
              >
                {tag}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {project.readme && readmeContent && animationStep > 6 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='animated-element'
          >
            <h2 className='text-[30px] mb-2 font-extralight'>Here's a Quick Start:</h2>
          </motion.div>
        </AnimatePresence>
      )}

      {project.readme && readmeContent && animationStep > 7 && (
        <AnimatePresence>
          <ReadmeCard readmeContent={readmeContent} />
        </AnimatePresence>
      )}

      {animationStep > 8 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}

          >
            <HeatMapComponent project={project} projectID={projectID} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};


