import {  FormHelperText } from '@mui/material';
import { useFormikContext, FormikValues } from 'formik';
import { DateTimePicker } from '@mui/x-date-pickers';


export const DatePickers = ({ selectedDate, setSelectedDate, endDate, setEndDate, setFieldValue }) => {
    const { errors, touched, submitCount } = useFormikContext<FormikValues>();

    const showErrorStartDate = submitCount > 0 && errors.startDate && touched.startDate;
    const showErrorEndDate = submitCount > 0 && errors.endDate && touched.endDate;

    // Preparar las fechas mínimas y máximas para el selector de tiempo de finalización
    const minEndDate =  selectedDate ? selectedDate.startOf(1, 'day') : null;
    const maxEndDate =  selectedDate ? selectedDate.endOf('day') : null;

    return (
        <div className='flex w-full h-10 rounded-extra space-x-2 mt-6'>
            <div>
                <DateTimePicker
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
                <DateTimePicker
                    label="End Date"
                    disablePast
                    value={endDate}
                    minDateTime={minEndDate}
                    maxDateTime={maxEndDate}
                    disabled={!selectedDate}
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