import { TextField } from '@mui/material';
import { useField, useFormikContext, FormikValues } from 'formik';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../../store/store';

export const FormNames = () => {

//   const { username } = useSelector( (selector: RootState) => selector.auth)
  const [titleField, titleMeta] = useField('title');



  const { submitCount } = useFormikContext<FormikValues>();
  const showError0 = submitCount > 0 && titleMeta.error ? true : false;

  return (
    <div className='flex w-full h-10 ml-auto mr-auto  rounded-extra  space-x-2'>
      <TextField 
        {...titleField}
        className='w-full' 
        type='text'
        label='Event Title'
        variant='standard'
        error={showError0}
        helperText={showError0 ? titleMeta.error : ''}
      />
    </div>
  );
};