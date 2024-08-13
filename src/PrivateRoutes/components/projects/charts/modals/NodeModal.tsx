import { useSelector } from "react-redux"
import { useState, useEffect } from "react";
import { FaGitAlt, FaEye } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { cleanUrl } from "../../helpers/helpers";
import { MdLayers } from "react-icons/md";
import { LayerBase } from '../../../../../interfaces/models/layer';
import { RepositoryBase } from '../../../../../interfaces/models/repository';
import { RootState } from "../../../../../store/store";
import { formateDate } from "../../helpers/helpers";
import { CustomNodeDatum } from "../TreeChart";


interface RepoNodeData extends RepositoryBase {
  type: 'R';
  layerName: string;
}

type ProjectState = {
  ID: string,
  name: string
}


export const NodeModal = ({ project, nodeData }: { project: ProjectState, nodeData: CustomNodeDatum } ) => {

  const navigate = useNavigate()
  const { layers, repositories } = useSelector((state: RootState) => state.platypus);
  const [nodeInfo, setNodeInfo] = useState<LayerBase | RepoNodeData | null>(null);

  const renderNodeType = () => {
    switch (nodeData.type) {
      case 'R': {
        const data = nodeInfo as RepoNodeData
        return (
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{data?.name}</h2>
                <span className="mt-2 text-sm text-gray-500">ID: {data?._id}</span>
                {/* <p className="text-gray-500">{repoInfo.description || "No description available."}</p> */}
                <div className="flex space-x-2 mt-3">
                  <div className="flex space-x-2">
                    <div className="mt-1">
                      <FaEye />
                    </div>                   
                    <span className="inline-flex items-center text-sm text-gray-500"> {data?.visibility}</span>
                  </div>                 
                  <button onClick={(e) => {
                    e.preventDefault()
                    navigate(
                      `../${cleanUrl(data?.layerName)}/${cleanUrl(data?.name)}`, 
                      { state: { 
                        project: { ID: project.ID, name: project.name }, 
                        layer: { layerID: data?.layerID, layerName: data.layerName}, 
                        repository: { repoID: data?._id, repoName: data?.name } } 
                      })
                  }} 
                  className="ml-4 text-sm text-blue-500 hover:underline"
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
                  <span className="text-sm font-semibold text-gray-700">Branches:</span>
                  <span className="ml-2 text-sm text-gray-500">{data?.branches?.length || 0}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Last Updated:</span>
                  <span className="ml-2 text-sm text-gray-500">{formateDate(data.updatedAt as string)}</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
      case 'L': {
        const data = nodeInfo as LayerBase
        return (
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{data.name}</h2>
                <span className="mt-2 text-sm text-gray-500">ID: {data._id}</span>
                {/* <p className="text-gray-500">{repoInfo.description || "No description available."}</p> */}
                <div className="flex space-x-2 mt-3">
                  <div className="flex space-x-2">
                    <div className="mt-1">
                      <FaEye />
                    </div>                   
                    <span className="inline-flex items-center text-sm text-gray-500"> {data.visibility}</span>
                  </div>                 
                  <button onClick={(e) => {
                      e.preventDefault()
                      navigate(`../${cleanUrl(data.name)}`, 
                      { 
                        state: { 
                        project: { ID: project.ID, name: project.name }, 
                        layer: { layerID: data._id, layerName: data.name }, 
                        }
                      })
                    }} 
                     className="ml-4 text-sm text-blue-500 hover:underline">Go to Layer
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
                  <span className="ml-2 text-sm text-gray-500">{data.repositories}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Last Updated:</span>
                  <span className="ml-2 text-sm text-gray-500">{formateDate(data.updatedAt as string)}</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
      default: return 'Node';
    }
  };

  useEffect(() => {
    switch (nodeData.type) {
      case 'L': {    
        const layerData = layers.find((layer: LayerBase) => layer._id === nodeData.id);
        if (layerData) {
          const formattedData = {
            ...layerData,
            createdAt: new Date(layerData.createdAt as string).toLocaleDateString('en-US'),
            updatedAt: new Date(layerData.updatedAt as string).toLocaleDateString('en-US')
          } as LayerBase;
          setNodeInfo(formattedData);
        }}
        break;
      case 'R':{
          const repoData = repositories.find((repo: RepositoryBase) => repo._id === nodeData.id);
          if (repoData) {
            const formattedData = {
              ...repoData,
              layerID: nodeData.layerID,
              layerName: nodeData.layerName,
              createdAt: new Date(repoData.createdAt as string).toLocaleDateString('en-US'),
              updatedAt: new Date(repoData.updatedAt as string).toLocaleDateString('en-US')
            } as RepoNodeData;
            setNodeInfo(formattedData);
          }}    
        break;
      default:
        setNodeInfo(null);
    }
  }, [nodeData, layers, repositories]);

  return (
    <div  className={`flex justify-between items-center p-4 rounded-lg shadow-lg w-full border border-gray-600 ${ nodeData.type === 'L' ? 'glass3' : 'glass4'}`}>
      { nodeInfo && renderNodeType() }
    </div> 
  );
};