import { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fileExtensionToIconAndColor } from './helpers/repos-fn';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';


export const FileTree = ({ branch, files, onFileClick, onFolderClick, repo, setFiles, selectedFileName, setSelectedFileContent, setSelectedFileName }) => {

    const [opened, setOpened] = useState(0)
    
    const handleOnFolderClick = (repo, path, id, setFiles) => {

        const toggleFolderFiles = (currentFiles, folderId) => {

            return currentFiles.map(file => {
                if (file.id === folderId && file.type === 'tree') {
                    return { ...file, files: file.files && file.files.length > 0 ? [] : file.files };
                } else if (file.type === 'tree' && file.files) {
                    return { ...file, files: toggleFolderFiles(file.files, folderId) };
                }
                return file;
            });
        };
    
        if (opened === id) {
            setFiles(currentFiles => toggleFolderFiles(currentFiles, id));
            setOpened(0);
        } else {
            setOpened(id);
            onFolderClick(repo, path, id, setFiles);
        }
    };

    // Función para obtener el icono FontAwesome basado en la extensión del archivo
    const getIconAndColorForFile = (fileName: string) => {
      const extension = fileName.split('.').pop()?.toLowerCase() || '';
      const defaultIconAndColor = { icon: faFile, color: '#6c757d' }; // Color gris por defecto
      return fileExtensionToIconAndColor[extension] || defaultIconAndColor;
    };
    
    // Componente para renderizar el icono de un archivo
    const FileIcon = ({ fileName }: { fileName: string }) => {
      const { icon, color } = getIconAndColorForFile(fileName);
      return <FontAwesomeIcon icon={icon} style={{ color }} />;
    };

    return (
      <ul id='fileTree' className='overflow-y-auto overflow-x-auto h-full  px-5 pt-2 rounded-bl-extra'>

        {files.map(file => (
          <Fragment key={file.id}>
            <li
              className={`flex items-center space-x-1 cursor-pointer hover:bg-blue-300 ${ file.name === selectedFileName ? 'bg-blue-300' : ''} transition-all duration-100 ease-in-out rounded-lg`}
              onClick={() => file.type === 'tree' ? handleOnFolderClick(repo, file.path, file.id, setFiles ) : onFileClick(branch, repo, file.path, setSelectedFileContent, setSelectedFileName )}
            >
              <div className='flex items-center justify-center w-[30px] h-[30px]'>
                {file.type === 'blob' ? (
                  <FileIcon fileName={file.name} />
                ) : (
                  <FontAwesomeIcon icon={opened === file.id ? faFolderOpen : faFolder} />
                )}         
              </div>
              <span className="text-[12px]">{file.name}</span>
            </li>
            {/* Renderiza recursivamente los archivos de la carpeta */}
            {file.type === 'tree' && file.files && (
              <div className="pl-2">
                <FileTree branch={branch} files={file.files} repo={repo} setFiles={setFiles} setSelectedFileContent={setSelectedFileContent} setSelectedFileName={setSelectedFileName} onFileClick={onFileClick} onFolderClick={onFolderClick} />
              </div>
            )}
          </Fragment>
        ))}
      </ul>
    );
  };