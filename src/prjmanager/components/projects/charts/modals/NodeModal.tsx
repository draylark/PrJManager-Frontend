import { useSelector } from "react-redux"
import { useState, useEffect } from "react";
import { FaGitAlt, FaEye, FaStar, FaCodeBranch, FaLayerGroup } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { cleanUrl } from "../../helpers/helpers";
import { MdLayers } from "react-icons/md";

export const NodeModal = ({ project, nodeData } ) => {

  const navigate = useNavigate()
  const { layers, repositories } = useSelector((state) => state.platypus);
  const [nodeInfo, setNodeInfo] = useState({});

  useEffect(() => {
    switch (nodeData.type) {
      case 'L':     
        const layerData = layers.find(layer => layer._id === nodeData.id);
        if (layerData) {
          const formattedData = {
            ...layerData,
            createdAt: new Date(layerData.createdAt).toLocaleDateString('en-US'),
            updatedAt: new Date(layerData.updatedAt).toLocaleDateString('en-US')
          };
          setNodeInfo(formattedData);
        }
        break;
      case 'R':
          const repoData = repositories.find(repo => repo._id === nodeData.id);
          if (repoData) {
            const formattedData = {
              ...repoData,
              layerID: nodeData.layerID,
              layerName: nodeData.layerName,
              createdAt: new Date(repoData.createdAt).toLocaleDateString('en-US'),
              updatedAt: new Date(repoData.updatedAt).toLocaleDateString('en-US')
            };
            setNodeInfo(formattedData);
          }    
        break;
      default:
        setNodeInfo({});
    }
  }, [nodeData, layers, repositories]);



  return (
    <div id="modalId" className={`flex justify-between items-center p-4 rounded-lg shadow-lg w-full border border-gray-600 ${ nodeData.type === 'L' ? 'glass3' : 'glass4'}`}>

      {

        nodeData.type === 'R' ? 
        (
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{nodeInfo.name}</h2>
                <span className="mt-2 text-sm text-gray-500">ID: {nodeInfo._id}</span>
                {/* <p className="text-gray-500">{repoInfo.description || "No description available."}</p> */}
                <div className="flex space-x-2 mt-3">
                  <div className="flex space-x-2">
                    <div className="mt-1">
                      <FaEye />
                    </div>                   
                    <span className="inline-flex items-center text-sm text-gray-500"> {nodeInfo.visibility}</span>
                  </div>                 
                  <button onClick={(e) => {
                    e.preventDefault()
                    navigate(
                      `../${cleanUrl(nodeInfo.layerName)}/${cleanUrl(nodeInfo.name)}`, 
                      { state: { 
                        project: { ID: project.ID, name: project.name }, 
                        layer: { layerID: nodeInfo.layerID, layerName: nodeInfo.layerName}, 
                        repository: { repoID: nodeInfo._id, repoName: nodeInfo.name } } 
                      })
                  }} 
                  target="_blank" className="ml-4 text-sm text-blue-500 hover:underline"
                  >
                    Go to Repository
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <FaGitAlt color="#80ed99" className="text-4xl text-gray-400" />        
              </div>
            </div>
            <div className="mt-5 border-t border-gray-200 pt-5">
              <div className="flex space-x-4 justify-between items-center">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Pending Tasks:</span>
                  <span className="ml-2 text-sm text-gray-500">57</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Last Updated:</span>
                  <span className="ml-2 text-sm text-gray-500">{nodeInfo.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        )
        :
        (
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{nodeInfo.name}</h2>
                <span className="mt-2 text-sm text-gray-500">ID: {nodeInfo._id}</span>
                {/* <p className="text-gray-500">{repoInfo.description || "No description available."}</p> */}
                <div className="flex space-x-2 mt-3">
                  <div className="flex space-x-2">
                    <div className="mt-1">
                      <FaEye />
                    </div>                   
                    <span className="inline-flex items-center text-sm text-gray-500"> {nodeInfo.visibility}</span>
                  </div>                 
                  <button onClick={(e) => {
                      e.preventDefault()
                      navigate(`../${cleanUrl(nodeInfo.name)}`, 
                      { 
                        state: { 
                        project: { ID: project.ID, name: project.name }, 
                        layer: { layerID: nodeInfo._id, layerName: nodeInfo.name }, 
                        }
                      })
                    }} 
                    target="_blank" className="ml-4 text-sm text-blue-500 hover:underline">Go to Layer
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <MdLayers color="#ffafcc" className="text-5xl"/>         
              </div>
            </div>
            <div className="mt-5 border-t border-gray-200 pt-5">
              <div className="flex space-x-4 justify-between items-center">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Repositories</span>
                  <span className="ml-2 text-sm text-gray-500">10</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Last Updated:</span>
                  <span className="ml-2 text-sm text-gray-500">{nodeInfo.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>  

  );
};