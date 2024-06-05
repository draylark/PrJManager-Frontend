import { useSelector } from 'react-redux'
import { TabDesktopClock20Regular } from '@ricons/fluent'
import { BrandSentry } from '@ricons/tabler'
import { Task } from '@ricons/carbon'
import { Icon } from '@ricons/utils';
import './styles.css'
import { useBarData } from './hooks/useBarData'
import { useNavigate } from 'react-router-dom'

export const Bar = ({ setRender, render }) => {

    const navigate = useNavigate()
    const { uid } = useSelector((state) => state.auth)
    const { totalProjects, totalCommits, totalCompletedTasks } = useBarData(uid)

  return (
    <div className='flex w-full h-36 rounded-extra'>

        <div className='h-full w-[40%] rounded-extra  pl-7'>
            <h2 className='text-2xl font-bold text-sky-950  mt-5'>Dashboard</h2>

            <div id='dashboard-nav-buttons' className='flex  justify-center items-center w-[92%] h-12  mt-5 '>

                <button 
                    onClick={() => {
                        setRender('')
                        navigate('.')
                    }}
                    className={`${ render === '' ? 'glassi-hover dashboard-buttons' : 'dashboard-buttons bg-[#ffffff26]' } general text-sm h-full w-[35%]  rounded-l-xl
                                transition-colors duration-150 ease-in-out transform active:translate-y-[2px] hover:glassi-hover`
                    }>
                    General
                </button>
                <button 
                    onClick={() => {
                        setRender('workspace')
                        navigate('workspace')
                    }}
                    className={`${ render === 'workspace' ? 'glassi-hover dashboard-buttons' : 'dashboard-buttons bg-[#ffffff26]' } general text-sm h-full w-[35%]
                                   transition-colors duration-150 ease-in-out transform active:translate-y-[2px] hover:glassi-hover`
                    }>
                    Workspace
                </button>
                <button 
                    onClick={() => {
                        setRender('resources')
                        navigate('resources')
                    }}
                    className={`${ render === 'resources' ? 'glassi-hover dashboard-buttons' : 'dashboard-buttons bg-[#ffffff26]' } general text-sm h-full w-[35%] rounded-r-xl
                                   transition-colors duration-150 ease-in-out transform active:translate-y-[2px] hover:glassi-hover`
                    }>
                    Resources
                </button>

            </div>

        </div>


        <div className='flex h-full w-[60%] justify-end rounded-extra space-x-2 pr-[10px] max-h-[120px] min-h-[120px]'>

            <div className='flex h-full w-40'>
                <div className='mt-7 mr-3'>
                    <p className='text-2xl font-bold text-sky-950 text-end'>
                        {totalCompletedTasks}
                    </p>
                    <p className='text-sm text-end'>Tasks</p>
                    <p className='text-[10px] text-end'>this month</p>
                </div>

                <div className='flex justify-center items-center w-10 h-16 rounded-extra border-[1px] border-gray-400 bg-green-500/50 glassi my-auto'>
                        <Icon size={24}>
                            <Task/>
                        </Icon>
                </div>
            </div>

            <div className='flex h-full w-40'>
                <div className='mt-7 mr-3'>
                    <p className='text-2xl font-bold text-sky-950 text-end'>
                        {totalCommits}
                    </p>
                    <p className='text-sm text-end'>Commits</p>
                    <p className='text-[10px] text-end'>this month</p>
                </div>

                <div className='flex w-10 h-16 justify-center items-center rounded-extra border-[1px] border-gray-400 bg-yellow-500/50 glassi my-auto '>
                        <Icon size={24}>
                            <BrandSentry/>
                        </Icon>
                </div>
            </div>


            <div className='flex h-full w-40'>
                <div className='mt-7 mr-3'>
                    <p className='text-2xl font-bold text-sky-950 text-end'>
                        {totalProjects}
                    </p>
                    <p className='text-sm text-end'>Projects</p>
                    <p className='text-[10px] text-end'>underway</p>
                </div>
                <div className='flex justify-center items-center w-10 h-16 rounded-extra my-auto border-[1px] border-gray-400 glassi'>
                    <Icon size={24}>
                        <TabDesktopClock20Regular/>
                    </Icon>
                </div>
            </div>
        </div>
        
    </div>
  )
}
