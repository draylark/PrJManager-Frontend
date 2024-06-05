import axios from 'axios';
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../../store/store';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useFetchComments = () => {

    const location = useLocation();
    const project = location.state?.project;

    const [isLoading, setisLoading] = useState(false);
    const { uid } = useSelector((state: RootState) => state.auth);

    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const [noCommentsToFetch, setNoCommentsToFetch] = useState(false)
    const [comments, setComments] = useState<Comment[]>([]);
    const [likes, setLikes] = useState([]);

    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [moreCommentsLoaded, setMoreCommentsLoaded] = useState(false);

    
    const [errorType, setErrorType] = useState(null)   
    const [errorMessage, seterrorMessage] = useState(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);


        
    const handleLikeDislike = async (commentId: number) => {
        const existingLike = likes.find(like => like.commentId === commentId && like.uid === uid);
    
        try {
            if (existingLike) {
                if (existingLike.isLike === true) {
                    // Si el like/dislike actual es del mismo tipo, eliminarlo
                    const resp = await axios.put(`${backendUrl}/likes/${commentId}`, { commentId, uid, isLike: false });
                    setLikes(prev => prev.filter(like => like.commentId !== commentId || like.uid !== uid));
                }
            } else {
                // Agregar un nuevo like/dislike
                const resp = await axios.post(`${backendUrl}/likes/${commentId}`, { uid, isLike: true });              
                setLikes(prev => [...prev, { commentId, uid, isLike: true }]);
            }
        } catch (error) {
            console.error('There was an error', error);
        }
    };

    const fetchCommentsLikes = async ( comments ) => {       
        return ( await Promise.all(comments.map(async (comment) => {
                try {
                    const { data: { like } } = await axios.get(`${backendUrl}/likes/${comment._id}/${uid}`);
                    return like ? like : null; // Retorna el like si existe, de lo contrario retorna null
                } catch (error) {
                    console.error('Error fetching likes:', error);
                    return null; // También retorna null en caso de error
                }
        }))).filter(like => like !== null); // Filtra los elementos null, manteniendo solo los likes existentes      
    };

    const fetchCommentWithUser = async (comments) => {  
        return await Promise.all( comments.map( async (comment) => {
            try {
                const { data: { user } } = await axios.get(`${backendUrl}/users/${comment.createdBy}`);
                return {
                    id: comment._id,
                    content: comment.content,
                    username: user.username,
                    photoUrl: user?.photoUrl || null, // Suponiendo que tienes la URL del avatar en los datos del usuario
                    likes: comment.likes,
                    commentParent: comment.commentParent,
                    answering_to: comment.answering_to,
                    current_page: comment.total_pages > 0 ? 1 : null,
                    total_pages: comment.total_pages,   
                    createdAt: comment.createdAt       
                };   
            } catch (error) {
                console.error('Error fetching user:', error);
                return null;
            }
        }))
    };

    const fetchMoreReplies = async (commentId, currentPage) => {
        try {
            const { data: { replies, total_pages: totalPages, current_page: currentPageS, totalReplies } } = await axios.get(`${backendUrl}/comments/get-replies/${commentId}?page=${currentPage}`);          
            const processedReplies = await fetchCommentWithUser(replies.flat());
            console.log(totalReplies)
            setComments(prev => {
                const updatedComments = prev.map(comment => {
                    if (comment.id === commentId) {
                        const { current_page, total_pages, ...rest } = comment
                        return {
                            ...rest,
                            current_page: currentPageS, 
                            total_pages: totalPages,
                        };
                    }
                    return comment;
                });

                const newReplies = processedReplies.filter(reply => !prev.some(c => c.id === reply.id));
                return [...updatedComments, ...newReplies];
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
            setErrorType(error.response.data.type || 'Error')
            seterrorMessage(error.response.data.message || 'An error occurred while fetching data');
            setErrorWhileFetching(true)
        }
    };

    const fetchReplies = async (commentsFromServer) => {
        await Promise.all(commentsFromServer.map( async comment => { 
            try {
                const { data: { replies } } = await axios.get(`${backendUrl}/comments/get-replies/${comment._id}?page=${currentPage}`);
                const allReplies = replies.flat();           
                const processedReplies = await fetchCommentWithUser(allReplies);
                const l = await fetchCommentsLikes(allReplies);

                setComments(prev => {
                    const newComments = processedReplies.filter(comment => !prev.find(c => c.id === comment.id));
                    return [...prev, ...newComments];  
                })

                setLikes( prev => {
                    const newLikes = l.filter(like => !prev.find(l => l.commentId === like.commentId));
                    return [...prev, ...newLikes];           
                })
            } catch (error) {
                console.error('Error fetching replies:', error);
                setErrorType(error.response.data.type || 'Error')
                seterrorMessage(error.response.data.message || 'An error occurred while fetching data');
                setErrorWhileFetching(true)         
            }
        }));
    };

    const fetchComments = async (currentPage, fetchOne) => {
        try {
            fetchOne ? setisLoading(true) : null

            const { data: { comments: commentsFromServer, current_page, total_pages }} = await axios.get(`${backendUrl}/comments/get-comments/${project.ID}?page=${currentPage}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('x-token')
                }
            });

            if (commentsFromServer.length === 0) {
                setisLoading(false);
                setNoCommentsToFetch(true);
                setHasMoreComments(false);
                return;
            }

            const processedComments = await fetchCommentWithUser(commentsFromServer.filter(comment => comment.commentParent === null));        
                                      await fetchReplies(commentsFromServer.filter( comment => comment.replies > 0 ))
            const l = await fetchCommentsLikes(commentsFromServer)

            setComments(prev => {
                const newComments = processedComments.filter(comment => !prev.find(c => c.id === comment.id));
                return [ ...prev, ...newComments ];      
            }); 

            setLikes(  prev => {
                const newLikes = l.filter(like => !prev.find(l => l.commentId === like.commentId));
                return [...prev, ...newLikes];           
            })
            

            setCurrentPage(current_page)           
            setTotalPages(total_pages)
            
        } catch (error) {       
            console.error('Error fetching comments:', error);
            setErrorType(error.response.data.type || 'Error');
            seterrorMessage(error.response.data.message || 'An error occurred while fetching data');
            setErrorWhileFetching(true)
        } finally {
            setisLoading(false) 
        }           
    };

    useEffect(() => {
        if( totalPages === 0 ) {
            setHasMoreComments(false);
        } else if (currentPage === totalPages) {
            setHasMoreComments(false);
        } else {
            setHasMoreComments(true);
        }
    }, [ currentPage, totalPages ])


  return {
    setMoreCommentsLoaded,
    setComments,
    setLikes,
    setNoCommentsToFetch,


    handleLikeDislike,
    fetchComments,
    fetchReplies,
    fetchCommentWithUser,
    fetchCommentsLikes,
    fetchMoreReplies,

    isLoading,
    currentPage,
    totalPages,
    hasMoreComments,
    moreCommentsLoaded,
    comments,
    likes,
    noCommentsToFetch,

    errorMessage,
    errorWhileFetching,
    setErrorWhileFetching,
    errorType
  
  }
}
