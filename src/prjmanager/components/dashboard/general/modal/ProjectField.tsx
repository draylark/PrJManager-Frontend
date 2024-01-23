import { useEffect, useState, SyntheticEvent } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { ProjectType } from '../../../../../store/types/stateTypes';
import { RootState } from '../../../../../store/store';
import { useFormikContext } from 'formik';

interface OptionType {
  value: string;
  label: string;
}

export const ProjectField = () => {


  const { projects, topProjects } = useSelector((state: RootState) => state.projects);
  const { setFieldValue } = useFormikContext();


  const [options, setOptions] = useState<OptionType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<readonly OptionType[]>([]);


  const handleClientSelect = ( _: SyntheticEvent<Element, Event>,  newValues: readonly OptionType[] ) => {
    console.log(newValues)
    setSelectedOptions(newValues);  // Actualizar el estado local para las etiquetas
    const newProjectValues = newValues.map((project) => project.value);
    setFieldValue('topProjects', newProjectValues);
  };


  useEffect(() => {
    const options = projects.map((project: ProjectType) => {
      return { value: project.pid, label: `${project.name}` };
    });
    setOptions(options);

    if( topProjects.length > 0 ){
      const initialOptions = topProjects.map( (projectId: string) => {
        const project = projects.find( (project: ProjectType) => project.pid === projectId )
        return { value: project.pid, label: `${project.name}` };
      })
      setSelectedOptions(initialOptions);
    }
  }, [projects, topProjects]);



  return (
    <>
      <Autocomplete
        className=''
        multiple
        id="tags-filled"
        options={options}
        value={selectedOptions}  // Utilizar el estado local para el valor
        onChange={handleClientSelect}
        renderInput={(params) => (  
          <TextField {...params} variant="filled" label="projects" />
        )}
      />
    </>
  );
};