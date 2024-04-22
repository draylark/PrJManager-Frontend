import { useSelector } from "react-redux"
import { useState, useEffect, useRef, FC, Fragment } from "react";
import { RootState } from "../../../../store/store";
import { ListItem, Avatar, ListItemSecondaryAction, ListItemAvatar, List, Divider } from "@mui/material";
import axios from "axios";
import projectbg from '../../../assets/imgs/projectbg.jpg'


type MyComponentProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


export const ModalNotis: FC<MyComponentProps> = ({ setIsOpen }) => {


   const { friendsRequests, uid, photoURL, username } = useSelector( (selector: RootState) => selector.auth);

   console.log(photoURL)

    const { notis } = useSelector( (selector: RootState) => selector.notis);
    const [isActive, setIsActive] = useState(false);
    const [allFriendsRequest, setAllFriendsRequest] = useState([])
    const modalRef = useRef(null);


    const handleRequest = async (notiID, uid, requester, requestStatus, type, additional ) => {
      try {
        switch (type) {
          case 'friend-request': {
            const response = await axios.post(`http://localhost:3000/api/friends/handle-request/${requester}`, { requestStatus, uid, notiID });
            console.log(response);
            break;
          }
    
          case 'project-invitation': {
            const response = await axios.put(`http://localhost:3000/api/projects/handle-invitation/${additional.projectID}`, { requestStatus, uid, name: username, photoUrl: photoURL, accessLevel: additional.accessLevel, notiID }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('x-token')
              }
            
            });
            console.log(response);
            break;
          }
    
          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      const fetchFriendsRequests = async () => {
        const requests = await Promise.all(friendsRequests.map(async (userId) => {
          const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
          return response.data.user;
        }));
        setAllFriendsRequest(requests);
      };
    
      if (friendsRequests.length > 0) {
        fetchFriendsRequests();
      }
    }, [friendsRequests]);
    
    useEffect(() => {
      // Añade un pequeño retraso para iniciar la animación
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 50);
  
      return () => {
        clearTimeout(timer);
      };
    }, []);


  const animationClasses = isActive ? 'opacity-100' : 'opacity-0';

  return (

        <div  
          ref={modalRef} 
          data-popover id="popover-notications" 
          role="tooltip" 
          className={`flex flex-col space-y-2 px-2 pt-2 w-[470px] h-[500px] border-[1px] border-black transition-opacity duration-700 ease-in-out ${animationClasses} bg-blue-50  mt-16 mr-46 absolute z-10 text-sm text-white rounded-lg shadow-sm`}
        >
         <p className="text-sky-950 font-bold mb-1 mt-2 ml-3">Notifications</p>

          <div className="flex flex-col flex-grow max-h-[450px] overflow-y-auto p-3">
            <List dense>
              {notis.map((request) => (
                request.type === 'friend-request' ?
                  <Fragment>
                      <ListItem key={request._id} className="flex items-center">
                        <ListItemAvatar>
                          <Avatar src={request.from.photoUrl} />
                        </ListItemAvatar>
                        <div className="flex flex-col">
                          <p className="text-black">{request.from.name}</p>
                          <p className="text-black text-xs">Sent you a friend request</p>
                        </div>
                        <ListItemSecondaryAction>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRequest(request._id, request.recipient, request.from.ID, 'accept', 'friend-request')}
                              className="text-black w-16 h-8 rounded-xl glassi border-1 border-black hover:bg-blue-500/40 transition-colors duration-150"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRequest(request._id, request.recipient, request.from.ID, 'reject', 'friend-request')}
                              className="text-black w-16 h-8 rounded-xl glassi border-1 border-black hover:bg-blue-500/40 transition-colors duration-150"
                            >
                              Reject
                            </button>
                          </div>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider style={{marginTop: 5}} />
                  </Fragment>  
                  : 
                  request.type === 'project-invitation' ?
                      <Fragment>
                          <ListItem key={request._id} className="flex items-center">
                            <div
                              className='border-[1px] border-gray-400'
                              style={{
                                width: '50px',
                                height: '50px',
                                marginRight: '20px',
                                backgroundImage: `url(${projectbg})`,
                                backgroundSize: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                            <div className="flex flex-col ">
                              <p className="text-[9px] text-black">{request.type}</p>
                              <p className="text-black">{request.additionalData.project_name}</p>
                              <p className="w-[200px] text-black text-xs"> <span className="font-semibold cursor-pointer">@{request.from.name}</span>  invited you to join this project as <span className="font-bold text-green-600"> {request.additionalData.accessLevel} </span> </p>
                            </div>
                            <ListItemSecondaryAction>
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
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider style={{marginTop: 10,  backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
                      </Fragment>
                  : null
              ))}
            </List>
          </div>

      </div>

  )
}
