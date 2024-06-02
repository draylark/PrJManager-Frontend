import { useSelector } from "react-redux"
import { useState, useEffect, useRef, FC, Fragment } from "react";
import { ListItem, Avatar, ListItemSecondaryAction, ListItemAvatar, List, Divider } from "@mui/material";
import axios from "axios";
import projectbg from '../../assets/imgs/projectbg.jpg'
import { useNotificationsData } from "./hooks/useNotificationsData";
import { ScaleLoader } from 'react-spinners';
import { BeatLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { getInitialsAvatar } from "../projects/helpers/helpers";
import { useNavigate } from "react-router-dom";
import { cleanUrl } from "../projects/helpers/helpers";

type MyComponentProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


export const NotificationsModal: FC<MyComponentProps> = ({ setIsOpen }) => {

  const navigate = useNavigate()
  const { uid, photoURL, username } = useSelector( (selector) => selector.auth);
  const { notifications, fetchingNotifications, errorMessage, errorWhileFetching } = useNotificationsData(uid)

  const [handledRequests, setHandledRequests] = useState({})
  const [isActive, setIsActive] = useState(false);
  const modalRef = useRef(null);

  const handleRequest = async (notiID, uid, requester, requestStatus, type, additional ) => {
    try {
      switch (type) {
        case 'friend-request': {
          handlingR(notiID);
          await axios.put(`http://localhost:3000/api/friends/handle-friend-request/${requester}`, { requestStatus, uid, notiID, ref: additional.ref }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('x-token')
            }
          })
          .then((res) => {
            setHandledRequests((prev) => ({
              ...prev,
              [notiID]: res.data.accepted ? 'accepted' : 'rejected'
            }));
          })
          .catch((error) => {
            setHandledRequests((prev) => {
              const { [notiID]: _, ...rest } = prev;
              return rest;
            });
            Swal.fire({
              title: error.response.data.message || 'Error handling friend request',
              icon: 'error',
              timer: 2000,
              showConfirmButton: false
            });
          });
          break;
        }
  
        case 'project-invitation': {
          handlingR(notiID);
          await axios.put(`http://localhost:3000/api/projects/handle-invitation/${additional.projectID}`, { requestStatus, uid, name: username, photoUrl: photoURL, accessLevel: additional.accessLevel, notiID }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('x-token')
            }
          
          })
          .then((res) => {
            setHandledRequests((prev) => ({
              ...prev,
              [notiID]: res.data.accepted ? 'accepted' : 'rejected'
            }));
          })
          .catch((error) => {
            setHandledRequests((prev) => {
              const { [notiID]: _, ...rest } = prev;
              return rest;
            });
            Swal.fire({
              title: error.response.data.message || 'Error handling project invitation',
              icon: 'error',
              timer: 2000,
              showConfirmButton: false
            });
          });
          break;
        }
  
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlingR = (requestId) => {
    setHandledRequests((prev) => ({
      ...prev,
      [requestId]: 'loading'
    }));
  };

  const renderNotiType = (type, request) => {
    switch (type) {
      case 'friend-request':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3 justify-between w-full">
              <div className="flex items-center space-x-3">
                <img
                  src={request.from.photoUrl || getInitialsAvatar(request.from.name)}
                  className='border-[1px] border-gray-400 rounded-full'
                  style={{
                    width: '50px',
                    height: '50px',
                  }}
                />
                <div className="flex flex-col h-full">
                  <p className="text-[9px] text-black">{request.type}</p>
                  <p className="w-[200px] text-black text-xs font-semibold cursor-pointer">@{request.from.name}</p>
                  <p className="text-black text-xs">Sent you a friend request.</p>

                </div>
              </div>     
              {
                  Object.keys(handledRequests).includes(request._id) && handledRequests[request._id] === 'loading' ? (
                    <div className="flex items-center space-x-3 pr-5">
                      <BeatLoader color='#0c4a6e' size={8} loading={true} />
                    </div>
                  ) 
                  : 
                  handledRequests[request._id] === 'accepted' ? (
                    <div className="flex items-center space-x-3 pr-5">
                      <p className="text-green-500">Accepted</p>
                  </div>
                  )
                  : handledRequests[request._id] === 'rejected' ? (
                    <div className="flex items-center space-x-3 pr-5">
                      <p className="text-red-500">Rejected</p>
                    </div>
                  )
                  :
                    <div className="flex space-x-2">
                        <button
                          onClick={() => handleRequest(request._id, request.recipient, request.from.ID, 'accept', 'friend-request', request.additionalData)}
                          className="text-[10px] text-black w-14 h-8 rounded-xl glassi border-1 border-black hover:bg-blue-500/40 transition-colors duration-150"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequest(request._id, request.recipient, request.from.ID, 'reject', 'friend-request', request.additionalData)}
                          className="text-[10px] text-black w-14 h-8 rounded-xl glassi border-1 border-black hover:bg-blue-500/40 transition-colors duration-150"
                        >
                          Reject
                        </button>
                    </div>
              }
            </div>

            <div className="border-[1px] border-gray-300 w-full"/>        
          </div>
        );     
      case 'project-invitation':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-between space-x-3 w-full">
              <div className="flex items-center space-x-3 ">
                <img
                  src={projectbg}
                  className='border-[1px] border-gray-400 rounded-lg'
                  style={{
                    width: '60px',
                    height: '60px',
                  }}
                />
                <div className="flex flex-col">
                  <p className="text-[9px] text-black">{request.type}</p>
                  <p className="text-black">{request.additionalData.project_name}</p>
                  <p className="w-[200px] text-black text-xs"> <span className="font-semibold cursor-pointer">@{request.from.name}</span>  invited you to join this project as <span className="font-bold text-green-600"> {request.additionalData.accessLevel} </span> </p>
                </div>
              </div>


              {
                Object.keys(handledRequests).includes(request._id) && handledRequests[request._id] === 'loading' ? (
                  <div className="flex items-center space-x-3 pr-5">
                    <BeatLoader color='#0c4a6e' size={8} loading={true} />
                  </div>
                ) 
                : 
                handledRequests[request._id] === 'accepted' ? (
                  <div className="flex items-center space-x-3 pr-5">
                    <p className="text-green-500">Accepted</p>
                </div>
                )
                : handledRequests[request._id] === 'rejected' ? (
                  <div className="flex items-center space-x-3 pr-5">
                    <p className="text-red-500">Rejected</p>
                  </div>
                )
                :
                  <div className="flex space-x-2">
                      <button
                        onClick={() => handleRequest(request._id, request.recipient, request.from.ID, 'accept', 'project-invitation', request.additionalData)}
                        className="text-[10px] text-black w-14 h-8 rounded-xl glassi border-1 border-black hover:bg-blue-500/40 transition-colors duration-150"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequest(request._id, request.recipient, request.from.ID, 'reject', 'project-invitation', request.additionalData)}
                        className="text-[10px] text-black w-14 h-8 rounded-xl glassi border-1 border-black hover:bg-blue-500/40 transition-colors duration-150"
                      >
                        Reject
                      </button>
                  </div>
              }
            </div>
            <div className="border-[1px] border-gray-300 w-full"/>      
          </div>
        );
      case 'new-follower' :
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3 justify-between w-full">
              <div className="flex items-center space-x-3">
                <img
                  src={request.from.photoUrl || getInitialsAvatar(request.from.name)}
                  className='border-[1px] border-gray-400 rounded-full'
                  style={{
                    width: '50px',
                    height: '50px',
                  }}
                />
                <div className="flex flex-col h-full">
                  <p className="text-[9px] text-black">{request.type}</p>
                  <p 
                    className="w-[200px] text-black text-xs font-semibold cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      navigate(`/profile/${cleanUrl(request.from.name)}`, {
                        state: {
                          user: {
                            uid: request.from.ID,
                            username: request.from.name
                          }
                        }
                      })
                    }}
                  >
                    @{request.from.name}
                  </p>
                  <p className="text-black text-xs">Started following you.</p>
                </div>
              </div>     
            </div>
            <div className="border-[1px] border-gray-300 w-full"/>        
          </div>
        )
        default:
        return <p>Unidentified Type</p>;
      }
  };

  useEffect(() => {
    // Añade un pequeño retraso para iniciar la animación
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  console.log(notifications)
  const animationClasses = isActive ? 'opacity-100' : 'opacity-0';

  return (
        <div  
          ref={modalRef} 
          data-popover id="popover-notications" 
          role="tooltip" 
          className={`absolute flex flex-col space-y-2 px-2 pt-2 w-[460px] h-[690px] border-[1px]
           border-gray-400 transition-opacity duration-300 ease-in-out ${animationClasses}
            bg-blue-50 glassi  z-10 text-sm text-white rounded-lg shadow-sm bottom-3 left-[270px]`}
        >
         <p className="text-sky-950 font-bold mb-1 mt-2 ml-3">General Notifications</p>

          <div className="flex flex-col space-y-5 flex-grow max-h-[640px] overflow-y-auto p-3">
              {
                  fetchingNotifications 
                  ? (
                      <div className='flex h-full w-full justify-center items-center'>
                        <ScaleLoader color='#0c4a6e' loading={true} />
                      </div>
                    ) 
                  : errorWhileFetching  
                  ? (
                      <div className='flex flex-grow justify-center items-center'>
                        <p className='text-red-500 font-semibold'>{errorMessage}</p>
                      </div>
                    )
                  : notifications.length === 0
                  ? (
                      <div className='flex flex-grow justify-center items-center'>
                        <p className='text-blue-500 font-semibold'>No notifications yet</p>
                      </div>
                    )
                  :                  
                    (
                      notifications.map((noti, index) => (
                        <Fragment key={index}>
                          {renderNotiType(noti.type, noti)}
                        </Fragment>
                      ))
                    )
              }
          </div>

      </div>

  )
}
