import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export const AdvancedSettings = ({ setting, setFieldValue, type, isDisabled }) => {
    const handleChange = (event) => {
        console.log('SETGINS: ',setting)
        console.log('EVENT: ',event.target.checked)
        // Utiliza el ID para actualizar el estado en Formik
        type === 'project' ? setFieldValue(`projectAdvancedSettings.${setting.id}.checked`, event.target.checked) : setFieldValue(`repositoryAdvancedSettings.${setting.id}.checked`, event.target.checked);
    };


    return (
        <FormControlLabel
            control={<Switch checked={setting.checked} onChange={handleChange}  disabled={isDisabled} />}
            label={setting.label}
        />
    );
};