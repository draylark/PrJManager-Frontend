import Panel from "../components/Panel"
import { Nav } from "../components/Nav"
import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
}

const PrJManager = ({ children } : PanelProps) => {

  return (
    <div id="prjmanager" className="flex min-h-screen min-w-screen h-full w-full bg-gray-100">
      <Nav/>
      <Panel children={ children }/>
    </div>
  )
}

export default PrJManager
