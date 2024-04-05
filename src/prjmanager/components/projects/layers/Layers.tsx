import { useState, useEffect } from "react";
import { LayerForm } from "../forms/LayerForm";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { LayerGroup } from '@ricons/fa'
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { Icon } from "@ricons/utils";
import LoadingCircle from "../../../../auth/helpers/Loading";

export const Layers = () => {


    const navigate = useNavigate()
    const location = useLocation();

    const projectId = location.state?.projectId;
    const layerId = location.state?.layerId;

    const [projectLayers, setProjectLayers] = useState([])
    const { layers, loading } = useSelector((state: RootState) => state.platypus2)
    const [ IsLayerModalOpen, setIsLayerModalOpen ] = useState(false)


    useEffect(() => {
    const filteredLayers = layers.filter( layer => layer.project === projectId )
    setProjectLayers(filteredLayers)
    }, [layers, loading, projectId])
    


    const cleanUrl = (name: string) => {
        return name.replace(/\./g, '').replace(/\s+/g, '-');
    }
    

    if(loading) return <LoadingCircle/>

    return (

        <div className="flex h-[90%]  flex-col space-y-7 w-full mb-5 overflow-hidden">

            { IsLayerModalOpen && <LayerForm setIsLayerModalOpen={ setIsLayerModalOpen }/> }

                {

                    layerId
                    ? ( <Outlet/> )
                    : (
                        <>
                            <div className="flex w-full px-4">
                                <div className="w-[50%]">
                                    <h1 className="text-sky-950 font-bold mt-5 text-2xl">Layers</h1>
                                </div>
                                
                                <div className="flex w-[50%] justify-end">
                                    <button 
                                        onClick={ () => setIsLayerModalOpen(true) } 
                                        className="flex glass2 h-10 px-4 rounded-extra mt-4 justify-center items-center border-1 border-gray-400"
                                    >
                                        <p className="text-sky-950 text-sm">Create a new Layer</p>
                                    </button>
                                </div>
                            </div>

                            <div className="flex w-full h-full pr-3">
                                        
                                {               
                                    projectLayers.length === 0 
                                    ? 
                                    (
                                        <div className="flex w-full justify-center items-center">
                                            <p className="text-sky-950 text-lg">No layers yet, you can start by creating one</p>
                                        </div> 
                                    )       
                                    : 
                                    (        
                                        <div className="flex flex-wrap w-full h-full overflow-y-auto layer-container pb-20">                   
                                            {
                                                projectLayers.map( layer => (
                                                    <div key={layer._id} className="glass3 flex flex-col w-[250px] h-[250px] mx-[15px] mb-8 pb-4 rounded-extra border-1 border-gray-400">
                                                        
                                                        <div className="w-full h-[50%] flex flex-col">
                                                            <div className="flex w-full mt-5 px-2">
                                                                <div className="flex w-[25%]  items-center justify-center">
                                                                    <Icon size={30}>
                                                                        <LayerGroup/>
                                                                    </Icon>
                                                                </div>
                                                                <h1 className="font-bold text-sky-950 text-2xl mb-2">{layer.name}</h1>
                                                            </div>
                                                        </div>


                                                        <div className="w-full h-full  py-2">

                                                            <div className="w-full">
                                                                <p className="text-sky-950 text-sm font-bold ml-5">Collaborators: {layer.collaborators.length}</p>
                                                            </div>

                                                            <div className="w-full">
                                                                <p className="text-sky-950 text-sm font-bold ml-5">Repos: {layer.repositories.length}</p>
                                                            </div>

                                                            <div className="w-full mt-4">
                                                                <p className="text-sky-950 text-[18px] font-bold ml-5">{layer.description}</p>
                                                            </div>


                                                        </div>
                                            
                                                    

                                                        <div className="flex justify-center items-center w-full h-[20%] ">
                                                            <button
                                                                onClick={ () => navigate(`${cleanUrl(layer.name)}`, { state: { projectId, layerId: layer._id }}) }
                                                                className="glass2 flex justify-center items-center w-[90%] h-10 rounded-2xl border-1 border-gray-400  transition-all duration-300 ease-in-out transform active:translate-y-[2px]"
                                                            >
                                                                <p className="text-sky-950 text-lg">Open</p>
                                                            </button>
                                                        </div>
                                                    </div>

                                                ))

                                            } 

                                        </div>
                                    )
                                    
                                }
                            </div>
                        </>
                    )

                }
         
        </div>   
        
    );
};
