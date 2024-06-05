import { faPython, faJsSquare, faReact, faHtml5, faCss3Alt, faNodeJs, faPhp, faJava, faCuttlefish, faGitAlt, faDocker, faAws, faRProject } from '@fortawesome/free-brands-svg-icons';
import { faFilePdf, faFileAlt, faFileCode, faFileImage, faDatabase, faFileCsv, faFileExcel, faFileWord, faFilePowerpoint, faFileAudio, faFileVideo, faFileArchive, faFile } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
const backendUrl = import.meta.env.VITE_BACKEND_URL
import axios from 'axios';


export const loadFileContent = async (branch, repo, filePath, setSelectedFileContent, setSelectedFileName) => {
  try {
    const response = await axios.get(`${backendUrl}/gitlab/loadContentFile/${repo._id}`, {       
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('x-token')
      },
      params: {
        branch: branch,
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
      const response = await axios.get(`${backendUrl}/gitlab/loadFolderContents/${repo._id}`, {        
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('x-token')
        },     
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

export const fileExtensionToIconAndColor: Record<string, { icon: IconDefinition, color: string }> = {
  // Documentos
  'pdf': { icon: faFilePdf, color: '#FF0000' },
  'txt': { icon: faFileAlt, color: '#000000' },
  'md': { icon: faFileAlt, color: '#000000' }, // Markdown
  'doc': { icon: faFileWord, color: '#2B579A' },
  'docx': { icon: faFileWord, color: '#2B579A' },
  'xls': { icon: faFileExcel, color: '#217346' },
  'xlsx': { icon: faFileExcel, color: '#217346' },
  'ppt': { icon: faFilePowerpoint, color: '#D24726' },
  'pptx': { icon: faFilePowerpoint, color: '#D24726' },
  'csv': { icon: faFileCsv, color: '#CCCC00' },

  // Imágenes y multimedia
  'png': { icon: faFileImage, color: '#DB7100' },
  'jpg': { icon: faFileImage, color: '#DB7100' },
  'jpeg': { icon: faFileImage, color: '#DB7100' },
  'gif': { icon: faFileImage, color: '#DB7100' },
  'bmp': { icon: faFileImage, color: '#DB7100' },
  'svg': { icon: faFileImage, color: '#FF9900' },
  'mp3': { icon: faFileAudio, color: '#008000' },
  'wav': { icon: faFileAudio, color: '#008000' },
  'mp4': { icon: faFileVideo, color: '#800080' },
  'mov': { icon: faFileVideo, color: '#800080' },
  'avi': { icon: faFileVideo, color: '#800080' },

  // Código y desarrollo
  'js': { icon: faJsSquare, color: '#F0DB4F' },
  'jsx': { icon: faReact, color: '#61DAFB' },
  'ts': { icon: faJsSquare, color: '#007ACC' },
  'tsx': { icon: faReact, color: '#61DAFB' },
  'html': { icon: faHtml5, color: '#E34C26' },
  'css': { icon: faCss3Alt, color: '#264DE4' },
  'scss': { icon: faCss3Alt, color: '#CC6699' },
  'sass': { icon: faCss3Alt, color: '#CC6699' },
  'less': { icon: faCss3Alt, color: '#1D365D' },
  'py': { icon: faPython, color: '#3776AB' },
  'ipynb': { icon: faPython, color: '#3776AB' },
  'java': { icon: faJava, color: '#F89820' },
  'c': { icon: faFileCode, color: '#A8B9CC' },
  'cpp': { icon: faFileCode, color: '#00599C' },
  'cs': { icon: faFileCode, color: '#178600' },
  'php': { icon: faPhp, color: '#787CB5' },
  'sql': { icon: faDatabase, color: '#F80000' },
  'json': { icon: faFileCode, color: '#000000' },
  'xml': { icon: faFileCode, color: '#000000' },
  'dockerfile': { icon: faDocker, color: '#2496ED' },
  'yml': { icon: faFileCode, color: '#CB171E' },
  'yaml': { icon: faFileCode, color: '#CB171E' },
  'gitignore': { icon: faGitAlt, color: '#F05032' },
  'sh': { icon: faFileCode, color: '#4EAA25' },
  'bat': { icon: faFileCode, color: '#4EAA25' },
  'rb': { icon: faFileCode, color: '#701516' },
  'r': { icon: faRProject, color: '#276DC3' },
  'go': { icon: faFileCode, color: '#00ADD8' },
  'rs': { icon: faFileCode, color: '#FF5733' },
  'dart': { icon: faFileCode, color: '#00B4AB' },
  'lua': { icon: faFileCode, color: '#000080' },

  // Otros
  'zip': { icon: faFileArchive, color: '#A52A2A' },
  'tar': { icon: faFileArchive, color: '#A52A2A' },
  'gz': { icon: faFileArchive, color: '#A52A2A' },
  'rar': { icon: faFileArchive, color: '#A52A2A' },
  '7z': { icon: faFileArchive, color: '#A52A2A' },
};

const fileExtensionToLanguage = {
  '.py': 'python',
  '.js': 'javascript',
  '.jsx': 'jsx', // O 'javascript' dependiendo del resaltador
  '.ts': 'typescript',
  '.tsx': 'tsx', // O 'typescript' dependiendo del resaltador
  '.java': 'java',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',
  '.c': 'c',
  '.cpp': 'cpp', // C++
  '.cs': 'csharp', // C#
  '.php': 'php',
  '.sql': 'sql',
  '.json': 'json',
  '.xml': 'xml',
  '.md': 'markdown',
  '.r': 'r',
  '.sh': 'bash',
  '.bat': 'batch',
  '.go': 'go',
  '.rs': 'rust',
  '.dart': 'dart',
  '.lua': 'lua',
  '.pl': 'perl',
  '.rb': 'ruby',
  '.ipynb': 'json', 
  '.yml': 'yaml',
  '.yaml': 'yaml',
  '.dockerfile': 'dockerfile',
  '.gitignore': 'plaintext',
  '.config': 'plaintext',
  '.ini': 'ini',
};

export const getLanguageFromFileName = (fileName) => {
  // Extrae la extensión del archivo del nombre del archivo
  const extension = fileName.slice(fileName.lastIndexOf('.'));
  
  // Usa el mapeo para encontrar el lenguaje correspondiente a la extensión del archivo
  // Si la extensión no está en el mapeo, devuelve null o un valor predeterminado
  return fileExtensionToLanguage[extension] || null;
};

export const getExtension = (fileName) => {
  const nameToSplit = fileName !== undefined ? fileName : selectedFileName;
  const extension = nameToSplit.split('.').pop()?.toLowerCase() || '';
  return extension === 'md' ? true : false
};