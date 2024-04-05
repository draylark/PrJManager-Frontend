import Panel from "../components/Panel"
import { Nav } from "../components/Nav"
import { ReactNode } from "react";
// import { useLocation } from "react-router-dom";

interface PanelProps {
  children: ReactNode;
}

const PrJManager = ({ children } : PanelProps) => {


  // const location = useLocation();
  // console.log(location)


  return (
    <div id="prjmanager" className="flex overflow-y-auto h-screen w-screen bg-gray-100">
      {/* Panel del Dashboard */}

      <Nav/>


      <Panel children={ children }/>


    </div>
  )



}

export default PrJManager
