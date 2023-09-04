import { useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react";
import '../styles/styles.css'
import { FC } from 'react'
import { RootState } from "../../../store/store";

type MyComponentProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


export const Modalprofile: FC<MyComponentProps> = ({ setIsOpen }) => {

    const { email, username, photoURL, description, site } = useSelector( (selector: RootState) => selector.auth);
    const [isActive, setIsActive] = useState(false);
    const modalRef = useRef(null);

    const handleClick = () => {
        setIsOpen( false )
    };

    useEffect(() => {
        // Añade un pequeño retraso para iniciar la animación
        const timer = setTimeout(() => {
          setIsActive(true);
        }, 50);
    
        return () => {
          clearTimeout(timer);
        };
      }, []);

      useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        }
    
        // Agregar el escuchador de eventos al montar el componente y removerlo al desmontarlo
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [setIsOpen]);
    
      const animationClasses = isActive ? 'opacity-100' : 'opacity-0';

  return (
    <>

        <div ref={modalRef} data-popover id="popover-company-profile" role="tooltip" className={`transition-opacity duration-700 ease-in-out ${animationClasses} modal-glass h-31 w-80  mt-16 mr-46 absolute z-10 text-sm rounded-lg shadow-sm`}>
                    <div className="p-3">
                        <div className="flex">

                            <div className="mr-3 shrink-0">
                                <a href="#" className="block p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                                    { 
                                        photoURL != null && photoURL != undefined 
                                         ? <img className="w-8 h-8 rounded-full" src={ photoURL } alt="Flowbite logo"/> 
                                         : <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/logo.svg" alt="Flowbite logo"/>
                                    }

                                </a>
                            </div>

                            <div>
                                
                                <p className="mb-1 text-base font-semibold leading-none text-gray-900 dark:text-white">
                                    <a href="#" className="text-sky-950 hover:underline">{ username }</a>
                                </p>
                                <p className="text-sky-950 mb-3 text-sm font-normal">
                                    { email }
                                </p>

                                    { 
                                        description != null && description != undefined 
                                        ?  <p>{ description }</p>
                                        : <p className="text-sky-950 mb-4 text-sm">Add a description</p> 
                                    }
                                      
                                <ul className="text-sm">
                                    <li className="flex items-center mb-2">
                                        <span className="mr-2 font-semibold text-gray-400">
                                            <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 20">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.487 1.746c0 4.192 3.592 1.66 4.592 5.754 0 .828 1 1.5 2 1.5s2-.672 2-1.5a1.5 1.5 0 0 1 1.5-1.5h1.5m-16.02.471c4.02 2.248 1.776 4.216 4.878 5.645C10.18 13.61 9 19 9 19m9.366-6h-2.287a3 3 0 0 0-3 3v2m6-8a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                            </svg>
                                        </span>

                                        { 
                                            site != null && site != undefined 
                                            ?  <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">{ site }</a>
                                            :  <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Add your personal website</a>
                                        }
                                        
                                    </li>
                                    <li className="flex items-start mb-2">
                                        <span className="mr-2 font-semibold text-gray-400">
                                            <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z"/>
                                            </svg>
                                        </span>
                                        <span className="text-sky-950 -mt-1">4,567,346 Followers</span>
                                    </li>
                                </ul>

                                <div className="flex mb-3 -space-x-3">
                                    <img className="w-8 h-8 border-2 border-white rounded-full dark:border-gray-800" src="/docs/images/people/profile-picture-5.jpg" alt=""/>
                                    <img className="w-8 h-8 border-2 border-white rounded-full dark:border-gray-800" src="/docs/images/people/profile-picture-2.jpg" alt=""/>
                                    <img className="w-8 h-8 border-2 border-white rounded-full dark:border-gray-800" src="/docs/images/people/profile-picture-3.jpg" alt=""/>
                                    <a className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-400 border-2 border-white rounded-full hover:bg-gray-500 dark:border-gray-800" href="#">+3</a>
                                </div>


                                <div className="flex">                     
                                    <button
                                        onClick={ handleClick } 
                                        type="button" className="inline-flex items-center justify-center w-full px-5 py-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                        Close
                                    </button>

                                    <button id="dropdown-button" data-dropdown-toggle="dropdown-menu" data-dropdown-placement="right" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shrink-0 focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button"> 
                                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                        </svg>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div data-popper-arrow></div>
        </div>

    </>
  )
}
