import { Fragment } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Divider, Chip } from '@mui/material';
import projectimg from '../../assets/imgs/projectbg.jpg';
// import img from '../../assets/imgs/'
import { HandshakeFilled } from '@ricons/material'; // Asegúrate de tener este ícono disponible
import { useNavigate } from 'react-router-dom';
import { cleanUrl } from '../projects/helpers/helpers';

const limitDescription = (description, limit = 100) => {
  return description.length > limit ? `${description.substring(0, limit)}...` : description;
};

const limitTags = (tags, limit = 2) => {
  if (tags.length <= limit) return tags;
  return [...tags.slice(0, limit), `+${tags.length - limit}`];
};

export const RenderProjects = ({ projects, selected, setSelected }) => {
  const navigate = useNavigate();

  return (
    <>
      {projects.map((project, index) => (
        <div key={project._id} className='mt-2'>
          <ListItem
            className={`rounded-lg ${selected?.pid === project.pid ? 'bg-slate-300' : ''} hover:bg-slate-300 transition-all duration-150 ease-in-out cursor-pointer`}
            onClick={() => setSelected({ pid: project.pid, name: project.name })}
            alignItems="flex-start"
            style={{ padding: '12px' }}
          >
            <div
              className='border-[1px] border-gray-400 min-w-[80px] min-h-[80px] mr-4'
              style={{
                backgroundImage: `url(${projectimg})`,
                backgroundSize: 'cover',
                borderRadius: '8px'
              }}
            />
            <ListItemText
              primary={project.name}
              secondary={
                <Fragment>
                  {limitDescription(project.description, 80)}
                  <div className='flex flex-wrap gap-1 mt-2'>
                    {limitTags(project.tags).map((tag, index) =>
                      tag.startsWith('+') ? (
                        <span key={index} className='text-xs text-gray-500'>
                          {tag}
                        </span>
                      ) : (
                        <Chip key={index} label={tag} size="small" variant="outlined" style={{ borderColor: 'rgba(0, 0, 0, 0.5)', fontSize: '0.75rem' }} />
                      )
                    )}
                  </div>
                </Fragment>
              }
              primaryTypographyProps={{ style: { fontWeight: 'bold', fontSize: '1rem' } }}
              secondaryTypographyProps={{ style: { color: 'rgba(0, 0, 0, 0.7)', display: 'block', fontSize: '0.875rem' } }}
            />
            <p style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }}>
              {project.praises} <HandshakeFilled className='ml-2 w-4 h-4' />
            </p>
          </ListItem>
          {index !== projects.length - 1 && <div className="border-[1px] border-gray-400 w-[96%] mx-auto"></div>}
        </div>
      ))}
    </>
  );
};