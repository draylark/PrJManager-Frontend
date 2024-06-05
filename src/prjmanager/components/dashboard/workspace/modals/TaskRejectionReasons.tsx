import { useState, useEffect } from 'react'
import { ImCancelCircle } from "react-icons/im";
import { formateDate, getInitialsAvatar } from '../../../../helpers/helpers';

export const TaskRejectionReasons = ({ setIsTaskReasonsOpen, isTaskReasonsOpen, reasons }) => {

    console.log('reasons', reasons)
    const handleClose = () => {
        const modal = document.getElementById('tasksReasons');
        if (modal) {
            modal.classList.replace('opacity-100', 'opacity-0');
            setTimeout(() => {
                setIsTaskReasonsOpen(false);
            }, 500);
        }
    };


    useEffect(() => {
        if (isTaskReasonsOpen) {
          const timer = setTimeout(() => {
            document.getElementById('tasksReasons').classList.remove('opacity-0');
            document.getElementById('tasksReasons').classList.add('opacity-100');
          }, 20);
          return () => clearTimeout(timer);
        }
    }, [isTaskReasonsOpen]);


    return (
        <div className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50'>
          <div id="tasksReasons"
            className={`overflow-hidden flex flex-col w-[70%] md:w-[50%] md:max-h-[735px] md:min-h-[535px] items-center rounded-2xl glassi bg-white border-[1px] border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isTaskReasonsOpen ? '' : 'pointer-events-none'}`}
          >
            <div className='flex justify-between items-center w-[95%] h-12 ml-auto mr-auto mt-2'>
              <p className='text-xl font-semibold text-black'>Task Rejection Reasons</p>
              <button onClick={handleClose} className='text-gray-500 hover:text-gray-700'>
                <ImCancelCircle size={20} />
              </button>
            </div>
    
            <div className='flex flex-col flex-grow w-full max-h-[650px] ml-auto mr-auto mt-4 p-4 overflow-y-auto'>
              {reasons.map((reason, index) => (
                <div key={index} className='flex flex-col w-full p-4 mb-4 shadow-lg bg-gray-100 rounded-lg space-y-3'>
                  <div className='flex items-center space-x-4'>
                    <img src={reason.uid.photoUrl || getInitialsAvatar(reason.uid.username)} alt='avatar' className='w-10 h-10 rounded-full' />
                    <div className='flex flex-col'>
                      <span className='text-lg font-semibold text-black'>{reason.uid.username}</span>
                      <span className='text-sm text-gray-600'>About the submitted task on <span className='font-semibold'>{formateDate(reason.taskSubmissionDate)}</span></span>
                    </div>
                  </div>
                  <div className='relative flex flex-grow h-full space-x-2 mt-2'>
                    <p className='text-[14px] font-semibold '>Reason:</p>
                
                    <div className='max-h-[200px] overflow-y-auto'>
                        <p className='text-sm text-black'>
                            {reason.text}
                        </p>
                    </div>               
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
}
