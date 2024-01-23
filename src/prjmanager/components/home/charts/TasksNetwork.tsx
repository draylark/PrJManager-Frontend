
import { ResponsiveNetwork } from '@nivo/network'
import { memo } from 'react';
import { useTransformDataToNetwork } from '../../../hooks/useTransformDataNetwork';
import '../../styles/styles.css'

export const TasksNetwork = memo(({ projectId }: { projectId: string }) => {
  
  // console.log(projectId)

  const data = useTransformDataToNetwork(projectId);

  // console.log(data)

  return (

    <div className='graph-glass h-[250px] w-[95%]  xl:w-[250px] rounded-extra'>
        <ResponsiveNetwork
                data={data}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                linkDistance={e => e.distance}
                centeringStrength={0.3}
                repulsivity={6}
                nodeSize={n => n.isChild ? 15 : n.size}
                activeNodeSize={n => 1.5 * n.size}
                nodeColor={e => e.color}
                nodeBorderWidth={1}
                nodeBorderColor={{
                from: 'color',
                modifiers: [
                    [
                    'darker',
                    0.8,
                    ],
                ],
                }}
                linkThickness={() => 4}
                linkBlendMode="multiply"
                motionConfig="wobbly"
                nodeTooltip={ ({ node }) => (
                  
                  <div className="modal-glass z-10 rounded-lg shadow-lg p-4 w-64">
                    <div className="font-bold text-lg mb-2 ">{node.data.label}</div>
                    <div className="text-sm mb-2">
                      <strong>Description:</strong> {node.data.description}
                    </div>
                    <div className="text-sm">
                      <strong>Status:</strong> {node.data.status}
                    </div>
                  </div>

                )}
                
          />
        </div>
  )
})
