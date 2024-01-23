import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const loadFileContent = async (repo, filePath, setSelectedFileContent, setSelectedFileName) => {
  try {
    const response = await axios.get(`${backendUrl}/gitlab/loadContentFile/${repo.gitlabId}`, {             
      params: {
        filePath: filePath
      }
    });

    setSelectedFileContent(response.data);
    setSelectedFileName(filePath);

  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Manejar archivos vacíos
      setSelectedFileContent('This file is empty.');
      setSelectedFileName(filePath);
    } else {
      console.error('Error fetching file content:', error);
    }
  }
};


  export const loadFolderContents = async (repo, folderPath, folderId, setFiles) => {
    try {
      const response = await axios.get(`${backendUrl}/gitlab/loadFolderContents/${repo.gitlabId}`, {             
        params: {
          folderPath: folderPath
        }
      });
      const newFiles = response.data.files;
  
      setFiles(currentFiles => {
        // Función para actualizar los archivos de manera recursiva
        const updateFilesRecursively = (files, path, newFiles) => {
          return files.map(file => {
            if (file.path === path && file.type === 'tree') {
              // Se encontró la carpeta, actualizar su contenido
              const updatedFiles = file.files || [];
              newFiles.forEach(newFile => {
                if (!updatedFiles.some(f => f.path === newFile.path)) {
                  updatedFiles.push({ ...newFile });
                }
              });
              return { ...file, files: updatedFiles };
            } else if (file.type === 'tree' && file.files) {
              // Si es una subcarpeta, buscar en ella recursivamente
              return { ...file, files: updateFilesRecursively(file.files, path, newFiles) };
            } else {
              return file;
            }
          });
        };
  
        return updateFilesRecursively(currentFiles, folderPath, newFiles);
      });
    } catch (error) {
      console.error('Error fetching folder contents:', error);
    }
  };

