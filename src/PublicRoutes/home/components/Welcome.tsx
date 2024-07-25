import { useState, useEffect } from 'react';
import { Globe } from './ui/Globe';
import { Navbar } from '../../PublicNav/NavBar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './styles.css'

export const Welcome = () => {

  const [isGlobeLoaded, setGlobeLoaded] = useState(false);
  const [showGlobe, setshowGlobe] = useState(false);


  useEffect(() => {
    if (isGlobeLoaded) {
      setTimeout(() => {
        setshowGlobe(true);
      }, 3000);
    }
  }, [isGlobeLoaded])
  
  const textContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 1.0, duration: 0.8 }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: { delay: 1.0, duration: 0.8 }
    },
  };


  return (
    <div
      className="flex relative h-screen w-screen overflow-hidden bg-[#0a1128]"
    >

      <Navbar className="top-10" />

      <motion.div
        className='flex flex-col h-full w-full md:pl-[8%] justify-center items-center md:items-start'
        variants={textContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className='space-y-1 text-center md:text-start'>
          <motion.h1
            className="text-5xl bebas-neue-regular text-white"
            variants={textContainerVariants}
          >
            prjmanager
          </motion.h1>
          <motion.p
            className="text-white text-lg sm:text-xl bebas-neue-regular"
            variants={textContainerVariants}
          >
            A project management tool for developers, designers <br /> and project managers.
          </motion.p>
        </div>
      
          <motion.div
            className='pt-8'
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
          <Link 
            to="/auth/register"
            className="bg-white text-black px-6 py-2 rounded-md bebas-neue-regular text-lg hover:opacity-[0.9] transition-opacity duration-200">
            Get Started
          </Link>        
      </motion.div>
      
    </motion.div>

    <div
      className={`absolute w-[80%] -right-[400px] -bottom-[200px] h-[120%] hidden md:block z-10 transition-opacity duration-800 ${showGlobe ? 'opacity-1' : 'opacity-0'}`}
    >
      <Globe setGlobeLoaded={setGlobeLoaded}/>
    </div>  

    </div>
  )
}
