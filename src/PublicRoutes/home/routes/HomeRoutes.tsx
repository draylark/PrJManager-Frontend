import { Route, Routes } from "react-router-dom"
import { Welcome } from "../components/Welcome"
import { About } from "../components/About"

const HomeRoutes = () => {
  return (
    <Routes>
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/about' element={<About />} />
    </Routes>
  )
}

export default HomeRoutes
