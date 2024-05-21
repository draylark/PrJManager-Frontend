import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

const TaskNotesDialog = ({ open, setOpen, notes, setNotes, handleParticipation }) => {
    const [currentNote, setCurrentNote] = useState("");

    const handleAddNote = (event) => {
        if (event.key === 'Enter' && currentNote.trim()) {
            event.preventDefault();
            setNotes(prevNotes => { return [ ...prevNotes, currentNote ] });  
            setCurrentNote("");
        }
    };

    const handleDeleteNote = (noteToDelete) => {
        setNotes(prevNotes => {
            return prevNotes.filter(note => note !== noteToDelete);
        });
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"About your contributions"}</DialogTitle>
            <DialogContent>
                <div className='flex flex-col space-y-7'>
                    <DialogContentText id="alert-dialog-description">
                        Add a few notes about your contributions:
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="New Note"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                        onKeyPress={handleAddNote}
                    />
                    
                    <div className='flex flex-wrap max-h-[100px] overflow-y-auto'>        
                        {notes.map((note, index) => (
                            <Tooltip 
                                title={note} 
                                key={index}
                                placement="top"    
                            >
                                <Chip
                                    key={index}
                                    label={truncateText(note, 30)}
                                    onDelete={() => handleDeleteNote(note)}
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        maxWidth: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        marginLeft: 1,
                                        marginBottom: 1
                                    }}
                                />
                            </Tooltip>
                        ))} 
                    </div>
                </div>       
            </DialogContent>
            <DialogActions>
                <div className="flex justify-center w-full pb-4">
                    <button onClick={() => {
                        setOpen(false)
                        handleParticipation()
                    }} className='glassi text-black p-2 rounded w-[90%] border-[1px] border-gray-400'>
                        Continue
                    </button>
                </div>

            </DialogActions>
        </Dialog>
    );
}

export default TaskNotesDialog;
