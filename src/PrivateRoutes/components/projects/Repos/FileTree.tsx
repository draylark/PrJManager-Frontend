import React, { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fileExtensionToIconAndColor } from './helpers/repos-fn';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { RepositoryBase } from '../../../../interfaces/models';
import { File } from './Repository';


interface FileTreeProps {
  branch: string;
  files: File[];
  onFileClick: (branch: string, repo: RepositoryBase, path: string, setSelectedFileContent: React.Dispatch<React.SetStateAction<string>>, setSelectedFileName: React.Dispatch<React.SetStateAction<string>>) => void;
  onFolderClick: (repo: RepositoryBase, path: string, id: string, setFiles: React.Dispatch<React.SetStateAction<File[]>>, branch: string) => void;
  repo: RepositoryBase;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  selectedFileName: string;
  setSelectedFileContent: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFileName: React.Dispatch<React.SetStateAction<string>>;
}


export const FileTree: React.FC<FileTreeProps> = ({ branch, files, onFileClick, onFolderClick, repo, setFiles, selectedFileName, setSelectedFileContent, setSelectedFileName }) => {

    const [opened, setOpened] = useState<string | number>(0)


    const toggleFolderFiles = (currentFiles: File[], folderId: string): File[] => {
        return currentFiles.map(file => {
            if (file.id === folderId && file.type === 'tree') {
                return { ...file, files: file.files && file.files.length > 0 ? [] : file.files };
            } else if (file.type === 'tree' && file.files) {
                return { ...file, files: toggleFolderFiles(file.files, folderId) };
            }
            return file;
        });
    };  

    const handleOnFolderClick = (
      repo: RepositoryBase, 
      path: string, 
      id: string, 
      setFiles: React.Dispatch<React.SetStateAction<File[]>>,
      branch: string
    ) => {
        if (opened === id) {
            setFiles(currentFiles => toggleFolderFiles(currentFiles, id));
            setOpened(0);
        } else {
            setOpened(id);
            onFolderClick(repo, path, id, setFiles, branch);
        }
    };

    const getIconAndColorForFile = (fileName: string) => {
      const extension = fileName.split('.').pop()?.toLowerCase() || '';
      const defaultIconAndColor = { icon: faFile, color: '#6c757d' }; // Color gris por defecto
      return fileExtensionToIconAndColor[extension] || defaultIconAndColor;
    };
    
    const FileIcon = ({ fileName }: { fileName: string }) => {
      const { icon, color } = getIconAndColorForFile(fileName);
      return <FontAwesomeIcon icon={icon} style={{ color }} />;
    };

    return (
      <ul id='fileTree' className='overflow-y-auto overflow-x-auto h-full rounded-bl-extra px-4'>

        {files.map(file => (
          <Fragment key={file.id}>
            <li
              className={`flex items-center cursor-pointer hover:bg-blue-300 ${ file.name === selectedFileName ? 'bg-blue-300' : ''} transition-all duration-100 ease-in-out rounded-lg`}
              onClick={() => file.type === 'tree' ? handleOnFolderClick(repo, file.path, file.id, setFiles, branch ) : onFileClick(branch, repo, file.path, setSelectedFileContent, setSelectedFileName )}
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
              <div >
                <FileTree 
                  branch={branch} 
                  files={file.files} 
                  repo={repo} 
                  setFiles={setFiles} 
                  setSelectedFileContent={setSelectedFileContent} 
                  setSelectedFileName={setSelectedFileName} 
                  onFileClick={onFileClick} 
                  onFolderClick={onFolderClick} 
                  selectedFileName={selectedFileName}        
                />
              </div>
            )}
          </Fragment>
        ))}
      </ul>
    );
  };