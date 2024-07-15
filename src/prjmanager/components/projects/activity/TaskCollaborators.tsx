import { Avatar } from '@mui/material';
import { PopulatedContributorsIds } from '../../../../interfaces/models';

export const TaskCollaborators = ({ collaborators }: { collaborators: PopulatedContributorsIds[] }) => {
    
    const totalCollaborators = collaborators.length;
    const startFadeIndex = 0; // Comenzar a difuminar desde el segundo elemento (índice 1)
    const fadeCount = totalCollaborators - startFadeIndex;
  
    return (
      <div className='flex space-x-1 items-center '>
        {collaborators.map((collaborator, index) => (
          <Avatar 
            key={index} 
            alt={collaborator.username} 
            src={collaborator.photoUrl || collaborator.username}
            sx={{
              width: 20, 
              height: 20,
              opacity: index >= startFadeIndex ? 1 - ((index - startFadeIndex) / fadeCount) : 1,
            }}
          />
        ))}
        {collaborators.length > 3 && (
          <span>...</span> // Asegúrate de ajustar el estilo de este elemento para que coincida con el diseño.
        )}
      </div>
    );
  };