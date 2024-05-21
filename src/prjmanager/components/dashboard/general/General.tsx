import { TreeChart } from "./charts/TreeChart"
import { useState, useEffect} from "react"
import { ArrowBigRightLines, ArrowUpRight } from '@ricons/tabler'
import { FolderAdd } from '@ricons/carbon'
import { LogoReact, LogoVue, LogoAngular, LogoPython } from '@ricons/ionicons5'
import { HeatMapCalendar } from "./Heatmap/HeatMapCalendar"
import { Java } from '@ricons/fa'
import { Icon } from '@ricons/utils';
import { TopProjects } from "./modal/TopProjects"
import { RootState } from "../../../../store/store"
import { useSelector } from "react-redux"
import { QuickNotis } from "./notis/QuickNotis"
import { CardContainer, CardBody, CardItem } from "./updates/3d-card"
import { Link } from "react-router-dom"
import figures from '../../../assets/imgs/projectbg.jpg'
import sea from '../../../assets/imgs/sea.jpg'
import stars from '../../../assets/imgs/stars.jpg'
import { useTreeChartData } from "../../../hooks/useTreeChartData"
import { ScaleLoader } from 'react-spinners';
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { cleanUrl } from "../../projects/helpers/helpers"

import '../styles.css'
import '../updates.css'


export const General = () => {


  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, errorWhileFetching, errorMessage, noData, noDataMessage } = useTreeChartData();
  const { uid, topProjects } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const task = location.state?.task

  const articles = [
    {
      title: "PrJManager",
      description: "Discover how to reduce entropy in a chaotic world.",
      image: figures,
      styles: 'text-black'
    },
    {
      title: "PrJExtension",
      description: "Explore the dynamic use of the PrJManager extension that mimics the Git system.",
      image: sea,
      styles: 'text-white'
    },
    {
      title: "PrJConsole",
      description: "An introduction to the PrJManager interactive console commands.",
      image: stars,
      styles: 'text-white'
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 10000); // 10 segundos
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const currentArticle = articles[currentIndex];


  if( task?.taskId ) return <Outlet/>

  return (
    <div id='general' className='flex flex-col w-full h-full rounded-extra max-h-[700px]'>

        <div id='charts' className='flex w-[96%] ml-auto mr-auto h-[50%] treechart-container rounded-extra bg-[#ffffff26] pl-4 space-x-2'>
            <div className="flex h-full w-[35%] items-center">
              <HeatMapCalendar/>
            </div>

            <div id="chart-container" className="info-box-shadow-treechart h-full w-[65%]  rounded-extra  overflow-hidden">
              {
                isLoading 
                ? (
                    <div className='flex h-full justify-center items-center'>
                      <ScaleLoader color='#0c4a6e' loading={true} />
                    </div>
                  ) 
                : errorWhileFetching || noData
                ? (
                    <div className='flex h-full justify-center items-center font-semibold'>
                      <p className={ errorWhileFetching ? 'text-red-500' : 'text-blue-500' }>
                        { errorWhileFetching ? errorMessage : noDataMessage }</p>
                    </div>
                  )          
                : <TreeChart data={data} isLoading={isLoading}  />
              }
             
            </div>
        </div>


        <div id='extra-info' className='flex w-full space-x-4 px-7 h-[50%] rounded-extra'>

            <div id="quickNotis" className='flex flex-col h-[90%] space-y-3 mt-5 ml-1  w-[30%] glassi rounded-extra bg-[#ffffff26] border-[1px] border-gray-400'>
                <h3 className="font-bold text-sky-950 mt-5 ml-6 text-[14px]">Activity Notifications</h3>
                <QuickNotis uid={uid}/>
            </div>

            <div id="topProjects" className='h-[90%] flex flex-col w-1/3 glassi  mt-5 bg-[#ffffff26] rounded-extra border-[1px] border-gray-400'>
                <div className="flex items-center justify-between w-full mt-5 pl-7 ">
                  <h3 className="font-bold text-sky-950 text-[14px]">Top Projects</h3>
                  <button className="flex items-center justify-center w-[20%] transition-transform duration-150 ease-in-out transform active:translate-y-[2px]"
                            onClick={() => setIsModalOpen(!isModalOpen)}>
                      <Icon size={25} color='#0c4a6e'><FolderAdd/></Icon>
                  </button>
                  { isModalOpen && <TopProjects uid={uid} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/> }        
                </div>
                
                  <div className="w-full h-full flex flex-col mt-7 space-y-5">
                      {
                        topProjects.length > 0 ? (
                          topProjects.map((project: string) => {               
                              return (
                                <div className="glassi flex w-[90%] h-14 justify-end items-center border-1 border-gray-400  pr-2 ml-auto mr-auto rounded-extra transition-all duration-150 ease-in-out transform hover:translate-y-[-2px]">
                                  <button 
                                    onClick={() => navigate(`../projects/${cleanUrl(project.name)}`, { state: { project: { ID: project._id, name: project.name } } })}
                                    className="flex justify-center items-center w-11 h-11 rounded-extra border-[1px] border-gray-400 hover:glassi-hover glassi transition-all duration-200 ease-in-out transform hover:rotate-[-90deg]">
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
                                <p className="text-sm font-bold text-sky-950 mr-5">No Top Projects added</p>
                              </div>
                            </div>
                          )
                      }
                  </div>
            </div>

            <div id="articles-updates" className='h-[90%] mt-5 flex flex-col w-1/3 rounded-extra glassi'>
                <CardContainer className="inter-var w-full h-full bg-[#ffffff26] rounded-extra" >
                  <CardBody className="relative group/card w-auto sm:w-full h-full rounded-extra">
                    <div
                      style={{
                          backgroundImage: `url(${currentArticle.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                      }}
                      className="pt-10 px-8 h-full w-full object-cover rounded-extra group-hover/card:shadow-xl border-[1px] border-gray-400 "
                    >
                      <CardItem
                        as="h1"
                        translateZ="30"
                      className={`text-4xl font-bold ${currentArticle.styles}`}
                      >
                        {currentArticle.title}
                      </CardItem>
                      <CardItem
                        as="p"
                        translateZ="20"
                        className={`text-2xl max-w-sm mt-2 font-semibold  ${currentArticle.styles}`}
                      >
                        {currentArticle.description}
                      </CardItem>

                      <div className="absolute flex justify-between w-full items-center left-0 bottom-6 px-7">
                        <CardItem
                          translateZ={20}
                          as="button"
                          onClick={handleNext}
                          className={`px-4 py-2 rounded-xl text-xs font-normal ${currentArticle.styles}`}
                        >
                          Next  →
                        </CardItem>
                        <CardItem
                          translateZ={20}
                          as="button"
                          className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold border-[1px] border-gray-400 hover:bg-blue-200"
                        >
                          Read
                        </CardItem>
                      </div>
                    </div>
                  </CardBody>
                </CardContainer>
            </div>
          
        </div>
    </div>

  )
}
