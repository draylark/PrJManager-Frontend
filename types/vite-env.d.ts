/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Definir todas las variables de entorno que se utilizan en el proyecto
    VITE_BACKEND_URL: string;
    // Añade más variables de entorno según sean necesarias
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }