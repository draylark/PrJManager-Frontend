export const RenderFiles = (files, level = 0) => {



    



    return (
      <ul>
        {files.map(file => (
          <li key={file.id} style={{ marginLeft: `${level * 20}px` }} className="cursor-pointer hover:bg-gray-200">
            {file.type === 'tree' ? (
              // Para carpetas
              <>
                <span onClick={() => loadFolderContents(file.path)}>
                  {file.name}
                </span>
                {file.children && renderFiles(file.children, level + 1)}
              </>
            ) : (
              // Para archivos
              <span onClick={() => loadFileContent(file.path)}>
                {file.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  };