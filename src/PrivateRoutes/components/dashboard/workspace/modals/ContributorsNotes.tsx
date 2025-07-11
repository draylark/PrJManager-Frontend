 import { ImCancelCircle } from 'react-icons/im';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { ScaleLoader } from 'react-spinners';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Swal from 'sweetalert2';
import { getInitialsAvatar } from '../../../projects/helpers/helpers';


interface TaskNote {
    _id: string;
    uid: { username: string; photoUrl: string; uid: string },
    task: string;
    text: string;
    createdAt: string;
    updatedAt: string
}
interface ContributorsNotesProps {
    setIsNotesOpen: (isOpen: boolean) => void;
    isNotesOpen: boolean;
    taskNotes: TaskNote[];
    uid?: string;
    setTaskNotes: (notes: TaskNote[]) => void;
}
interface NoteModalProps {
    note: TaskNote;
    isOpen: boolean;
    onSave: (editedNote: EditedNote) => void;
    onDelete: (noteId: string) => void;
    onClose: () => void;
}

type EditedNote = { noteId: string, text: string };
type GroupedNotes = Record<string, { userInfo: { username: string; photoUrl: string }; notes: TaskNote[] }>;



export const ContributorsNotes: React.FC<ContributorsNotesProps> = ({ setIsNotesOpen, isNotesOpen, taskNotes, setTaskNotes }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [groupedNotes, setGroupedNotes] = useState<GroupedNotes>({});    
    const [selectedNote, setSelectedNote] = useState<TaskNote | null>(null);
    
    const groupNotesByUser = (notes: TaskNote[]) => {
        return notes.reduce<GroupedNotes>((acc, note) => {
            const key = note.uid.uid; // Asumiendo que uid es un objeto con más datos dentro
            if (!acc[key]) {
                acc[key] = {
                    userInfo: { username: note.uid.username, photoUrl: note.uid.photoUrl },
                    notes: []
                };
            }
            acc[key].notes.push(note);
            return acc;
        }, {});
    };

    const handleNoteClick = (note: TaskNote) => {
        setSelectedNote(note);
        setNoteModalOpen(true);
    };

    const closeNoteModal = () => {
        setNoteModalOpen(false);
        setSelectedNote(null);
    };

    const NoteModal = ({ note, isOpen, onSave, onDelete, onClose }: NoteModalProps) => {
        const [ editedNote, setEditedNote ] = useState(note.text)
        
        return (       
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'flex' : 'hidden'} justify-center items-center`}>
                <div className="flex flex-col bg-white p-4 rounded-lg w-2/3 min-h-[235px] max-h-[235px]">
                    {
                        isLoading ? (
                            <div className="flex flex-grow justify-center items-center">
                                <ScaleLoader color="#2563EB" loading={isLoading} height={35} width={4} radius={2} margin={2} />
                            </div>
                        )
                        : 
                        <>    
                            <div className='flex justify-between w-full px-2'>
                                <h3 className="text-lg font-bold mb-2">Edit Note</h3>
                                <button onClick={onClose} className='hover:text-red-500 transition-colors duration-300'>
                                    <ImCancelCircle size={18} />
                                </button>
                            </div>
                            
                            <textarea
                                className="w-full p-2 border rounded focus:outline-none focus:shadow-outline"
                                rows={4}
                                value={editedNote}
                                onChange={(e) => setEditedNote(e.target.value)}
                            />
                            <div className="flex justify-between mt-4">
                                <button onClick={() => onDelete(note._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                                <button onClick={() => onSave({ noteId: note._id, text: editedNote })} className="bg-gray-300 p-2 rounded">Save</button>
                            </div>               
                        </>
                    }
                </div>
            </div>       
        )
    };

    const handleEditedNote = (editedNote: EditedNote) => {
        setIsLoading(true)
        axios.put(`${backendUrl}/tasks/update-note/${editedNote.noteId}`, { text: editedNote.text })
        .then((res) => {
           console.log(res)
            Swal.fire({
                title: 'Note Updated',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            // Actualizar las notas en el estado
            const updatedNotes = taskNotes.map(note => note._id === editedNote.noteId ? { ...note, text: editedNote.text } : note);
            setTaskNotes(updatedNotes);
            setGroupedNotes(groupNotesByUser(updatedNotes));
            closeNoteModal();
            setIsLoading(false)
        })
        .catch((error) => {
            console.error(error);
            closeNoteModal();
            setIsLoading(false)
            Swal.fire({
                title: 'Error updating note',
                text: 'There was an error updating the note. Please try again later.',
                icon: 'error'
            });
        });
    };

    const handleDeleteNote = (noteId: string) => {
        setIsLoading(true)
        axios.delete(`${backendUrl}/tasks/delete-note/${noteId}`)
        .then((res) => {
            console.log(res)
            Swal.fire({
                title: 'Note Deleted',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            // Actualizar las notas en el estado
            const updatedNotes = taskNotes.filter(note => note._id !== noteId);
            setTaskNotes(updatedNotes);
            setGroupedNotes(groupNotesByUser(updatedNotes));
            setIsLoading(false)
            closeNoteModal();
        })
        .catch((error) => {
            console.error(error);
            closeNoteModal();
            setIsLoading(false)
            Swal.fire({
                title: 'Error deleting note',
                text: 'There was an error deleting the note. Please try again later.',
                icon: 'error'
            });
        });
    };

    const handleClose = () => {
        const modal = document.getElementById('notesModal');
        if (modal) {
            modal.classList.replace('opacity-100', 'opacity-0');
            setTimeout(() => {
                setIsNotesOpen(false);
            }, 300);  // Hacer la transición un poco más rápida
        }
    };


    useEffect(() => {
        if (taskNotes) {
            setGroupedNotes(groupNotesByUser(taskNotes));
        }
    }, [taskNotes]);

    useEffect(() => {
        if (isNotesOpen) {
            setTimeout(() => {
                document.getElementById('notesModal')?.classList.add('opacity-100');
            }, 20);
        }
    }, [isNotesOpen]);

    return (
        <div className='fixed flex w-screen h-full pb-5 top-0 right-0 justify-center items-center bg-black/30 z-50 transition-opacity duration-500 ease-in-out'>
            <div id="notesModal"
                className='bg-white glassi overflow-hidden flex flex-col w-[70%] md:w-[50%] md:max-h-[735px] md:min-h-[50%] rounded-2xl border-[1px] border-gray-400 transition-all duration-500 ease-in-out transform scale-95 opacity-0'
            >
                <div className='flex justify-between w-full p-5'>
                    <h2 className='text-xl font-semibold'>Contributors Notes</h2>
                    <button onClick={handleClose} className='text-xl p-1 hover:text-red-500 transition-colors duration-300'>
                        <ImCancelCircle size={22} />
                    </button>
                </div>
                <div className='flex flex-grow flex-col p-4 space-y-2 overflow-auto'>
                    {Object.values(groupedNotes).map((userNotes, index) => (
                            <div key={index} className="flex space-x-2 p-5 shadow bg-gray-100 rounded-lg">
                                <img src={userNotes.userInfo.photoUrl || getInitialsAvatar(userNotes.userInfo.username)} alt="avatar" className="w-10 h-10 rounded-full mt-2" />
                                <div className="flex flex-col space-y-2 ">
                                    {userNotes.notes.map((note, idx) => (
                                        <div key={idx} onClick={() => handleNoteClick(note)} className="cursor-pointer flex items-center space-x-2 p-2 m-2 bg-white rounded shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
                                            <p className="text-sm p-1">{note.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>

                {
                    noteModalOpen && (
                        <NoteModal
                            note={selectedNote as TaskNote}
                            isOpen={noteModalOpen}
                            onSave={handleEditedNote}
                            onDelete={handleDeleteNote}
                            onClose={closeNoteModal}
                        />

                    )
                }
            </div>
        </div>
    );
};
