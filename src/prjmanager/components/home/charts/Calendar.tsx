import { ResponsiveCalendar } from '@nivo/calendar'
import { Icon } from '@ricons/utils'
import EditCalendarFilled from '@ricons/material/EditCalendarFilled'
import { useTransformDataToCalendar } from '../../../hooks/useTransformDataToCalendar'
import CalendarToolTip from '../modals/CalendarToolTip'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store/store'
import { MyPortalTooltip } from '../../../portals/MyPortalToolTip'


export const Calendar = ({ setIsEventModalOpen }) => {

  const { data } = useTransformDataToCalendar()
  const { events } = useSelector((selector: RootState) => selector.events);


  return (

    <div className='glass rounded-extra h-[200px] pb-5 w-[95%] xl:w-[750px] mt-5 relative overflow-hidden overflow-x-auto'>

        <button 
              className='flex justify-center items-center ml-[5%] glass3 absolute bottom-5 rounded-xl w-[87%] h-8 z-[1] transition-transform duration-150 ease-in-out transform active:translate-y-[2px]'
              onClick={ () => setIsEventModalOpen(true) }
        >     Add Event 
            <div className='ml-2 mt-[0.6%]'>
                <Icon>
                    <EditCalendarFilled/>
                </Icon>
            </div>
        </button>
        
        <div className='min-w-[700px] lg:w-full h-full'>
              <ResponsiveCalendar
                  data={data}
                  from="2023-01-01"
                  to="2023-12-31"
                  emptyColor="#eeeeee"
                  colors={[ '#ade8f4', '#90e0ef', '#48cae4', '#00b4d8', '#0096c7', '#0077b6', '#023e8a' ]}
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
                  tooltip={ ({ day }) => (
                    <MyPortalTooltip>
                      <CalendarToolTip events={events}  currentDay={day}/>
                    </MyPortalTooltip>
                  )}
              />
        </div>

     

    </div>
  )

}
