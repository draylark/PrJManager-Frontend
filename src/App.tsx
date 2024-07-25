import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './routes/AppRouter'
import './index.css'

function App() {


function preloadWorldComponent() {
      import('./PublicRoutes/home/components/ui/globe-c');  // Asegúrate de poner la ruta correcta
}

useEffect(() => {
      preloadWorldComponent();
})

  return (   
        <BrowserRouter>
              <AppRouter/>
        </BrowserRouter>
  )
}

export default App
