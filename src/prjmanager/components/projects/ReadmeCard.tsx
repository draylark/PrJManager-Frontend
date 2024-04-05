import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown.css';
import '../projects/Repos/styles/markdown.css'
import './styles/readme.css';

export const ReadmeCard = ({ readmeContent }: { readmeContent: string }) => {

    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="layout-cards rounded-extra">
          <motion.div
            className={`flex justify-center items-center bg-blue-200/40 border-[1px] border-gray-400 ${isOpen ? 'opened-card' : 'card'}`}
            layout
            onTap={() => setIsOpen(!isOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              layout: { duration: 0.5, ease: [0.10, 0.95, 0.53, 0.98] } // Ejemplo de ease personalizado
            }}
          > 

          { !isOpen &&    
                <h2 className='font-semibold'>README.MD</h2>
          }
            {isOpen && (
                    <div className="markdown-body overflow-y-auto p-8 max-h-[645px]">
                        <ReactMarkdown>{readmeContent}</ReactMarkdown>
                    </div>         
            )}
          </motion.div>
     
        <motion.div
          className="dim-layer"
          animate={{ opacity: isOpen ? .3 : 0 }}
        />
      </div>
    );
};