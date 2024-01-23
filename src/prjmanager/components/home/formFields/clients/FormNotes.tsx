import {  useFormikContext, FormikValues, useField } from 'formik';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import '../../../styles/styles.css'

export const FormNotes = ({ name }: { name: string }) => {
    
  const { setFieldValue } = useFormikContext<FormikValues>();
  const [ field, ,helpers ] = useField(name); 


  return (
        <>
            <Autocomplete
                className='mt-7'
                multiple
                id="tags-filled"
                options={[]}
                value={field.value}
                freeSolo
                onChange={(_, newValue) => {
                    setFieldValue(name, newValue);
                    helpers.setTouched(true);
                }}
                renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Notes" />
                )}
             />
        </>
  );
};