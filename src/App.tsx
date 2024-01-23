import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './routes/AppRouter'
import './index.css'
// import { LocalizationProvider, AdapterDayjs } from '@mui/x-date-pickers'

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


function App() {

  return (   

    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
              <AppRouter/>
        </BrowserRouter>
    </LocalizationProvider>


  )
}

export default App
