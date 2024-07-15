import  { Fragment } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Divider, Chip } from '@mui/material';
import projectimg from '../../assets/imgs/projectbg.jpg';
import { HandshakeFilled } from '@ricons/material'; // Asegúrate de tener este ícono disponible
import { useNavigate } from 'react-router-dom';
import { cleanUrl } from '../projects/helpers/helpers';
import { ProjectBase } from '../../../interfaces/models';

export const RenderProjects = ({ projects } : { projects: ProjectBase[]}) => {
  const navigate = useNavigate();
  const limitDescription = (description: string, limit = 100) => {
    return description.length > limit ? `${description.substring(0, limit)}...` : description;
  };

  return (
    <List dense>
      {projects.map((project) => (
        <Fragment key={project.pid}>
          <ListItem
            className='rounded-lg hover:bg-slate-300 transition-all duration-150 ease-in-out cursor-pointer' 
            onClick={() => navigate(`../projects/${cleanUrl(project.name)}`, { state: { project: { ID: project.pid, name: project.name } } })}
            alignItems="flex-start" 
            style={{ padding: '18px' }}>
            <div
              className='border-[1px] border-gray-400'
              style={{
                width: '100px',
                height: '100px',
                marginRight: '20px',
                backgroundImage: `url(${projectimg})`,
                backgroundSize: 'cover',
                borderRadius: '8px'
              }}
            />
            <ListItemText
              primary={project.name}
              secondary={
                <Fragment>
                  {limitDescription(project.description)}
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {project.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" style={{ borderColor: 'rgba(0, 0, 0, 0.5)' }} />
                    ))}
                  </div>
                </Fragment>
              }
              primaryTypographyProps={{ style: { fontWeight: 'bold', fontSize: '1.25rem' } }}
              secondaryTypographyProps={{ style: { color: 'rgba(0, 0, 0, 0.7)', display: 'block' } }}
            />
            <p style={{ display: 'flex', marginLeft: 'auto' }}>
               {project.praises} <HandshakeFilled className='ml-4 w-5 h-5' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </p>
          </ListItem>
          {project !== projects[projects.length - 1] && <Divider component="li" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />}
        </Fragment>
      ))}
    </List>
  );
};

