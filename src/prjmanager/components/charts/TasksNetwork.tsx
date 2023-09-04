import { ResponsiveNetwork } from '@nivo/network'
import '../styles/styles.css'

export const TasksNetwork = () => {


    const data = {
        nodes: [
          { id: 'task1', size: 10, color: '#61cdbb' },
          { id: 'task2', size: 20, color: '#97e3d5' },
          { id: 'task3', size: 15, color: '#f1e15b' },
          { id: 'task4', size: 25, color: '#f47560' },
          // ... más nodos
        ],
        links: [
          { source: 'task1', target: 'task2', distance: 50 },
          { source: 'task2', target: 'task3', distance: 30 },
          { source: 'task3', target: 'task4', distance: 40 },
          // ... más enlaces
        ],
      };

  return (

    <div className='graph-glass h-[250px] w-[250px] rounded-extra'>
        <ResponsiveNetwork
                data={data}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                linkDistance={e => e.distance}
                centeringStrength={0.3}
                repulsivity={6}
                nodeSize={n => n.size}
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
            />
        </div>
    // </div>
  )
}
