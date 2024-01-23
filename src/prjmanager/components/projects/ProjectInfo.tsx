import { HeatMapCalendar } from './heatmap/heatmap'


export const ProjectInfo = ({ project }) => {


    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString();  // Retorna, por ejemplo, "9/17/2023"
    }

    const getFileTypeIcon = (fileType) => {

        switch (fileType) {
            case 'doc':
            return 'FileDocument';
            case 'xls':
            return 'FileExcel';
            case 'ppt':
            return 'FilePowerpoint';
            case 'pdf':
            return 'FilePdf';
            case 'zip':
            return 'FileZip';
            case 'txt':
            return 'FileText';
            case 'img':
            return 'FileImage';
            case 'vid':
            return 'FileVideo';
            case 'aud':
            return 'FileAudio';
            default:
            return 'File';
        }

    }

  return (
    <>
        <div className='flex space-x-6 mb-4'>
            <div className='flex flex-col'>
                <label className='text-sm text-gray-500'>Start Date</label>
                <span className='text-lg'>{formatDate(project.startDate)}</span>
            </div>
            <div className='flex flex-col'>
                <label className='text-sm text-gray-500'>End Date</label>
                <span className='text-lg'>{formatDate(project.endDate)}</span>
            </div>
            <div className='flex flex-col'>
                <label className='text-sm text-gray-500'>Last Update</label>
                <span className='text-lg'>{formatDate(project.lastUpdated)}</span>
            </div>
        </div>
        
        <div className='flex space-x-6 mb-4'>
            <div className='flex flex-col'>
            <label className='text-sm text-gray-500'>Members</label>
            <span className='text-lg'>{project.members.length}</span>
            </div>
            <div className='flex flex-col'>
            <label className='text-sm text-gray-500'>Clients</label>
            <span className='text-lg'>{project.clients.length}</span>
            </div>
            <div className='flex flex-col'>
            <label className='text-sm text-gray-500'>Tasks</label>
            <span className='text-lg'>{project.tasks.length}</span>
            </div>
        </div>
        
        <div className='mb-4'>
            <label className='text-sm text-gray-500'>Tags</label>
            <div className="flex flex-wrap">
            {project.tags.map(tag => (
                <span key={tag} className="text-blue-500 bg-blue-100 rounded px-2 py-1 m-1">
                {tag}
                </span>
            ))}
            </div>
        </div>


        <div className='mb-2'>
            <label className='text-sm text-gray-500'>Add Files</label>
            <div className="mt-2">
                <input type="file" multiple className="border p-2 rounded" />
            </div>
        </div>

        <div>
            <label className='text-sm text-gray-500'>Description</label>
            <p className='text-lg mt-2'>{project.description}</p>
        </div>
        
        <HeatMapCalendar project={project} />

    </>
  )
}
