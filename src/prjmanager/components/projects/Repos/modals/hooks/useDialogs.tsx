import { useState } from 'react'
import { TextField, Autocomplete, List, ListItem, ListItemText, Avatar, Typography, Chip,  Dialog, DialogTitle, DialogContent, DialogActions, InputLabel, Tooltip, MenuItem, Select, Button, FormControl, Accordion, AccordionSummary, AccordionDetails,  } from '@mui/material'
import { LiaQuestionCircleSolid } from "react-icons/lia";

export const useDialogs = ({ setFieldValue, values }) => {


    const [tooltipOpen, setTooltipOpen] = useState('');
    const [tooltipContent, setTooltipContent] = useState('');
    const [accessLevel, setAccessLevel] = useState('');


    const BranchTypeDialog = () => {
        return (
                <div>
                    qwqw
                </div>
        )
    }

    
    const handleMouseEnter = (text, type) => {
        setTooltipContent(text);
        setTooltipOpen(type);
      };
  
      const handleMouseLeave = () => {
        setTooltipOpen('');
      };




    const AccesslevelDialog = ({ openDialog, setOpenDialog, setEditingCollaborator, editingCollaborator, 
        setSelectedUser, editCollaboratorNewAccessLevel, addUserAsCollaborator }) => {

        return (
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Set Access Level</DialogTitle>
                <DialogContent>
                <Select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    fullWidth
                >                                                                     
                    <MenuItem value="contributor">
                    <div className='flex flex-grow justify-between'>
                        <Typography>Contributor</Typography>
                        <Tooltip 
                        title={tooltipContent} 
                        open={tooltipOpen === 'contributor'} 
                        arrow={true} 
                        placement="right" 
                        enterTouchDelay={50} 
                        leaveTouchDelay={400} 
                        leaveDelay={200} 
                        enterDelay={100}
                        >   
                        <div 
                            onMouseEnter={() => handleMouseEnter('The Contributor can view open repositories on the layer and contribute new content or comments.', 'contributor')} 
                            onMouseLeave={handleMouseLeave}
                        >
                            <LiaQuestionCircleSolid />
                        </div>
                        </Tooltip> 
                    </div>
                    </MenuItem>                                       

                    <MenuItem value="coordinator">
                    <div className='flex flex-grow justify-between'>
                        <Typography>Coordinator</Typography>
                        <Tooltip 
                        title={tooltipContent} 
                        open={tooltipOpen === 'coordinator'} 
                        arrow={true} 
                        placement="right" 
                        enterTouchDelay={50} 
                        leaveTouchDelay={400} 
                        leaveDelay={200} 
                        enterDelay={100}
                        >   
                        <div 
                            onMouseEnter={() => handleMouseEnter('The Coordinator can manage contributions, approve changes and coordinate activities within the layer. This role allows adding new collaborators with the role of contributors and access to open and internal repositories with editor access level in the layer.', 'coordinator')} 
                            onMouseLeave={handleMouseLeave}
                        >
                            <LiaQuestionCircleSolid />
                        </div>
                        </Tooltip> 
                    </div>
                    </MenuItem>

                    <MenuItem value="administrator">
                    <div className='flex flex-grow justify-between'>
                        <Typography>Administrator</Typography>
                        <Tooltip 
                        title={tooltipContent} 
                        open={tooltipOpen === 'administrator'} 
                        arrow={true} 
                        placement="right" 
                        enterTouchDelay={50} 
                        leaveTouchDelay={400} 
                        leaveDelay={200} 
                        enterDelay={100}
                        >   
                        <div 
                            onMouseEnter={() => handleMouseEnter('The Administrator has full control over the layer and its repositories with administrator level access to them, including the ability to modify settings, manage all aspects and collaborators.', 'administrator')} 
                            onMouseLeave={handleMouseLeave}
                        >
                            <LiaQuestionCircleSolid />
                        </div>
                        </Tooltip> 
                    </div>
                    </MenuItem>
                </Select>
                </DialogContent>
                <DialogActions>
                <Button 
                    onClick={() => {
                    setOpenDialog(false)
                    setEditingCollaborator(false)
                    setSelectedUser(
                    {
                        id: '',
                        name: '',
                        accessLevel: ''                                                  
                    }
                    )}}                            
                    >
                    Cancel
                    </Button>
                    <Button 
                        disabled={!accessLevel} 
                        onClick={() =>{
                        editingCollaborator 
                        ? editCollaboratorNewAccessLevel( values, setFieldValue )                                                       
                        : addUserAsCollaborator( values, setFieldValue )                                                   
                        }}
                    >
                    Ok
                    </Button>            
                </DialogActions>
            </Dialog>

        )
    }


  return {
    AccesslevelDialog,
    BranchTypeDialog,

    accessLevel


  }
}
