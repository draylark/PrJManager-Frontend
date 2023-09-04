import { ResponsiveRadialBar } from '@nivo/radial-bar'


const data = [
    {
      "id": "Supermarket",
      "data": [
        {
          "x": "Vegetables",
          "y": 244
        },
        {
          "x": "Fruits",
          "y": 75
        },
        {
          "x": "Meat",
          "y": 11
        }
      ]
    },
    {
      "id": "Combini",
      "data": [
        {
          "x": "Vegetables",
          "y": 203
        },
        {
          "x": "Fruits",
          "y": 281
        },
        {
          "x": "Meat",
          "y": 247
        }
      ]
    },
    {
      "id": "Online",
      "data": [
        {
          "x": "Vegetables",
          "y": 242
        },
        {
          "x": "Fruits",
          "y": 286
        },
        {
          "x": "Meat",
          "y": 80
        }
      ]
    },
    {
      "id": "Marché",
      "data": [
        {
          "x": "Vegetables",
          "y": 17
        },
        {
          "x": "Fruits",
          "y": 157
        },
        {
          "x": "Meat",
          "y": 127
        }
      ]
    }
  ]

export const Radial = () => {
  return (
    <>
        <ResponsiveRadialBar
                data={data}
                valueFormat=">-.2f"
                padding={0.5}
                cornerRadius={2}
                margin={{ top: 40, right: 120, bottom: 40, left: 20 }}
                radialAxisStart={null}
                circularAxisOuter={{ tickSize: 5, tickPadding: 15, tickRotation: 0 }}
                legends={[
                    {
                        anchor: 'right',
                        direction: 'column',
                        justify: false,
                        translateX: 80,
                        translateY: 0,
                        itemsSpacing: 6,
                        itemDirection: 'left-to-right',
                        itemWidth: 50,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        symbolSize: 18,
                        symbolShape: 'square',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#ffafcc'
                                }
                            }
                        ]
                    }
                ]}
        />
    </>
  )
}
