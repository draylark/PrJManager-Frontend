import React, { useState, useEffect, useRef, Fragment } from 'react';
import { TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, Divider, Box, IconButton, Dialog, DialogContent, DialogTitle, DialogActions, Typography } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useFetchComments } from './hooks/useFetchComments';
import { tierS, tierA } from '../../../helpers/accessLevels-validator';
import { PuffLoader  } from 'react-spinners';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { RootState } from '../../../../store/store';
import { MComment } from './hooks/useFetchComments';


export const Comments = () => {

    const listRef = useRef(null);
    const location = useLocation();
    const project = location.state?.project;

    const [commentToDelete, setCommentToDelete] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [moreOption, setMoreOption] = useState('')
    const [showButtons, setShowButtons] = useState(false)
    const [newComment, setNewComment] = useState(''); 
    const [newAnswer, setNewAnswer] = useState<{ [key: string]: string }>({});
    const [replyField, setReplyField] = useState<{ [key: string]: boolean }>({});
    const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
    const { currentProject} = useSelector((state: RootState) => state.platypus );
    const { uid, username, photoUrl } = useSelector((state: RootState) => state.auth);
    
    const { setComments, fetchComments, fetchMoreReplies, handleLikeDislike, setNoCommentsToFetch,
            comments, likes, noCommentsToFetch, hasMoreComments, currentPage,  isLoading, errorMessage,
            errorWhileFetching, setErrorWhileFetching, errorType } = useFetchComments()


    const handleCommentSubmit = async() => {
        try {
            const response = await axios.post(`${backendUrl}/comments/create-comment`, { project: project.ID, content: newComment, uid, photoUrl })
            const commentInfo = response.data.newComment

            const comment: MComment = {
                id: commentInfo._id, // Mejor usar un ID único
                content: commentInfo.content,
                username: username as string,
                photoUrl: commentInfo.photoUrl || null, // Suponiendo que tienes la URL del avatar en los datos del usuario
                likes: commentInfo.likes,
                commentParent: commentInfo.commentParent,
                answering_to: commentInfo.answering_to,
                current_page: 1,
                total_pages: 1,
                createdAt: new Date().toISOString()
            };
            setComments([ comment, ...comments ]);
            setNoCommentsToFetch(false)
            setNewComment('');
        } catch (error) {
            console.error('There was an error:', error);        
        }

    };

    const handleAnswerSubmit = async (commentId: string) => {
        const content = newAnswer[commentId] || '';
        try {
            const response = await axios.post(`${backendUrl}/comments/create-comment`, { project: project.ID, content, uid, answering_to: commentId, photoUrl });
            const commentInfo = response.data.newComment;

            const c: MComment = {
                id: commentInfo._id,
                content: commentInfo.content,
                username: username as string,
                likes: commentInfo.likes,
                photoUrl: commentInfo.photoUrl,
                commentParent: commentInfo.commentParent,
                answering_to: commentInfo.answering_to,
                current_page: 1,
                total_pages: 1,
                createdAt: new Date().toISOString()
            }

            setComments([ ...comments, c ]);
            setNewAnswer(prev => ({ ...prev, [commentId]: '' }));
            toggleReplyField(commentId, false);
            toggleShowReplies(commentId)
        } catch (error) {
            console.error('There was an error:', error);
        }
    };
    



    const toggleReplyField = (commentId: string, show: boolean) => {
        setReplyField(prev => ({ ...prev, [commentId]: show }));
    };
    
    const toggleShowReplies = (commentId: string) => {
        setShowReplies(prev => {
            const show = prev[commentId] === true ? true : true
            return { ...prev, [commentId]: show }
        });
    };




    const handleCloseDialog = () => {
        setCommentToDelete('')
        setOpenDialog(false); 
    };

    const handleDeleteComment = async() => {
        setOpenDialog(false)
        try {           
            const { data: { message } } = await axios.put(`${backendUrl}/comments/delete-comment/${commentToDelete}`)
            console.log('Mensaje de respuesta:', message)
            setComments(prev => prev.filter(comment => comment.id !== commentToDelete))
            setCommentToDelete('')
            
        } catch (error) {
            console.error('Error al eliminar el comentario:', error);
            setCommentToDelete('')   
        }  
    };

    const handleLoadMore = async () => {
        if (hasMoreComments) {
            fetchComments( currentPage, false );
        }
    };

    const getAccurateDate = (date: string) => {
        return (
            <Typography component="span" style={{ color: 'gray', fontSize: '10px' }}>
                { date }
            </Typography>
        )

    };

    const findOriginalCommentUsername = (commentId: string) => {
        const comment = comments.find(comment => comment.id === commentId);
    
        if( comment ) {
            return ( <Typography component="span" style={{ color: 'blue', fontSize: '13px' }}>@{comment.username} </Typography> );
        } else {
            return ( <Typography component="span" style={{ color: 'red', fontSize: '13px' }}>@deleted</Typography> );
        }                   
    };

    const renderComments = (comments: MComment[]) => {
  
        const renderShowButtonReplies = (commentId: string, style: React.CSSProperties = {}) => {
            if (comments.find(comment => comment.commentParent === commentId)) {
                return (
                    <Button 
                        sx={{ marginLeft: 5 }}
                        style={style} 
                        onClick={() => setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }) )}
                    >
                        {showReplies[commentId] ? 'Hide' : 'Show'} Replies
                    </Button>
                );
            }           
            return null;
        };
        
        const renderCommentsLikesDislikes = (commentId: string, style: React.CSSProperties = {}) => {
            const myLike = likes.filter(like => like.commentId === commentId && like.uid === uid && like.isLike === true).length > 0
            const commentLikes = likes.filter(like => like.commentId === commentId && like.isLike === true).length

            return (
                <Box sx={{ marginRight: 1, display: 'flex', alignItems: 'center', ...style } }> 
                    <IconButton onClick={() => handleLikeDislike(commentId)}>
                        <ThumbUpAltIcon sx={{ width: 20, height: 20 }}  color={myLike ? 'primary' : 'inherit'} />
                    </IconButton>
                    <span>{commentLikes}</span>
                </Box>
            );
        };

        const renderCommentsReplies = (commentId: string, current_page: number, total_pages: number ) => {
            return (
                <List dense>
                    {comments.filter(comment => comment.commentParent === commentId).map(comment => (
                        <Fragment key={comment.id}>
                            <ListItem >

                            <ListItemAvatar sx={{ marginRight: '15px !important', minWidth: '30px !important' }}>
                                <Avatar sx={{ width: 30, height: 30 }}  alt={ comment.username }  src={ comment.photoUrl || comment.username } />
                            </ListItemAvatar>

                            <ListItemText 
                                primary={
                                    <Fragment>                                       
                                        {comment.username} {getAccurateDate(comment.createdAt)}                                                                  
                                    </Fragment>
                                } 
                                secondary={
                                    <Fragment>
                                        {comment.commentParent ? (
                                            <span>
                                                {findOriginalCommentUsername(comment.answering_to !== null ? comment.answering_to : comment.commentParent)} 
                                                : <span className='text-black'>{comment.content}</span>
                                                
                                            </span>
                                        ) : (
                                            <span style={{ fontWeight: 'bold' }}>
                                                {comment.content}
                                            </span>
                                        )}
                                    </Fragment>
                                }
                                primaryTypographyProps={{ style: { fontSize: '13px' } }} // Cambia el tamaño de fuente del texto primario
                                secondaryTypographyProps={{ style: { fontSize: '13px' } }} // Cambia el tamaño de fuente del texto secundario
                                />
                                
                                <IconButton onClick={() => toggleReplyField(comment.id, !replyField[comment.id])}>
                                    <ReplyIcon sx={{fontSize: '1.2rem'}} />
                                </IconButton>

                                {renderCommentsLikesDislikes(comment.id, { fontSize: '0.75rem' })}   

                                {
                                    moreOption === comment.id && (
                                        <IconButton onClick={() => {
                                            setCommentToDelete(comment.id)
                                            setOpenDialog(true)}
                                            } >
                                            <DeleteIcon sx={{ width: 20, height: 20 }} />
                                        </IconButton>
                                    )
                                }

                                <Dialog 
                                    open={openDialog} 
                                    onClose={handleCloseDialog}
                                    PaperProps={{ 
                                        style: { 
                                        boxShadow: 'none',
                                        border: '1px solid #ccc', // Define un borde sólido, ligero y sutil
                                        borderRadius: '4px' // Opcional: Añade un ligero borde redondeado
                                        } 
                                    }}
                                    componentsProps={{
                                        backdrop: { style: { backgroundColor: 'transparent' } },
                                    }}
                                >
                                    <DialogTitle>Confirm Comment Deletion</DialogTitle>
                                    <DialogContent>
                                        Are you sure you want to delete this comment?                                         
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseDialog}>Cancel</Button>
                                        <Button onClick={handleDeleteComment} autoFocus>
                                            Confirm
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                
                                {
                                        tierS(uid as string, currentProject) 
                                    ||
                                        tierA(uid as string, currentProject)
                                    ? (
                                        <IconButton onClick={() => setMoreOption( prev => prev === comment.id ? '' : comment.id )}>
                                            <MoreVertIcon  sx={{ width: 18, height: 18 }}  />
                                        </IconButton>   
                                        )
                                    : null
                                }
                                           
                                
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            {replyField[comment.id] && (
                                <ListItem sx={{ pl: 4 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Write a reply..."
                                        variant="outlined"
                                        value={newAnswer[comment.id] || ''}
                                        onChange={e => setNewAnswer({[comment.id]: e.target.value })}
                                        sx={{ mr: 2 }}
                                    />
                                    <ListItemSecondaryAction>
                                        <Button  variant="contained" color="secondary" onClick={() => handleAnswerSubmit(comment.id)} endIcon={<ReplyIcon />}>
                                            Reply
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                        </Fragment>
                    ))}


                    {
                        errorWhileFetching && ( 
                            <p className='text-red-500 text-[12px] mt-2 ml-[5%]'>
                                {errorMessage}
                            </p>
                        )
                    }

                    {
                        current_page !== null && total_pages > 1 && current_page !== total_pages && (
                            <button 
                                className="w-[150px] my-2 ml-5 rounded-extra hover:text-blue-400 transition-colors duration-300 p-2 text-sm"  
                                onClick={() => fetchMoreReplies(commentId, current_page)}
                            >  
                                Load more
                            </button>
                        )
                    }
                </List>
            );
        }

        return (
            <List dense >
                {comments.filter( comment => comment.commentParent === null ).map(comment => (
                    <div key={comment.id} className='w-[96%] mx-auto' >
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar alt={ comment.username } src={ comment.photoUrl || comment.username } />
                            </ListItemAvatar>

                            <ListItemText 
                                primary={
                                    <Fragment>
                                        {comment.username} {getAccurateDate(comment.createdAt)}                          
                                    </Fragment>
                                }   
                                secondary={
                                    <span>
                                        {comment.commentParent ? `@${findOriginalCommentUsername(comment.commentParent)}: ` : ''}
                                        <span className='text-black'>
                                            {comment.content}
                                        </span>
                                    </span>
                                }
                                primaryTypographyProps={{ style: { whiteSpace: 'normal', wordWrap: 'break-word' } }}
                                secondaryTypographyProps={{ style: { whiteSpace: 'normal', wordWrap: 'break-word' } }}
                            />


                           {renderShowButtonReplies(comment.id, { fontSize: '0.80rem' })}

                            <IconButton sx={{ marginLeft: 1 }} onClick={() => toggleReplyField(comment.id, !replyField[comment.id])}>
                                <ReplyIcon sx={{ width: 20, height: 20 }} />
                            </IconButton>

                            {renderCommentsLikesDislikes(comment.id, { fontSize: '1rem' })}

                            {
                                moreOption === comment.id && (
                                    <IconButton onClick={() => {
                                        setCommentToDelete(comment.id)
                                        setOpenDialog(true)}
                                        } >
                                        <DeleteIcon sx={{ width: 20, height: 20 }} />
                                    </IconButton>
                                )
                            }

                            <Dialog 
                                open={openDialog} 
                                onClose={handleCloseDialog}
                                PaperProps={{ 
                                    style: { 
                                      boxShadow: 'none',
                                      border: '1px solid #ccc', // Define un borde sólido, ligero y sutil
                                      borderRadius: '4px' // Opcional: Añade un ligero borde redondeado
                                    } 
                                  }}
                                  componentsProps={{
                                    backdrop: { style: { backgroundColor: 'transparent' } },
                                  }}
                            >
                                <DialogTitle>Confirm Comment Deletion</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this comment?                                         
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog}>Cancel</Button>
                                    <Button onClick={handleDeleteComment} autoFocus>
                                        Confirm
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            {
                                    tierS(uid as string, currentProject) 
                                ||
                                    tierA(uid as string, currentProject)
                                ? (
                                    <IconButton onClick={() => setMoreOption( prev => prev === comment.id ? '' : comment.id )}>
                                        <MoreVertIcon  sx={{ width: 20, height: 20 }}  />
                                    </IconButton>   
                                    )
                                : null
                            }

                        </ListItem>

                        <Divider variant="inset" component="li" />
                            {replyField[comment.id] && (
                                <ListItem sx={{ pl: 4 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Write a reply..."
                                        variant="outlined"
                                        value={newAnswer[comment.id] || ''}
                                        onChange={e => setNewAnswer({[comment.id]: e.target.value })}
                                        sx={{ mr: 2 }}
                                    />
                                    <ListItemSecondaryAction>
                                        <Button variant="contained" color="info" onClick={() => handleAnswerSubmit(comment.id)} endIcon={<ReplyIcon />}>
                                            Reply
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}

                        {showReplies[comment.id] && (
                            <Box sx={{ ml: 2 }}>
                                {renderCommentsReplies(comment.id, comment.current_page, comment.total_pages)}
                            </Box>
                        )}
                    </div>
                ))}
            </List>
        );
    };

    useEffect(() => {
        fetchComments(currentPage, true);
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if( errorWhileFetching ) return (
        <div className='flex flex-col flex-grow items-center justify-center'>
            <h1 className='text-xl text-red-500'>{errorMessage}</h1>
            {
                errorType !== 'collaborator-validation' && errorType !== 'token-validation' ? (
                    <button
                    onClick={() => {
                        setErrorWhileFetching(false)
                        fetchComments(0, true)}
                    }
                    className='hover:text-blue-500 transition-colors duration-100'
                    >
                    Try Again
                    </button>
                ) : null
            }
        </div>
    )

    return (
        <div className='h-full w-full overflow-hidden'>
            {
                isLoading 
                ? ( 
                    <div className='flex h-full w-full items-center justify-center'>
                        <PuffLoader  color="#32174D" size={50} /> 
                    </div>                         
                )
                :
                <div className='flex flex-col h-full rounded-extra'>
                    {/* Comment input */}
                    <div className='flex flex-col space-x-2 pt-5 px-5 pb-1'>
                        <TextField
                            fullWidth
                            multiline
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={e => {
                                setShowButtons(e.target.value.length > 0 ? true : false)
                                setNewComment(e.target.value)}
                            }
                            sx={{ mr: 2 }}
                        />
                    
                        <div className={`flex opacity-0 ${ showButtons ? 'opacity-100' : 'opacity-0' } transition-opacity duraation-300 justify-end  pr-2 py-2 space-x-4`}>
                            <button 
                                onClick={ () => setNewComment('') }
                                className='w-[120px] hover:bg-red-200 transition-colors duration-300 rounded-extra border-[1px] border-gray-400 text-sm p-2'>
                                cancel
                            </button>
                            <button
                                onClick={handleCommentSubmit} 
                                className='w-[120px] backdrop-blur-sm bg-blue-300/20  shadow-sm hover:bg-blue-600/20 transition-colors duration-300 rounded-extra border-[1px] border-gray-400 text-sm p-2'>
                                post
                            </button>
                        </div>
                    </div>     

                    <div id='comments' ref={listRef} className='flex flex-col flex-grow max-h-[700px] overflow-y-auto px-2'>
                        {
                            noCommentsToFetch 
                            ? <div className='flex w-full h-full justify-center'>
                                <h1 className="text-xl mt-[20%] text-gray-400 mb-10">There are no comments yet, start the conversation!</h1> 
                                </div>                             
                            : 
                            <>
                                {renderComments(comments)}  

                                {hasMoreComments && (
                                    <button className="w-[150px] my-2 ml-5 rounded-extra hover:text-blue-400 transition-colors duration-300 p-2 text-sm"  onClick={handleLoadMore}>
                                        Load more
                                    </button>
                                )}
                            </>
                        }
                    </div>                                                     
                </div>
            }
        </div>
    );
};