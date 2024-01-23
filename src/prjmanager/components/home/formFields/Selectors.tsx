import React from 'react';
import { useField, useFormikContext, FormikValues } from 'formik';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface SelectorProps {
  label: string;
  options: { value: string | number, label: string }[];
  name: string;
  className?: string; // Añadir esta línea si quieres que className sea opcional
  additionalOnChange?: (value: unknown) => void;
}

const Selectors: React.FC<SelectorProps> = ({ label, options, className, ...props }) => {

  const { setFieldValue, submitCount } = useFormikContext<FormikValues>();
  const [field, meta] = useField(props.name);
  

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {

    const { value } = e.target;
    // console.log(value)
    setFieldValue(field.name, value);

    if (props.additionalOnChange) {
      props.additionalOnChange(value);
    }

  };

  const configSelect = {
    ...field,
    onChange: handleChange
  };

  const showError = submitCount > 0 && meta.error ? true : false;


  
  return (
    <FormControl className={className} error={showError}>

      <InputLabel>{label}</InputLabel>

        <Select {...configSelect}>

            <MenuItem value="">
                <em>None</em>
            </MenuItem>

            {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
                {option.label}
            </MenuItem>
            ))}
            
        </Select>

        {showError ? (
            <FormHelperText>{meta.error}</FormHelperText>
        ) : null}

    </FormControl>
  );
};

export default Selectors;