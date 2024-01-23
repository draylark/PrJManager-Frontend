import { TextField } from '@mui/material';
import { useField, useFormikContext, FormikValues } from 'formik';

export const FormNames = () => {

  const [firstNameField, firstNameMeta] = useField('firstName');
  const [lastNameField, lastNamerMeta] = useField('lastName');
  
  const { submitCount } = useFormikContext<FormikValues>();
  const showError0 = submitCount > 0 && firstNameMeta.error ? true : false;
  const showError1 = submitCount > 0 && lastNamerMeta.error ? true : false;

  // console.log(ownerField)

  return (
    <div className='flex w-full h-10 ml-auto mr-auto  rounded-extra  space-x-2'>
      <TextField 
        {...firstNameField}
        className='w-[50%]' 
        type='text'
        label='First Name'
        variant='standard'
        error={showError0}
        helperText={showError0 ? firstNameMeta.error : ''}
      />
      <TextField 
        {...lastNameField}
        className='w-[50%]' 
        type='text'
        label='Last Name'
        variant='standard'
        error={showError0}
        helperText={showError1 ? lastNamerMeta.error : ''}
      />
    </div>
  );
};