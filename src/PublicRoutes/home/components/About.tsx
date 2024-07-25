import { Navbar } from '../../PublicNav/NavBar'
import { motion } from 'framer-motion'
import './styles.css'

export const About = () => {

  return (
    <div className='flex flex-col h-screen w-full overflow-hidden bg-[#0a1128]'>
      <Navbar className="top-10" />

      <div className="flex flex-col space-y-4 h-full px-[4%] md:px-[8%] pt-[30%] py-10 md:pt-[9%] my-auto overflow-y-auto">   
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className='flex flex-col space-y-2 pt-2'
          >
            <h1 className='text-5xl bebas-neue-regular text-white'>
              About PrJManager
            </h1>
            <p className='text-white text-lg sm:text-xl arsenal-sc-regular '>
              <strong>PrJManager</strong>  is not just a tool; it is a revolution in software development.
              Emerging at the intersection of innovation and collaboration,  PrJManager<br/> is
              the answer to a constantly evolving world where speed, efficiency, and communication
              are not just desirable, but essential.
            </p>         
          </motion.div>          
        
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className='flex flex-col space-y-2 pt-3'
          >
            <h2 className='text-3xl bebas-neue-regular text-white'>
              Our Vision
            </h2>
            <p className='text-white text-lg sm:text-xl arsenal-sc-regular '>
            Our patented ecosystem is designed to radically transform the conventional
            development environment. PrJManager merges version control<br/> and real-time communication
            into a unified interface that redefines collaboration, projecting the integration of
            advanced functionalities common in leading<br/> development and communication platforms.
            </p>         
          </motion.div>          
        
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className='flex flex-col space-y-2 pt-3'
          >
            <h2 className='text-3xl bebas-neue-regular text-white'>
              An Integrated Ecosystem
            </h2>
            <p className='text-white text-lg sm:text-xl arsenal-sc-regular '>
            <strong>PrJManager (Graphical Interface):</strong> More than an interface is the nerve center
            where project management reaches a new dimension of clarity and control. <br/>
            <strong>PrJExtension:</strong> Is a Visual Studio Code extension that directly integrates your
            projects into your development environment, allowing you to manage and navigate seamlessly. <br/>
            <strong>PrJConsole:</strong> A powerful command console that syncs with your development
            environment to provide customized and optimized Git command management.
            </p>         
          </motion.div>          
       
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className='flex flex-col space-y-2 pt-3'
          >
            <h2 className='text-3xl bebas-neue-regular text-white'>
              The Promise of Tomorrow
            </h2>
              <p className='text-white text-lg sm:text-xl arsenal-sc-regular '>
              At <strong>PrJManager</strong>, our commitment is to continuous evolution. Although our patent is still
              under development, each step we take is directed toward expanding<br/> and enriching our
              capabilities. Our ultimate goal is to integrate functionalities that optimize both the
              lifecycle management of development and real-time<br/> collaboration, providing tools that
              until now were only seen in specialized high-level platforms.
            </p>  
            <p className='text-white text-lg sm:text-xl arsenal-sc-regular '>
              More than software. It is a <strong>vision</strong> of the <strong>future</strong>. An expanding community.
              A <strong>commitment</strong> to excellence. <br/>Join us on the path to redefining software development, where
              each line of code brings us closer to a more connected and empowered tomorrow.
            </p>  
          </motion.div>          
      </div>
    </div>
  )
}