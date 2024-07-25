import React, { useState } from 'react';



const useForm = <T extends object>( initialForm: T ) => {

    const [formState, setFormState] = useState<T>( initialForm );

    const onInputChange = ( { target } : React.ChangeEvent<HTMLInputElement> ) => {

        const { name, value } = target

        setFormState({
            ...formState,
        [ name ] : value

        })



    }


    const onResetForm = () => {
        setFormState( initialForm )
    }


    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm
    }

}

export default useForm