import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { RootState } from '../../../../../store/store'
import { Formik, Form } from 'formik'
import { ProjectField } from './ProjectField'
import { addTopProject } from '../../../../../store/projects/projectSlice'

export const TopProjects = ({ isModalOpen, setIsModalOpen }) => {

    const dispatch = useDispatch();
    const { topProjects } = useSelector((state: RootState) => state.projects);

    const handleSubmit = ( values ) => {
        dispatch( addTopProject(values.topProjects) );
    }

    return (
        <Formik
            initialValues={{ 
                topProjects
             }}
            onSubmit={handleSubmit}
        > 
            <Form>
                <div className='fixed flex w-screen h-screen pb-5 top-0 right-0 justify-center items-center z-10'>
                    <div className='flex flex-col w-[70%] glass md:w-[500px] pb-[2%]'>
                        <h3 className='w-full text-xl pl-6 mt-8 font-bold text-sky-950'>Add a Top Project</h3>
                        <p className="w-[90%] pl-6 mt-4 text-md text-sky-950">
                            The top projects are classified as the most important in the hierarchy, notifications and alerts will be received about them faster than any other.
                        </p>
                        <div className="flex flex-col space-y-7 w-[90%]  ml-auto mr-auto my-4">
                            <ProjectField/>
                            <div className='flex space-x-4 w-full'>
                                <button className="w-[50%] glass2 h-10 border-1 border-gray-400 rounded-extra transition-transform duration-150 ease-in-out transform active:translate-y-[2px]" type='submit'>Save</button>
                                <button className="w-[50%] glass3 h-10 border-1 border-gray-400 rounded-extra transition-transform duration-150 ease-in-out transform active:translate-y-[2px]" onClick={ () => setIsModalOpen(!isModalOpen) }>Close</button>
                               
                            </div>

                        </div>

                    </div>
                </div>
            </Form>
            
        </Formik>
    )
}
