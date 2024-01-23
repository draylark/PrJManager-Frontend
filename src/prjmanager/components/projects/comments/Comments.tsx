import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, Divider, Box, Typography, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import LoadingCircle from '../../../../auth/helpers/Loading';

interface Comment {
    id: number;
    content: string;
    username: string;
    avatar: string;
    answers: Comment[];
    likes: number;
    dislikes: number;
}

export const Comments = () => {

    const [isLoading, setisLoading] = useState(false)
    const { uid, username } = useSelector((state: RootState) => state.auth);

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [newAnswer, setNewAnswer] = useState<{ [key: number]: string }>({});
    const [replyField, setReplyField] = useState<{ [key: number]: boolean }>({});
    const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});
    const [likes, setLikes] = useState([])

    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreComments, setHasMoreComments] = useState(true);

    const location = useLocation();
    const project = location.state?.projectId;

    const handleCommentSubmit = async() => {

        const response = await axios.post('http://localhost:3000/api/comments/create-comment', { project, content: newComment, uid })
        const commentInfo = response.data.newComment

        const avatar = "url-to-avatar";

        const comment: Comment = {
            id: commentInfo._id, // Mejor usar un ID único
            content: commentInfo.content,
            username,
            avatar,
            answers: [],
            likes: commentInfo.likes,
            dislikes: commentInfo.dislikes,
            comment: commentInfo.comment
        };
        setComments([...comments, comment]);
        setNewComment('');
    };


    const handleLoadMore = async () => {
        if (hasMoreComments) {
            setCurrentPage(prev => prev + 1);
        }
    };

    useEffect(() => {

        setisLoading(true);

        const fetchComments = async () => {
            const fetchCommentWithUser = async (comments) => {
                const idk = await Promise.all( comments.map( async (comment) => {
                    const userResponse = await axios.get(`http://localhost:3000/api/users/${comment.createdBy}`);
                    const user = userResponse.data.user;
                
                    return {
                        id: comment._id,
                        content: comment.content,
                        username: user.username,
                        avatar: "url-to-avatar", // Suponiendo que tienes la URL del avatar en los datos del usuario
                        likes: comment.likes,
                        dislikes: comment.dislikes,
                        comment: comment.comment 
                    };           
                }))

                return idk
            };


            const processReplies = async (commentsFromServer) => {

                const repliesResponses = await Promise.all(commentsFromServer.map(comment => 
                    axios.get(`http://localhost:3000/api/comments/get-replies/${comment._id}`)
                ));
                const allReplies = repliesResponses.map(response => response.data.replies).flat();

                const processedReplies = await fetchCommentWithUser(allReplies)
                setComments(prev => {
                    const newComments = processedReplies.filter(comment => !prev.find(c => c.id === comment.id));
                    return [...prev, ...newComments];      
                }); 

            }

            const processComments = async () => {

                const response = await axios.get(`http://localhost:3000/api/comments/get-comments/${project}?page=${currentPage}`);
                const commentsFromServer = response.data.comments;
                const totalComments = response.data.total;
                const filteredComments = commentsFromServer.filter(comment => comment.comment === null)
                const processedComments = await fetchCommentWithUser(filteredComments);  

                console.log(response)

                if( totalComments === comments.length ) {
                    setHasMoreComments(false);
                } else {
                    setHasMoreComments(true);
                }

                setComments(prev => {
                    const newComments = processedComments.filter(comment => !prev.find(c => c.id === comment.id));
                    return [...prev, ...newComments];      
                }); 

                processReplies(commentsFromServer)

                setTimeout(() => {
                    setisLoading(false);
                }, 2000);
                
            };

           processComments();
        };
        fetchComments();
    }, [project, currentPage])

    // Función recursiva para renderizar comentarios y sus respuestas
    const renderComments = (comments: Comment[], parentId: number | null = null) => {
  
        const renderShowButtonReplies = (commentId: number, style: React.CSSProperties = {}) => {
            if (comments.find(comment => comment.comment === commentId)) {
                return (
                    <Button 
                        style={style} // Aplicar los estilos adicionales
                        onClick={() => toggleShowReplies(commentId)}
                    >
                        {showReplies[commentId] ? 'Hide' : 'Show'} Replies
                    </Button>
                );
            }
            return null;
        };
        
        const renderCommentsLikesDislikes = (commentId: number, style: React.CSSProperties = {}) => {
            const like = likes.filter(like => like.commentId === commentId && like.uid === uid && like.type === 'like').length;
            const dislike = likes.filter(like => like.commentId === commentId && like.uid === uid && like.type === 'dislike').length;
        
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', ...style }}> 
                    <IconButton onClick={() => handleLikeDislike(commentId, uid, 'like')}>
                        <ThumbUpAltIcon color={like ? 'primary' : 'inherit'} />
                    </IconButton>
                    <span>{like}</span>
                    <IconButton onClick={() => handleLikeDislike(commentId, uid, 'dislike')}>
                        <ThumbDownAltIcon color={dislike ? 'primary' : 'inherit'} />
                    </IconButton>
                    <span>{dislike}</span>
                </Box>
            );
        };


        const renderCommentsReplies = (commentId: number) => {
            return (
                <List dense>
                    {comments.filter(comment => comment.comment === commentId).map(comment => (
                        <React.Fragment key={comment.id}>
                            <ListItem >

                            <ListItemAvatar sx={{ marginRight: '15px !important', minWidth: '30px !important' }}>
                                <Avatar sx={{ width: 30, height: 30 }} src={comment.avatar} />
                            </ListItemAvatar>

                                <ListItemText 
                                    primary={comment.username}
                                    secondary={comment.comment ? `@${findOriginalCommentUsername(comment.comment)}: ${comment.content}` : comment.content}
                                    primaryTypographyProps={{ style: { fontSize: '13px' } }} // Cambia el tamaño de fuente del texto primario
                                    secondaryTypographyProps={{ style: { fontSize: '13px' } }} // Cambia el tamaño de fuente del texto secundario
                                />

                                <IconButton onClick={() => toggleReplyField(comment.id, !replyField[comment.id])}>
                                    <ReplyIcon sx={{fontSize: '1.2rem'}} />
                                </IconButton>

                                {renderShowButtonReplies(comment.id, { fontSize: '0.75rem' })}
                                {renderCommentsLikesDislikes(comment.id, { fontSize: '0.75rem' })}                       
                                
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
                                        onChange={e => setNewAnswer(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                        sx={{ mr: 2 }}
                                    />
                                    <ListItemSecondaryAction>
                                        <Button  variant="contained" color="secondary" onClick={() => handleAnswerSubmit(comment.id)} endIcon={<ReplyIcon />}>
                                            Reply
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                            {showReplies[comment.id] && (
                                <Box>
                                    {renderCommentsReplies(comment.id)}
                                </Box>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            );
        }

        return (
            <List dense>
                {comments.filter( comment => comment.comment === null ).map(comment => (
                    <React.Fragment key={comment.id}>
                        <ListItem>

                            <ListItemAvatar>
                                <Avatar src={comment.avatar} />
                            </ListItemAvatar>
                            {/* <ListItemText primary={comment.username} secondary={comment.content} /> */}
                            <ListItemText 
                                primary={comment.username} 
                                secondary={comment.comment ? `@${findOriginalCommentUsername(comment.comment)}: ${comment.content}` : comment.content} 
                            />

                            <IconButton onClick={() => toggleReplyField(comment.id, !replyField[comment.id])}>
                                <ReplyIcon />
                            </IconButton>

                            {renderShowButtonReplies(comment.id, { fontSize: '0.90rem' })}
                            {renderCommentsLikesDislikes(comment.id, { fontSize: '1rem' })}

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
                                    onChange={e => setNewAnswer(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                    sx={{ mr: 2 }}
                                />
                                <ListItemSecondaryAction>
                                    <Button variant="contained" color="secondary" onClick={() => handleAnswerSubmit(comment.id)} endIcon={<ReplyIcon />}>
                                        Reply
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )}
                        {showReplies[comment.id] && (
                            <Box sx={{ ml: 2 }}>
                                {renderCommentsReplies(comment.id)}
                            </Box>
                        )}
                    </React.Fragment>
                ))}
            </List>
        );
    };




    const handleAnswerSubmit = async (commentId: number) => {
        const content = newAnswer[commentId] || '';
        // Realizar la operación asíncrona para obtener la respuesta del servidor
        const response = await axios.post('http://localhost:3000/api/comments/create-comment', { project, content, uid, parentCommentId: commentId });
        const commentInfo = response.data.newComment;
    
        // Actualizar el estado con la nueva respuesta
        // const updatedComments = addReply(comments, commentId, commentInfo);

        const c: Comment = {
            id: commentInfo._id,
            content: commentInfo.content,
            username,
            avatar: "url-to-avatar",
            likes: commentInfo.likes,
            dislikes: commentInfo.dislikes,
            comment: commentInfo.comment
        }

        setComments([ ...comments, c ]);
        setNewAnswer(prev => ({ ...prev, [commentId]: '' }));
        toggleReplyField(commentId, false);
    };
    
    const toggleReplyField = (commentId: number, show: boolean) => {
        setReplyField(prev => ({ ...prev, [commentId]: show }));
    };

    const toggleShowReplies = (commentId: number) => {
        setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };


    const handleLikeDislike = async (commentId: number, isLike: boolean, type) => {
        const existingLike = likes.find(like => like.commentId === commentId && like.uid === uid);
    
        try {
            if (existingLike) {
                if (existingLike.type === type) {
                    // Si el like/dislike actual es del mismo tipo, eliminarlo
                    type = null;
                    await axios.post('http://localhost:3000/api/likes/', { commentId, uid, type });
                    setLikes(prev => prev.filter(like => like.commentId !== commentId || like.uid !== uid));
                } else {
                    // Cambiar el tipo de like/dislike
                    await axios.post('http://localhost:3000/api/likes/', { commentId, uid, type });
                    setLikes(prev => prev.map(like => like.commentId === commentId && like.uid === uid ? { ...like, type } : like));
                }
            } else {
                // Agregar un nuevo like/dislike
                await axios.post('http://localhost:3000/api/likes/', { commentId, uid, type });
                setLikes(prev => [...prev, { commentId, uid, type }]);
            }
        } catch (error) {
            console.error('Error al manejar like/dislike:', error);
        }
    };


    const findOriginalCommentUsername = (commentId) => {
        let queue = [...comments]; // Cola para mantener los comentarios a procesar
        while (queue.length > 0) {
            const currentComment = queue.shift(); // Obtiene y elimina el primer elemento de la cola
    
            if (currentComment.id === commentId) {
                return currentComment.username;
            }
    
            // Agrega las respuestas del comentario actual a la cola para procesarlas después
            if (currentComment.answers && currentComment.answers.length > 0) {
                queue = queue.concat(currentComment.answers);
            }
        }
    
        return null; // En caso de que no se encuentre el comentario original
    };


    return (
        <>
            {
                isLoading 
                ? ( 
                    
                    <div className='flex flex-col h-[90%] mb-20 items-center'>
                         <LoadingCircle /> 
                    </div>                  
                )
                : ( 
                    <div className='p-5 h-[90%] rounded-extra overflow-y-auto'>
                        <Typography variant="h5" gutterBottom>
                            Project Comments
                        </Typography>

                        {/* Comment input */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Write a comment..."
                                variant="outlined"
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                sx={{ mr: 2 }}
                            />
                            <Button variant="contained" color="primary" onClick={handleCommentSubmit} endIcon={<SendIcon />}>
                                Post
                            </Button>
                        </Box>

                       

                        {renderComments(comments)}  
                        
                        {hasMoreComments && (
                            <Button sx={{ mt: 4 }} variant="contained" color="primary" onClick={handleLoadMore}>
                                Load more
                            </Button>
                        )}
                         
                    </div>
                 )
            }
        </>
    );
};