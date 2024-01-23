import { ResponsiveBar } from '@nivo/bar'
import { memo } from 'react'

import { useProgressCalculator } from '../../../hooks/useProgressCalculator'
import '../../styles/styles.css'



  const colorsArray = ['#a2d2ff', '#e7c6ff', '#edf2f4', '#f8f7ff', '#b9faf8', '#ffccd5'];
  
  interface AreaBumpChartProps {
    projectIds: string[];
  }

  export const AreaBumpChart = memo(({ projectIds }: AreaBumpChartProps ) => {

    const { data } = useProgressCalculator( projectIds );

  return (
    

            <div className='h-[250px] w-[95%] xl:w-[450px] graph-glass rounded-extra'>
                    <ResponsiveBar
                        data={data}
                        borderWidth={1}
                        keys={['progreso']}
                        indexBy="proyecto"
                        margin={{ top: 50, right: 115, bottom: 50, left: 80 }}
                        padding={0.3}
                        valueScale={{ type: 'linear', min: 0, max: 100 }}
                        indexScale={{ type: 'band', round: true }}
                        colors={(d) => colorsArray[d.index]}
                        defs={[
                            {
                                id: 'dots',
                                type: 'patternDots',
                                background: 'inherit',
                                color: '#38bcb2',
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
                        borderColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    1.6
                                ]
                            ]
                        }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={null} 
                        axisLeft={{
                            tickSize: 2,
                            tickPadding: 5,
                            tickRotation: 0,
                            tickValues: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], // Esto hará que los ticks vayan de 10 en 10
                            legend: 'Progreso (%)',
                            legendPosition: 'middle',
                            legendOffset: -40
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    1.6
                                ]
                            ]
                        }}
                        legends={[
                            {
                                dataFrom: 'keys',
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 120,
                                translateY: 0,
                                itemsSpacing: 2,
                                itemWidth: 100,
                                itemHeight: 20,
                                itemDirection: 'left-to-right',
                                itemOpacity: 0.85,
                                symbolSize: 20,
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                        role="application"
                        ariaLabel="Nivo bar chart demo"
                        barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
                        // tooltip={
                        //     ({ id, value }) => (
                        //         <div>
                        //           Proyecto: {id} <br />
                        //           Progreso: {parseFloat(value).toFixed(2)}%
                        //         </div>
                        //     )}
                        
                    />


            </div>
    
  )
})
