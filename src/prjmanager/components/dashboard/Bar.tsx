// import { useState } from 'react'
import { Profile } from '../Profile'
import { TabDesktopClock20Regular } from '@ricons/fluent'
import { BrandSentry } from '@ricons/tabler'
import { Task } from '@ricons/carbon'
import { Icon } from '@ricons/utils';
import './styles.css'

export const Bar = () => {

  return (
    <div className='flex w-full h-36 rounded-extra'>

        <div className='h-full w-[40%] rounded-extra '>
            <h2 className='text-2xl font-bold text-sky-950 ml-7 mt-5'>Dashboard</h2>

            <div className='flex space-x-3 pl-7 items-center w-full h-20 rounded-extra '>

                <button className='general text-sm h-10 w-[18%] dashboard-buttons  rounded-extra bg-[#ffffff26]'>
                    General
                </button>
                <button className='general text-sm h-10 w-[18%] dashboard-buttons rounded-extra bg-[#ffffff26]'>
                    Portfolio
                </button>
                <button className='general text-sm h-10 w-[18%] dashboard-buttons rounded-extra bg-[#ffffff26]'>
                    Updates
                </button>
                <button className='general text-sm h-10 w-[18%] dashboard-buttons rounded-extra bg-[#ffffff26]'>
                    Resources
                </button>

            </div>

        </div>


        <div className='flex h-full w-[60%] rounded-extra space-x-2'>
   
   
            <Profile/>

            <div className='flex h-full w-40'>

                <div className='flex justify-center items-center w-10 h-16 rounded-extra border-2 border-black my-auto'>
                    <Icon size={24}>
                        <TabDesktopClock20Regular/>
                    </Icon>
                </div>
                <div className='mt-7 ml-3'>
                    <p className='text-2xl font-bold text-sky-950'>320 h</p>
                    <p className='text-sm'>In Projects</p>
                    <p className='text-[10px]'>this month</p>
                </div>


            </div>

            <div className='flex h-full w-40'>

            <div className='flex w-10 h-16 justify-center items-center rounded-extra border-2 border-black my-auto'>
                    <Icon size={24}>
                        <BrandSentry/>
                    </Icon>
            </div>
                <div className='mt-7 ml-3'>
                    <p className='text-2xl font-bold text-sky-950'>80</p>
                    <p className='text-sm'>Commits</p>
                    <p className='text-[10px]'>this month</p>
                </div>

            </div>

            <div className='flex h-full w-40'>

            <div className='flex justify-center items-center w-10 h-16 rounded-extra border-2 border-black my-auto'>
                    <Icon size={24}>
                        <Task/>
                    </Icon>
            </div>
                <div className='mt-7 ml-3'>
                    <p className='text-2xl font-bold text-sky-950'>20</p>
                    <p className='text-sm'>Tasks</p>
                    <p className='text-[10px]'>completed this month</p>
                </div>
            </div>


        </div>
        
    </div>
  )
}
