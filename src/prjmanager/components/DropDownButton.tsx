import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import './styles/styles.css'
import { barsPerProjectId } from '../../store/projects/projectSlice';
import { tasksPerProjectId } from '../../store/tasks/taskSlice';
import { ProjectType } from '../../store/types/stateTypes';


const DropdownButton = () => {

  const dispatch = useDispatch();
  const { projects } = useSelector( (state: RootState) => state.projects );


  const [ isTaskOpen, setIsTaskOpen ] = useState<boolean>(false);
  const [ isProjectOpen, setIsProjectOpen ] = useState<boolean>(false);
  const [ selectedProjects, setSelectedProjects ] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);


  const handleClickTask = ( id: string ) => {
    dispatch( tasksPerProjectId( id ) )
  }

  const handleClickProject = ( projectId: string ) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  }

  useEffect(() => {
    dispatch( barsPerProjectId( selectedProjects ) )
  }, [selectedProjects, dispatch])
  


  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter(project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        )
      );
    }
  }, [searchTerm, projects]);

  // console.log(searchTerm)
  // console.log(filteredProjects)


  return (
    <div className="relative inline-block text-left w-full">

      <div className='flex space-x-2 '>

        <button 
          onClick={() => setIsProjectOpen(!isProjectOpen)}
          className="inline-flex justify-center w-[50%] rounded-md px-4 py-2 glass text-black transition-transform duration-150 ease-in-out transform active:translate-y-[2px]"
        >
          Projects
          <svg className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <button 
          onClick={() => setIsTaskOpen(!isTaskOpen)}
          className="inline-flex justify-center w-[50%] rounded-md px-4 py-2 glass text-black transition-transform duration-150 ease-in-out transform active:translate-y-[2px]"
        >
          Tasks
          <svg className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

      </div>
      

      {isTaskOpen && (
        <div className="origin-top-left absolute right-0 mt-2 w-[49%] rounded-md shadow-lg overflow-y-auto" style={{ maxHeight: '200px' }}>
          <div className="rounded-md bg-white shadow-xs">
          <input 
              type="text" 
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2"
            />
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">

              {
                  filteredProjects.map((project) => (
                    <button 
                      key={project.pid} 
                      onClick={() => handleClickTask(project.pid)}
                      className="block px-5 py-2 w-full text-sm text-gray-700 hover:bg-gray-100" 
                      role="menuitem"
                    >
                      Tasks: {project.name}
                    </button>
                  ))
              }

            </div>
          </div>
        </div>
      )}

      {isProjectOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-[49%] rounded-md shadow-lg overflow-y-auto" style={{ maxHeight: '200px' }}>
          <div className="rounded-md bg-white shadow-xs">
          <input 
              type="text" 
              placeholder="Search projects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2"
            />
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {
                  filteredProjects.map((project) => (
                    <button 
                      key={project.pid} 
                      onClick={() => handleClickProject(project.pid)}
                      className="block px-5 py-2 w-full text-sm text-gray-700 hover:bg-gray-100" 
                      role="menuitem"
                    >
                      Project: {project.name}
                    </button>
                  ))
              }
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default DropdownButton;