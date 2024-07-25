import { Routes, Route } from 'react-router-dom'
import { PrjmanagerDoc } from '../components/PrjmanagerDoc'
import { PrjextensionDoc } from '../components/PrjextensionDoc'
import { PrjconsoleDoc } from '../components/PrjconsoleDoc'

const DocsRoutes = () => {
  return ( 
    <Routes>
      <Route path='/prjmanager' element={<PrjmanagerDoc />} />
      <Route path='/prjextension' element={<PrjextensionDoc />} />
      <Route path='/prjconsole' element={<PrjconsoleDoc />} />
    </Routes>
  )
}

export default DocsRoutes
