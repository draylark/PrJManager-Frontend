import {  FormHelperText } from '@mui/material';
import { useFormikContext, FormikValues } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';

export const DatePickers = ({ selectedDate, setSelectedDate, setFieldValue  }) => {
    // Obtén el estado del formulario y los errores desde el contexto del formulario de Formik
    const { errors, touched, submitCount } = useFormikContext<FormikValues>();


    const showErrorStartDate = submitCount > 0 && errors.dueDate && touched.dueDate;

    return (
        <div className='flex flex-col w-full h-10 rounded-extra space-x-2 mt-6'>   
                <DatePicker 
                    className='w-full'
                    label="Due Date" 
                    disablePast 
                    value={selectedDate}
                    onChange={(date) => {
                        setSelectedDate(date);
                        setFieldValue('dueDate', date);
                    }}
                />
                {showErrorStartDate && <FormHelperText error>{errors.dueDate}</FormHelperText>}    
        </div>
    );
};