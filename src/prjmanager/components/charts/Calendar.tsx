import { ResponsiveCalendar } from '@nivo/calendar'

const data = [
    {
      "value": 85,
      "day": "2023-01-18"
    },
    {
      "value": 341,
      "day": "2023-01-12"
    },
    {
      "value": 57,
      "day": "2023-07-17"
    },
    {
      "value": 261,
      "day": "2023-10-10"
    },
    {
      "value": 64,
      "day": "2023-04-04"
    },
    {
      "value": 36,
      "day": "2023-11-15"
    },
    {
      "value": 16,
      "day": "2023-10-30"
    },
    {
      "value": 39,
      "day": "2023-04-10"
    },
    {
      "value": 228,
      "day": "2023-11-30"
    },
    {
      "value": 51,
      "day": "2023-06-13"
    },
    {
      "value": 11,
      "day": "2023-05-30"
    },
    {
      "value": 345,
      "day": "2023-10-18"
    },
    {
      "value": 358,
      "day": "2023-04-22"
    },
    {
      "value": 342,
      "day": "2023-08-20"
    },
    {
      "value": 240,
      "day": "2023-12-28"
    },
    {
      "value": 326,
      "day": "2023-03-09"
    },
    {
      "value": 202,
      "day": "2023-10-12"
    },
    {
      "value": 76,
      "day": "2023-10-02"
    },
    {
      "value": 211,
      "day": "2023-04-25"
    },
    {
      "value": 74,
      "day": "2023-10-17"
    },
    {
      "value": 219,
      "day": "2023-06-21"
    },
    {
      "value": 76,
      "day": "2023-04-27"
    },
    {
      "value": 134,
      "day": "2023-07-30"
    },
    {
      "value": 257,
      "day": "2023-04-15"
    },
]

export const Calendar = () => {


  return (
    <>

        <ResponsiveCalendar
                data={data}
                from="2023-01-01"
                to="2023-12-31"
                emptyColor="#eeeeee"
                colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                yearSpacing={40}
                monthBorderColor="#ffffff"
                dayBorderWidth={2}
                dayBorderColor="#ffffff"
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'row',
                        translateY: 36,
                        itemCount: 4,
                        itemWidth: 42,
                        itemHeight: 36,
                        itemsSpacing: 14,
                        itemDirection: 'right-to-left'
                    }
                ]}
            />

    </>
  )

}
