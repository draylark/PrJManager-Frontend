import { useState } from 'react';
import Markdown from 'markdown-to-jsx'; // Importa `markdown-to-jsx`
import { TextField } from '@mui/material'; // Ejemplo de Material UI
import 'github-markdown-css/github-markdown.css'; // Importar estilos para markdown
import ReactMarkdown from 'react-markdown';
import { ArrowHookUpLeft16Regular } from '@ricons/fluent'

export const ReadmeEditor = ({ setNextStep, readmeContent, setFieldValue }) => {

  const [editMode, setEditMode] = useState(false)

  const handleReadmeChange = (e) => {
    setFieldValue('readmeContent', e.target.value);
  };

  const defaultMarkdown = `
# Nombre del Proyecto

## Descripción
Una breve descripción del proyecto, explicando su propósito, funcionalidades principales y tecnologías utilizadas.

## Tabla de Contenidos
1. [Instalación](#instalación)
2. [Uso](#uso)
3. [Contribuciones](#contribuciones)
4. [Licencia](#licencia)
5. [Contacto](#contacto)
`;


  return (
    <div className='flex flex-col space-y-5'>
        <div className="flex justify-between">
            <div className='flex space-x-2 items-center'>
                <ArrowHookUpLeft16Regular className='w-5 h-5 cursor-pointer' onClick={() => setNextStep(false)} />
                 <h1 className="text-2xl font-bold text-sky-950">Readme Preview</h1>
            </div>
           

            <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className="bg-sky-950 text-white rounded-md px-4 py-2"
            >
                {editMode ? 'Preview' : 'Edit'}
            </button>
        </div>
        {
            editMode ? (
                <TextField
                id="outlined-multiline-static"
                label="Readme"
                multiline
                fullWidth
                rows={20}
                value={readmeContent}
                onChange={handleReadmeChange}
                variant="outlined"
                />
            ) : (
                <div className="markdown-body p-6 max-h-[500px] min-h-[500px] overflow-y-auto rounded-b-2xl">
                    <ReactMarkdown>{readmeContent || defaultMarkdown}</ReactMarkdown>
                </div>
            )
        }

        {
            !editMode && (
                <div className='flex w-full h-full justify-center items-center '>
                <button 
                    type='submit'
                    className={`w-[95%] h-[55px] rounded-extra p-2 bg-blue-400/20 shadow-sm border-[1px] border-gray-400 transition-colors duration-300 ease-in-out transform active:translate-y-[2px]`}
                >
                    Create Project
                </button>
            </div> 
            )
        }
    </div>
  );
};