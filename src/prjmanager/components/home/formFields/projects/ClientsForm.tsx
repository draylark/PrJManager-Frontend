import { useEffect, useState, SyntheticEvent } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { ClientType } from '../../../../../store/types/stateTypes';
import { RootState } from '../../../../../store/store';


// ... Tu código anterior

interface OptionType {
  value: string;
  label: string;
}

export const ClientsForm = () => {

  const { setFieldValue } = useFormikContext();

  const { clients } = useSelector((state: RootState) => state.clients);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<readonly OptionType[]>([]);

  useEffect(() => {
    const options = clients.map((client: ClientType) => {
      return { value: client.cid, label: `${client.firstName} ${client.lastName}` };
    });
    setOptions(options);
  }, [clients]);


  const handleClientSelect = ( _: SyntheticEvent<Element, Event>,  newValues: readonly OptionType[] ) => {
    setSelectedOptions(newValues);  // Actualizar el estado local para las etiquetas
    const newClientValues = newValues.map((client) => client.value);
    setFieldValue('clients', newClientValues);
  };

  return (
    <>
      <Autocomplete
        className='mt-7'
        multiple
        id="tags-filled"
        options={options}
        value={selectedOptions}  // Utilizar el estado local para el valor
        onChange={handleClientSelect}
        renderInput={(params) => (
          <TextField {...params} variant="filled" label="Clients" />
        )}
      />
    </>
  );
};