import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../../../store/store';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { CommentBase } from '../../../../../interfaces/models/comment';
import { LikeBase } from '../../../../../interfaces/models/like';

export interface MComment {
    id: string;
    content: string;
    username: string;
    photoUrl: string | null;
    likes: number;
    commentParent: string | null;
    answering_to: string | null;
    current_page: number;
    total_pages: number;
    createdAt: string;
}
interface PopulatedComment extends Omit<CommentBase, 'createdBy'> {
    createdBy: {
        _id: string;
        username: string;
        photoUrl: string | null;
    }
}
interface CustomError extends AxiosError {
    response: AxiosResponse<{
        type: string;
        message: string;
    }> & {
        data: {
            type: string;
            message: string;
        };
    }
}

export const useFetchComments = () => {

    const location = useLocation();
    const project = location.state?.project;

    const [isLoading, setisLoading] = useState(false);
    const { uid } = useSelector((state: RootState) => state.auth);

    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const [noCommentsToFetch, setNoCommentsToFetch] = useState(false)
    const [comments, setComments] = useState<MComment[]>([]);
    const [likes, setLikes] = useState<LikeBase[] | []>([]);

    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [moreCommentsLoaded, setMoreCommentsLoaded] = useState(false);

    
    const [errorType, setErrorType] = useState<string | null>(null)   
    const [errorMessage, seterrorMessage] = useState<string | null>(null);
    const [errorWhileFetching, setErrorWhileFetching] = useState(false);


        
    const handleLikeDislike = async (commentId: string) => {
        const existingLike = likes.find(like => like.commentId === commentId && like.uid === uid);
    
        try {
            if (existingLike) {
                if (existingLike.isLike === true) {
                    // Si el like/dislike actual es del mismo tipo, eliminarlo
                     await axios.put(`${backendUrl}/likes/${commentId}`, { commentId, uid, isLike: false });
                    setLikes(prev => prev.filter(like => like.commentId !== commentId || like.uid !== uid));
                }
            } else {
                // Agregar un nuevo like/dislike
                const { data: { savedLike } } = await axios.post(`${backendUrl}/likes/${commentId}`, { uid, isLike: true });      
                console.log('savedLike', savedLike)        
                setLikes(prev => [...prev, savedLike]);
            }
        } catch (error) {
            console.error('There was an error', error);
        }
    };

    const fetchCommentsLikes = async (comments: PopulatedComment[]): Promise<LikeBase[]> => {
        const results = await Promise.all(
            comments.flatMap(async (comment) => {
                try {
                    const { data: { likes } } = await axios.get(`${backendUrl}/likes/${comment._id}`);
                    return likes || []; // Asegúrate de que siempre devuelvas un array
                } catch (error) {
                    console.error('Error fetching likes:', error);
                    return []; // Retorna un arreglo vacío en caso de error
                }
            })
        );
    
        // Utiliza .flat() para aplanar el array completamente si cada like es un array de objetos
        return results.flat().filter(like => like !== null); // Filtra los elementos null
    };
    
    const setCommentWithUser = async (comments: PopulatedComment[]): Promise<MComment[]> => {  
        return await Promise.all( comments.map( async (comment) => {
            return {
                id: comment._id,
                content: comment.content,
                username: comment.createdBy.username,
                photoUrl: comment.createdBy.photoUrl || null, // Suponiendo que tienes la URL del avatar en los datos del usuario
                likes: comment.likes,
                commentParent: comment.commentParent,
                answering_to: comment.answering_to,
                current_page: comment.total_pages > 0 ? 1 : 0,
                total_pages: comment.total_pages || 0,   
                createdAt: new Date(comment.createdAt).toISOString() // Convierte la cadena a Date antes de formatearla   
            };   
        }))
    };

    const fetchMoreReplies = async (commentId: string, currentPage: number) => {
        try {
            const { data: { replies, total_pages: totalPages, current_page: currentPageS } } = await axios.get(`${backendUrl}/comments/get-replies/${commentId}?page=${currentPage}`);          
            const processedReplies = await setCommentWithUser(replies.flat());
            setComments(prev => {
                const updatedComments = prev.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            current_page: currentPageS,
                            total_pages: totalPages
                        };
                    }
                    return comment;
                });
            
                const newReplies = processedReplies.filter(reply => !prev.some(c => c.id === reply.id));
                return [...updatedComments, ...newReplies];
            });
        } catch (error) {
            console.error('Error fetching replies:', error);
            const axiosError = error as CustomError;
            setErrorType(axiosError.response.data.type || 'Error')
            seterrorMessage(axiosError.response.data.message || 'An error occurred while fetching data');
            setErrorWhileFetching(true)
        }
    };

    const fetchReplies = async (commentsFromServer: PopulatedComment[]) => {
        await Promise.all(commentsFromServer.map( async (comment: PopulatedComment) => { 
            try {
                const { data: { replies } } = await axios.get(`${backendUrl}/comments/get-replies/${comment._id}?page=${currentPage}`);
                const allReplies = replies.flat();           
                const processedReplies = await setCommentWithUser(allReplies);
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
                const axiosError = error as CustomError;
                setErrorType(axiosError.response.data.type || 'Error')
                seterrorMessage(axiosError.response.data.message || 'An error occurred while fetching data');
                setErrorWhileFetching(true)         
            }
        }));
    };

    const fetchComments = async (currentPage: number, fetchOne: boolean) => {
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

            const processedComments = await setCommentWithUser(commentsFromServer.filter((comment: CommentBase) => comment.commentParent === null));        
                                      await fetchReplies(commentsFromServer.filter( (comment: CommentBase) => comment.replies > 0 ))
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
            const axiosError = error as CustomError;
            setErrorType(axiosError.response.data.type || 'Error')
            seterrorMessage(axiosError.response.data.message || 'An error occurred while fetching data');
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
    setCommentWithUser,
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
