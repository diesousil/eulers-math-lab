'use client'

import React, { FC, useState} from 'react';
import { InputSearch, SubmitButton } from './SearchField.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

interface SearchFieldProps {
    placeholder: string;
    onSubmit: (query:String) => void;
}


const SearchField: FC<SearchFieldProps> = (props) => {
    const [query, setQuery] = useState("");

    function handleSubmitClick() {
        props.onSubmit(query);
    }

    return (

        <div className="w-full flex">
    
            <InputSearch value={query} 
                         onChange={e => setQuery(e.target.value)} 
                         className='outline-none' 
                         data-testid="InputSearchField" 
                         placeholder={props.placeholder} />
                        
        
            <SubmitButton><FontAwesomeIcon onClick={handleSubmitClick} icon={faArrowDown} /></SubmitButton>
        </div>
    
    );
}

export default SearchField;
