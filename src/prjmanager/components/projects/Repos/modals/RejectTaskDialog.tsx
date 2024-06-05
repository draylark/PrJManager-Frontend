import { useState, memo } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField } from '@mui/material';


export const RejectTaskDialog = memo(({ open, onClose, onSubmit }) => {
    const [reasonsTextField, setReasonsTextField] = useState('');
  
    return (
        <Dialog open={open}>
          <DialogTitle>Provide at least one reason to reject the task</DialogTitle>
          <DialogContent>
            <div className='p-4'>
              <TextField
                size="small"
                label="Reason"
                variant="outlined"
                value={reasonsTextField}
                onChange={(e) => setReasonsTextField(e.target.value)}
                fullWidth
                multiline
                rows={4}
                placeholder="Provide at least one reason to reject the task"
              />
            </div>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              onClose()
              setReasonsTextField('')
            }}>Cancel</Button>
            <Button onClick={() => onSubmit(reasonsTextField)} disabled={reasonsTextField.length === 0}>Send</Button>
          </DialogActions>
        </Dialog>  
    );
  });