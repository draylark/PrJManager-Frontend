import { Fragment, useState } from 'react';

export const FileTree = ({ files, onFileClick, onFolderClick, repo, setFiles, setSelectedFileContent, setSelectedFileName }) => {

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

    return (
      <ul >
        {files.map(file => (
          <Fragment key={file.id}>
            <li
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => file.type === 'tree' ? handleOnFolderClick(repo, file.path, file.id, setFiles ) : onFileClick(repo, file.path, setSelectedFileContent, setSelectedFileName )}
            >
              {file.name}
            </li>
            {/* Renderiza recursivamente los archivos de la carpeta */}
            {file.type === 'tree' && file.files && (
              <div className="pl-4">
                <FileTree files={file.files} repo={repo} setFiles={setFiles} setSelectedFileContent={setSelectedFileContent} setSelectedFileName={setSelectedFileName} onFileClick={onFileClick} onFolderClick={onFolderClick} />
              </div>
            )}
          </Fragment>
        ))}
      </ul>
    );
  };