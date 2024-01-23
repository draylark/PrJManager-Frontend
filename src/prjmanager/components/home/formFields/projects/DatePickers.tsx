import {  FormHelperText } from '@mui/material';
import { useFormikContext, FormikValues } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';

export const DatePickers = ({ selectedDate, setSelectedDate, endDate, setEndDate ,setFieldValue  }) => {
    // Obtén el estado del formulario y los errores desde el contexto del formulario de Formik
    const { errors, touched, submitCount } = useFormikContext<FormikValues>();


    const showErrorStartDate = submitCount > 0 && errors.startDate && touched.startDate;
    const showErrorEndDate = submitCount > 0 && errors.endDate && touched.endDate;

    return (
        <div className='flex w-full h-10 rounded-extra space-x-2 mt-6'>   
            <div>
                <DatePicker 
                    label="Start Date" 
                    disablePast 
                    value={selectedDate}
                    onChange={(date) => {
                        setSelectedDate(date);
                        setFieldValue('startDate', date);
                    }}
                />
                {showErrorStartDate && <FormHelperText error>{errors.startDate}</FormHelperText>}
            </div>

            <div>
                <DatePicker
                    label="End Date" 
                    disablePast
                    value={endDate}
                    onChange={(date) => {
                        setEndDate(date);
                        setFieldValue('endDate', date);
                    }}
                />
                {showErrorEndDate && <FormHelperText error>{errors.endDate}</FormHelperText>}
            </div>
        </div>
    );
};