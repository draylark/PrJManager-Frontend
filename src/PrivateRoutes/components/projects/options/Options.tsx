import React from 'react';
import { ProjectBase } from '../../../../interfaces/models';

interface OptionsProps {
    uid: string;
    project: ProjectBase;
    showOptModal: boolean;
    setIsProjectConfigFormOpen: (value: boolean) => void;
    setIsProjectCollaboratorsFormOpen: (value: boolean) => void;
}

export const Options: React.FC<OptionsProps> = ({ uid, project, showOptModal, setIsProjectConfigFormOpen, setIsProjectCollaboratorsFormOpen }) => {
    return (
        <div 
            className={`flex flex-col space-y-2 absolute z-50 bg-white border-[1px] border-black rounded-bl-2xl pb-2 w-[250px] top-[4.4rem] transition-all duration-500 ${showOptModal ? 'right-5' : '-right-[20rem]'}`}
        >
             <div className='flex w-full justify-center py-2'>
                <p className='text-[18px]'>Project Options</p>
             </div>

                <div className='flex flex-col  w-full items-center justify-center'>
                    {
                        project.owner.toString() === uid && ( 
                            <button 
                                onClick={ () => setIsProjectConfigFormOpen(true) }
                                className='w-[90%] border-b-[1px] border-gray-400 hover:bg-blue-200 transition-colors duration-150 py-4 px-4'
                            >
                                Project Configuration
                            </button>
                        )
                    }
                    <button 
                        onClick={ () => setIsProjectCollaboratorsFormOpen(true) }
                        className='w-[90%]  hover:bg-blue-200 transition-colors duration-150 py-4 px-4 rounded-bl-2xl'
                    >
                        Project Collaborators
                    </button>
                </div>
        </div>
    );
};
