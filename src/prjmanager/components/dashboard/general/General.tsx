import { TreeChart } from "./charts/TreeChart"
import { useState } from "react"
import { ArrowBigRightLines, ArrowUpRight } from '@ricons/tabler'
import { FolderAdd } from '@ricons/carbon'
import { LogoReact, LogoVue, LogoAngular, LogoPython } from '@ricons/ionicons5'
import { HeatMapCalendar } from "./Heatmap/HeatMapCalendar"
import { Java } from '@ricons/fa'
import { Icon } from '@ricons/utils';
import { TopProjects } from "./modal/TopProjects"
import { RootState } from "../../../../store/store"
import { useSelector } from "react-redux"
import { ParticlesContainer } from "./ParticlesContainer"



import '../styles.css'
import '../updates.css'


export const General = () => {


  const { projects, topProjects } = useSelector((state: RootState) => state.projects)
  const [isModalOpen, setIsModalOpen] = useState(false)


  return (
    <div id='general' className='flex flex-col w-full h-full rounded-extra '>

        <div id='Activity' className='flex w-[96%] ml-auto mr-auto h-[50%] treechart-container rounded-extra bg-[#ffffff26] pl-4 space-x-2'>

            <div className="flex flex-col h-full w-[35%] rounded-extra  ">
              <HeatMapCalendar/>
            </div>

            <div id="chart-container" className="info-box-shadow-treechart h-full w-[65%]  rounded-extra  overflow-hidden">
              <TreeChart/>
            </div>
        </div>


        <div id='extra-info' className='flex w-full space-x-4 px-7 h-[50%] rounded-extra'>

            <div className='h-[90%] mt-5 ml-1 flex flex-col w-[30%] rounded-extra bg-[#ffffff26] top-projects '>
                <h3 className="font-bold text-sky-950 mt-5 ml-6">Most used languages and frameworks</h3>

                <div className="flex  w-full h-[90%] justify-center ">
                        <div className="flex flex-col justify-end pb-5 h-full w-10  ">
                            <div id="threeContainer" className="barContainer flex items-end justify-center h-[65%] my-3 w-10 border-1 border-gray-400 rounded-extra">
                               <div className="flex items-center justify-center w-[80%] h-[80%] mb-1  glass5 rounded-b-extra">
                                    <p className="text-[12px] font-bold">90%</p>
                               </div>
                            </div>
                            <div className="flex justify-center items-center w-10 h-10">
                              <Icon size={24}>
                                <LogoReact/>
                              </Icon>
                            </div>
                       </div>
                      <div className="flex flex-col ml-6 justify-end pb-5 h-full w-10 ">
                          <div className="barContainer flex items-end justify-center h-[65%] my-3 w-10 border-1 border-gray-400 rounded-extra">
                            <div className="flex items-center justify-center w-[80%] h-[50%] mb-1  glass4 rounded-b-extra">
                            <p className="text-[12px] font-bold">40%</p>
                            </div> 
                          </div>
                          <div className="flex justify-center items-center w-10 h-10 ">
                             <Icon size={24}>
                              <LogoVue/>
                            </Icon>
                          </div>
                      </div>
                      <div className="flex flex-col ml-6 justify-end pb-5 h-full w-10 ">
                          <div className="barContainer flex items-end justify-center h-[65%] my-3 w-10 border-1 border-gray-400 rounded-extra">
                            <div className="flex items-center justify-center w-[80%] h-[65%] mb-1  glass6 rounded-b-extra">
                                <p className="text-[12px] font-bold">60%</p>
                            </div> 
                          </div>
                          <div className="flex justify-center items-center w-10 h-10">
                          <Icon size={24}>
                              <LogoAngular/>
                            </Icon>
                          </div>
                      </div>
                      <div className="flex flex-col ml-6 justify-end pb-5 h-full w-10 ">
                          <div className="barContainer flex items-end justify-center h-[65%] my-3 w-10 border-1 border-gray-400 rounded-extra">
                            <div className="flex items-center justify-center w-[80%] h-[35%] mb-1  glass7 rounded-b-extra">
                                 <p className="text-[12px] font-bold">30%</p>
                            </div> 
                          </div>
                          <div className="flex justify-center items-center w-10 h-10">
                          <Icon size={24}>
                              <LogoPython/>
                            </Icon>
                          </div>
                      </div>
                      <div className=" flex flex-col ml-6 justify-end pb-5 h-full w-10 ">
                          <div className="barContainer flex items-end justify-center h-[65%] my-3 w-10 border-1 border-gray-400 rounded-extra">
                            <div className="flex items-center justify-center w-[80%] h-[45%] mb-1  glass8 rounded-b-extra">
                              <p className="text-[12px] font-bold">38%</p>
                            </div> 
                          </div>
                          <div className="flex justify-center items-center w-10 h-10">
                            <Icon size={24}>
                                <Java/>
                              </Icon>
                          </div>
                      </div>
                </div>
            </div>


            <div className='h-[90%] flex flex-col w-1/3  mt-5 bg-[#ffffff26] top-projects rounded-extra'>
              <div className="flex w-full mt-5 pl-7">
                 <h3 className="font-bold text-sky-950 w-[78%]">Top Projects</h3>
                 <button className="flex items-center justify-center w-[20%] transition-transform duration-150 ease-in-out transform active:translate-y-[2px]"
                          onClick={() => setIsModalOpen(!isModalOpen)}>
                    <Icon size={25} color='#0c4a6e'><FolderAdd/></Icon>
                 </button>
                 { isModalOpen && <TopProjects isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/> }
                 
              </div>
               
                <div className="w-full flex flex-col mt-7 space-y-3">
                    {
                      topProjects.length > 0 ? (
                        topProjects.map((projectId: string) => {
                          const project = projects.find((project) => project.pid === projectId)
                            return (
                              <div className="glass flex w-[90%] h-14 justify-end items-center border-1 border-gray-400  pr-2 ml-auto mr-auto rounded-extra ">
                                <button className="flex justify-center items-center w-11 h-11 rounded-extra border-1 border-gray-400 glass">
                                  <Icon size={24}>
                                    <ArrowUpRight/>
                                  </Icon>
                                </button>
                                <div className="flex w-[80%] h-full items-center justify-end">
                                  <p className="text-sm font-bold text-sky-950 mr-5">{project?.name}</p>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="glass flex w-[90%] h-14 justify-end items-center border-1 border-gray-400  pr-2 ml-auto mr-auto rounded-extra">
                            <div className="flex w-[80%] h-full items-center justify-end">
                              <p className="text-sm font-bold text-sky-950 mr-5">No projects added</p>
                            </div>
                          </div>
                        )
                    }
                </div>
            </div>

            <div className='h-[90%] mt-5 flex flex-col w-1/3 bg-[#ffffff26] top-projects rounded-extra'>
              <div className="glass border-1 border-gray-400 flex jus w-[90%] h-[90%] items-end rounded-extra mx-auto my-auto particles-container">
                  {/* Componente de particulas */}
                 {/* <ParticlesContainer/> */}

                  <div className="flex flex-col glassu absolute top-6 left-4 rounded-extra h-[55%] w-[90%] border-1 border-gray-400">
                    <p className="text-[20px] font-bold text-sky-950 ml-8 mt-2">
                      V1 Update: <p className="text-sm ml-2">"First Commit"</p>
                    </p>         

                    <p className="text-[14px] text-sky-950 mt-2 ml-8">
                      Discover how in a world with high entropy, you can preserve low entropy.
                    </p>
                    <p className="text-[14px] font-bold text-sky-950 ml-8">
                    Welcome to PrjManager.
                    </p>
                  </div>

                  <button className="flex items-center justify-center glassu w-[90%] h-14 rounded-extra border-1 border-gray-400 ml-auto mr-auto mb-5">
                      <p className="text-sm font-bold text-sky-950">Read Me</p>     
                  </button>

              </div>
            </div>

        </div>
    </div>

  )
}
