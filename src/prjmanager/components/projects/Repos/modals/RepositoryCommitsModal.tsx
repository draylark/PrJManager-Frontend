import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useRepositoryCommitsData } from '../hooks/useRepositoryCommitsData';

export const RepositoryCommitsModal = ({ isCommitsModalOpen, setIsCommitsModalOpen }) => {


    const handleClose = () => {
        const modal = document.getElementById('repositoryCommitModal');
        if (modal) {
            // Inicia la transición de opacidad a 0
            modal.classList.replace('opacity-100', 'opacity-0');
  
            // Espera a que la animación termine antes de ocultar el modal completamente
            setTimeout(() => {
                setIsCommitsModalOpen(false);
            }, 500); // Asume que la duración de tu transición es de 500ms
        }
      };


    useEffect(() => {
        if (isCommitsModalOpen) {
            // Asegúrate de que el modal existe antes de intentar acceder a él
            // Luego, después de un breve retraso, inicia la transición de opacidad
            const timer = setTimeout(() => {
            document.getElementById('repositoryCommitModal').classList.remove('opacity-0');
            document.getElementById('repositoryCommitModal').classList.add('opacity-100');
            }, 20); // Un retraso de 20ms suele ser suficiente
            return () => clearTimeout(timer);
        }
    }, [isCommitsModalOpen]);


  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center'>
        <div id="repositoryCommitModal" className={`flex flex-col glass2 space-y-5 w-[90%] overflow-hidden  md:w-[50%] md:h-[80%] rounded-2xl border-1 border-gray-400 transition-opacity duration-300 ease-in-out opacity-0 ${isCommitsModalOpen ? '' : 'pointer-events-none'}`}>
            
        </div>
    </div>
  )
}
