import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useField, useFormikContext, FormikValues } from 'formik';
import { FormHelperText } from '@mui/material';

interface Option {
  label: string;
  value: string;
}

interface HashtagAutocompleteFieldProps {
  options: Option[];
  name: string;
}

const HashtagAutocompleteField: React.FC<HashtagAutocompleteFieldProps> = ({ options, ...props }) => {
  const { setFieldValue, submitCount } = useFormikContext<FormikValues>();
  
  const [field, meta] = useField(props.name); // Assuming the name prop is passed in to identify the field
  const showError = submitCount > 0 && meta.error ? true : false;

  return (

    <>
        <Autocomplete
          className='mt-7'
          multiple
          id="tags-filled"
          options={options.map((option) => option.label)}
          freeSolo
          onChange={(_, newValue) => {
            setFieldValue(
              field.name,
              newValue.map((item) => (`#${item}`))
            );
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              variant="filled"
              label="Tags"
              error={showError}  // Aquí agregamos la propiedad error
              />
          )}
        />

        {showError ? (
          <FormHelperText error={true}>{meta.error}</FormHelperText>
        ) : null}
      
    </>



  );
};

export default HashtagAutocompleteField;