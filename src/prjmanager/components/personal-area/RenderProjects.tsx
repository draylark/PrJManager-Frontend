import { Chip } from '@mui/material';
import projectimg from '../../assets/imgs/projectbg.jpg';
import { HandshakeFilled } from '@ricons/material'; 
import { useNavigate } from 'react-router-dom';
import { cleanUrl } from '../projects/helpers/helpers';
import { ProjectBase } from '../../../interfaces/models';

type Selected = {
  pid: string,
  name: string
}

interface RenderProjectsProps {
  projects: ProjectBase[];
  selected: Selected | null;
  setSelected: (selected: Selected) => void;
}

export const RenderProjects = ({ projects, selected, setSelected }: RenderProjectsProps) => {
  const navigate = useNavigate();

  const limitTags = (tags: string[], limit = 2) => {
    if (tags.length <= limit) return tags;
    return [...tags.slice(0, limit), `+${tags.length - limit}`];
  };

  const RenderProjectName = ({ projectName, projectID }: { projectName: string, projectID: string}) => (
    <div className='flex items-center space-x-2'>
      <h1
        className='text-lg font-semibold hover:underline cursor-pointer'
        onClick={() => {
          navigate(`/projects/${cleanUrl(projectName)}`, {
            state: {
              project: {
                ID: projectID,
                name: projectName,
              }
            }
          });
        }}
      >
        {projectName}
      </h1>
    </div>
  );

  return (
    <>
      {projects.map((project, index) => (
        <div
          onClick={() => {
            setSelected({
              pid: project.pid,
              name: project.name,
            });
          }}
          key={project.pid}
          className={`flex space-x-2 justify-between py-5 px-2 hover:bg-blue-100 
                      transition-colors duration-100 cursor-pointer ${selected && selected.pid === project.pid ? 'bg-blue-100' : ''}
                      ${index !== projects.length - 1 ? 'border-b border-gray-400' : ''}`}
        >
          <div className='flex space-x-4'>
            <div
              className='border-[1px] border-gray-400 rounded-lg min-w-[80px] h-[80px] w-[80px]'
              style={{
                backgroundImage: `url(${projectimg})`,
                backgroundSize: 'cover',
              }}
            />

            <div className='flex flex-col'>
              <RenderProjectName projectName={project.name} projectID={project.pid} />
              <p className='text-sm line-clamp-2'>{project.description}</p>
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
            </div>
          </div>

          <p className='flex text-[12px]'>
            {project.praises || 0} <HandshakeFilled className='ml-2 w-4 h-4' onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          </p>
        </div>
      ))}
    </>
  );
};