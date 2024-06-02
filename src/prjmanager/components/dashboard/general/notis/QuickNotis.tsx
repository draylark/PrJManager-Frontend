import { useState, useEffect } from 'react'
import { useQuickNotisData } from './hooks/useQuickNotisData'
import platy from '../../../../assets/imgs/platy.jpg'
import { ScaleLoader   } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { cleanUrl, formateDate } from '../../../projects/helpers/helpers';
import Swal from 'sweetalert2'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';

export const QuickNotis = ({ uid }) => {

  const navigate = useNavigate();
  const { notifications, isLoading, errorMessage, errorWhileFetching } = useQuickNotisData(uid)


  const renderNotification = (type, noti) => {

    switch (type) {
      case 'new-task-commit':
        return (
          <div className="flex flex-col space-y-1 rounded-r-lg  p-2 pr-3 text-[12px] border-[1px] border-gray-400 glassi">
            <p className='font-semibold text-[11px]'>{formateDate(noti.createdAt)}</p>
            <p><span className='font-semibold'>@{noti.additionalData.username}</span> has pushed new commits to the task <span className='font-semibold transition-colors duration-200 hover:text-blue-500 text-blue-600 cursor-pointer'>{noti.additionalData.taskName}</span> in the repository <span className='font-semibold text-green-600'>{noti.additionalData.repositoryName}</span>.</p>
          </div>
        );
      case 'task-assignation': 
        return (
          <div className="flex flex-col space-y-1 rounded-r-lg  p-2 pr-3 text-[12px] border-[1px] border-gray-400 glassi">
            <p className='font-semibold text-[11px]'>{formateDate(noti.createdAt)}</p>
            <p>The task <span onClick={() => navigate(`workspace/${cleanUrl(noti.additionalData.taskName)}`, {
                state: {
                  task: {
                    taskId: noti.additionalData.taskId,
                    new: true
                  }
                }
            })}   
            className='font-semibold transition-colors duration-200 hover:text-blue-500 text-blue-600 cursor-pointer'>{noti.additionalData.taskName}</span> in the repository <span className='font-semibold text-green-600'>{noti.additionalData.repositoryName}</span>, has been assigned to you.</p>
          </div>  
        );
      case 'task-invitation':
        return (
          <div className="flex flex-col space-y-1 rounded-r-lg  p-2 pr-3 text-[12px] border-[1px] border-gray-400 glassi">
            <p className='font-semibold text-[11px]'>{formateDate(noti.createdAt)}</p>
            <p>{noti.description} <span onClick={() => invitationAlert(noti._id, noti.additionalData.taskId, noti.additionalData.taskName)} className='cursor-pointer font-semibold transition-colors duration-200 hover:text-blue-500 text-blue-600'>
              {noti.additionalData.taskName}</span> in the repository <span  className='font-semibold text-green-600'>
                {noti.additionalData.repositoryName}.
              </span>
            </p>
          </div>  
        );
      case 'task-approved':
        return (
          <div className="flex flex-col space-y-1 rounded-r-lg  p-2 pr-3 text-[12px] border-[1px] border-gray-400 glassi">
            <p className='font-semibold text-[11px]'>{formateDate(noti.additionalData.date)}</p>
            <p>The task <span  onClick={() => navigate(`workspace/${cleanUrl(noti.additionalData.taskName)}`, {
                state: {
                  task: {
                    taskId: noti.additionalData.taskId,
                    new: true
                  }
                }
            })}  
            className='font-semibold transition-colors duration-200 hover:text-blue-500 text-blue-600 cursor-pointer'>{noti.additionalData.taskName}</span> has been <span className='text-green-700'>approved.</span> </p>   
          </div>  
        );
      case 'task-rejected':
        return (
          <div className="flex flex-col space-y-1 rounded-r-lg p-2 pr-3 text-[12px] border-[1px] border-gray-400 glassi">
            <p className='font-semibold text-[11px]'>{formateDate(noti.additionalData.date)}</p>
            <p>The task <span onClick={() => navigate(`workspace/${cleanUrl(noti.additionalData.taskName)}`, {
                state: {
                  task: {
                    taskId: noti.additionalData.taskId,
                    new: true
                  }
                }
            })}  
            className='font-semibold transition-colors duration-200 hover:text-blue-500 text-blue-600 cursor-pointer'>{noti.additionalData.taskName}</span> has been <span className='text-red-500'>rejected</span>, see the reason <span onClick={() => navigate(`workspace/${cleanUrl(noti.additionalData.taskName)}`, {
              state: {
                task: {
                  taskId: noti.additionalData.taskId,
                  new: true,
                  reasons: true
                }
              }
          })} className='cursor-pointer font-semibold underline'>here</span>. </p>
          </div>  
        );
      case 'added-to-repo':
        return (
          <div className="flex flex-col space-y-1 rounded-r-lg p-2 pr-3 text-[12px] border-[1px] border-gray-400 glassi">
            <p className='font-semibold text-[11px]'>{formateDate(noti.createdAt)}</p>
            <p>You have been added to the repository <span onClick={() => navigate(`/projects/${cleanUrl(noti.additionalData.projectName)}/${cleanUrl(noti.additionalData.layerName)}/${cleanUrl(noti.additionalData.repoName)}`, {
                state: {            
                    project: { ID: noti.from.ID, name: noti.additionalData.projectName, accessLevel: noti.additionalData.accessLevel || null },
                    layer: { layerID: noti.additionalData.layerId, layerName: noti.additionalData.layerName }, 
                    repository: { repoID: noti.additionalData.repoId, repoName: noti.additionalData.repoName }             
                }
            })} 
            className='font-semibold transition-colors duration-200 hover:text-green-500 text-green-600 cursor-pointer'>{noti.additionalData.repoName}</span> in the project <span className='font-semibold text-blue-600'>{noti.additionalData.projectName}</span>  with a <span className='font-bold'>{noti.additionalData.accessLevel}</span> access level.</p>
          </div>  
        );

      case 'added-to-layer':
        return (
          <div className="flex flex-col space-y-1 rounded-r-lg p-2 pr-3 text-[12px] border-[1px] border-gray-400 glassi">
            <p className='font-semibold text-[11px]'>{formateDate(noti.createdAt)}</p>
            <p>You have been added to the layer <span onClick={() => navigate(`/projects/${cleanUrl(noti.additionalData.projectName)}/${cleanUrl(noti.additionalData.layerName)}`, {
                state: {            
                    project: { ID: noti.from.ID, name: noti.additionalData.projectName },
                    layer: { layerID: noti.additionalData.layerId, layerName: noti.additionalData.layerName }        
                }
            })} className='font-semibold transition-colors duration-200 hover:text-pink-500 text-pink-600 cursor-pointer'>{noti.additionalData.layerName}</span> in the project <span className='font-semibold text-blue-600'>{noti.additionalData.projectName}</span>.</p>
          </div>  
        );
      
      default: 
        return <p>Unidentified Type</p>;
    }
  };

  const handleInvitation = (accepted, taskId, notiId, taskName) => {
      axios.put(`${backendUrl}/tasks/handle-task-invitation/${taskId}`, {
        uid,
        accepted,
        notiId
      }, {
        headers: {
          Authorization: localStorage.getItem('x-token')
        }
      })
      .then( res => {
        Swal.fire({
          title: res.data.message || 'Invitation Handled.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        if( res.data.message === 'Invitation accepted'){
            setTimeout(() => {
              navigate(`workspace/${cleanUrl(taskName)}`, {
                state: {
                  task: {
                    taskId,
                    new: true
                  }
                }
              })
          }, 2000);
        }
      })
      .catch( error => {
        Swal.fire({
          title: error.response.data.message || 'Error handling invitation',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      })
  };

  const invitationAlert = (notiId, taskId, taskName) => {
    Swal.fire({
      title: 'You have been invited to a task',
      text: 'If you accept, you can contribute to the task and collaborate with other users. Do you want to accept the invitation?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Reject',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    })
    .then((result) => {
      if (result.isConfirmed) {
        handleInvitation(true, taskId, notiId, taskName)
      } else {
        handleInvitation(false, taskId, notiId,  taskName)
      }
    })
  };

  return (
    <div className="flex flex-col space-y-4 flex-grow max-h-[252px] overflow-y-auto  rounded-b-extra">
        {

            isLoading 
            ? (
                <div className='flex flex-grow justify-center items-center  min-h-[150px]'>
                  <ScaleLoader color='#0c4a6e' loading={true} />
                </div>
              ) 
            : errorWhileFetching
            ? (
                <div className='flex flex-grow justify-center items-center  min-h-[150px]'>
                  <p className='text-red-500 font-semibold'>{errorMessage}</p>
                </div>
              )
            :
              notifications.length === 0 
              ? (
                  <div className='flex flex-grow justify-center items-center  min-h-[150px]'>
                    <p className='text-blue-500 font-semibold'>No notifications yet</p>
                  </div>
                )
              :
                (
                  notifications.map((noti, index) => (
                    <div key={index} id="bu" className="flex space-x-2 w-full  px-5 ">
                      <img
                          className="w-6 h-6 border-[1px] border-white rounded-full dark:border-gray-800"
                          src={ platy || `https://dummyimage.com/500x500/000/fff&text=S`}
                          alt=''
                          onError={(e) => {
                              e.target.onerror = null; // prevents looping
                              e.target.src = `https://dummyimage.com/500x500/000/fff&text=S`;
                          }}
                      />

                      {renderNotification(noti.type, noti)}
                    </div>
                  ))
                )         
        }
    </div>
  )
}
