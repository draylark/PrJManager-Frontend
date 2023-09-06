import { ResponsiveAreaBump } from '@nivo/bump'
import '../styles/styles.css'


const data = [
    {
        "id": "Proyecto A",
        "data": [
            { "x": "Q1", "y": 10 },
            { "x": "Q2", "y": 20 },
            { "x": "Q3", "y": 30 },
            { "x": "Q4", "y": 40 }
        ]
    },
    {
        "id": "Proyecto B",
        "data": [
            { "x": "Q1", "y": 20 },
            { "x": "Q2", "y": 30 },
            { "x": "Q3", "y": 10 },
            { "x": "Q4", "y": 50 }
        ]
    },
    // ... más proyectos
]


export const AreaBumpChart = () => {


  return (
    

            <div className='h-[250px] w-[95%] xl:w-[450px] graph-glass rounded-extra'>
                <ResponsiveAreaBump
                    data={data}
                    margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
                    spacing={8}
                    colors={['#c084fc', '#0ea5e9', '#5eb875', '#5470c6']}
                    blendMode="multiply"
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: '#475569',
                            color: '#475569',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: '#eed312',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    fill={[
                        {
                            match: {
                                id: 'CoffeeScript'
                            },
                            id: 'dots'
                        },
                        {
                            match: {
                                id: 'TypeScript'
                            },
                            id: 'lines'
                        }
                    ]}
                    startLabel={d => d.id}
                    endLabel={d => d.id}
                    axisTop={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '',
                        legendPosition: 'middle',
                        legendOffset: -36
                    }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                />


            </div>
    
  )
}
