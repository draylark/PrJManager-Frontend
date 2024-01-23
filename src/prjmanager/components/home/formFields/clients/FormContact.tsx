import { TextField } from '@mui/material';
import { useField, useFormikContext, FormikValues } from 'formik';


export const FormContact = () => {

    const [emailField, emailMeta] = useField('email');
    const [phoneNumberField, phoneNumberMeta] = useField('phoneNumber');
    
    const { submitCount } = useFormikContext<FormikValues>();
    const showError0 = submitCount > 0 && emailMeta.error ? true : false;
    const showError1 = submitCount > 0 && phoneNumberMeta.error ? true : false;


  return (
    <div className='flex w-full h-10 ml-auto mr-auto mt-7  rounded-extra  space-x-2'>
        <TextField 
            {...emailField}
            className='w-[50%]' 
            type='text'
            label='Email'
            variant='standard'
            error={showError0}
            helperText={showError0 ? emailMeta.error : ''}
        />
        <TextField 
            {...phoneNumberField}
            className='w-[50%]' 
            type='text'
            label='Phone Number'
            variant='standard'
            error={showError0}
            helperText={showError1 ? phoneNumberMeta.error : ''}
        />
  </div>
  )
}
