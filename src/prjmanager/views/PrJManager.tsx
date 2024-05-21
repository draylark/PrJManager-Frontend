import Panel from "../components/Panel"
import { Nav } from "../components/Nav"
import { ReactNode } from "react";
// import { useLocation } from "react-router-dom";

interface PanelProps {
  children: ReactNode;
}

const PrJManager = ({ children } : PanelProps) => {


  return (
    <div id="prjmanager" className="flex overflow-y-auto h-full max-h-[840px] w-screen bg-gray-100 ">

      <Nav/>


      <Panel children={ children }/>


    </div>
  )

}

export default PrJManager
