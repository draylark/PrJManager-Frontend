import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import DropdownButton from '../DropDownButton'
import '../styles/rightPanel.css'
import '../styles/styles.css'



export const RightPanel = () => {

    const auth = useSelector( (selector: RootState ) => selector.auth)

  return (
    <div className='flex justify-center xl:justify-normal space-y-9 h-full w-full mb-5 rounded-extra '>

        <div className='Panel flex w-[93%] h-[80%] mt-5 xl:mt-[120px] rounded-extra'>
            <div className="h h-full w-full">

                    <div className='container w-full ml-auto mr-auto xl:ml-0'>
                        <p className='ml-auto mr-auto mt-10 text-xl w-[75%]'>
                            Welcome {auth.username},
                            here's a brief summary of your projects.
                        </p>

                        <div className="flex ml-auto mr-auto mt-5 w-[75%] border-2 justify-center">
                            <DropdownButton />
                        </div>
                        
                    </div>
            </div>
        </div>

</div>
  )
}
