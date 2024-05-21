import { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Icon } from '@ricons/utils';
import { IosCloseCircleOutline } from '@ricons/ionicons4'
import '../styles/markdown.css'
import 'github-markdown-css/github-markdown.css';
import ReactMarkdown from 'react-markdown';
import { getLanguageFromFileName } from '../helpers/repos-fn';

export const CodeOnBigScreen = ({ getExtension, isCodeOnBigScreenOpen, setIsCodeOnBigScreenOpen, fileName, fileContent }) => {


    const handleClose = () => {
        const modal = document.getElementById('bigScreenModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');
  
            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsCodeOnBigScreenOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
      };


    useEffect(() => {
        if (isCodeOnBigScreenOpen) {
            // Asegúrate de que el modal existe antes de intentar acceder a él
            // Luego, después de un breve retraso, inicia la transición de opacidad
            const timer = setTimeout(() => {
            document.getElementById('bigScreenModal').classList.remove('opacity-0');
            document.getElementById('bigScreenModal').classList.add('opacity-100');
            }, 20); // Un retraso de 20ms suele ser suficiente
            return () => clearTimeout(timer);
        }
    }, [isCodeOnBigScreenOpen]);


    return (
        <div className='fixed flex w-screen h-full top-0 right-0 justify-center items-center z-50'>
            <div id="bigScreenModal" className={`relative flex flex-col space-y-5 w-full h-full overflow-hidden bg-[#282a36] transition-opacity duration-300 ease-in-out opacity-0 ${isCodeOnBigScreenOpen ? '' : 'pointer-events-none'}`}>
            {
                    getExtension(fileName) 
                    ?  <div className="markdown-body  border-2 w-full p-10 h-full overflow-y-auto">
                         <ReactMarkdown children={fileContent}  />
                        </div>
                    : <SyntaxHighlighter 
                            language={getLanguageFromFileName(fileName)} 
                            style={dracula}
                            customStyle={{
                                marginTop: '0px',
                                padding: '50px',
                                height: '100%',
                                fontSize: '12px'
                            }}>
                            {fileContent}
                      </SyntaxHighlighter>
            }

                <button 
                    className='absolute z-10 right-7 top-3'
                    onClick={handleClose}>
                    <Icon size={28} color='white'>
                        <IosCloseCircleOutline />
                    </Icon>
                </button>
            </div>
        </div>
    )
}
