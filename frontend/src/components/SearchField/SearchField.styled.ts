import styled from 'styled-components';

export const InputSearch = styled.input`
    background: var(--inputBackground);
    color: var(--inputText);
    padding: 10px;
    border: none;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    width: 100%;
    
    &::placeholder,
    &::-webkit-input-placeholder {
        color: var(--inputPlaceholder);
    }
    &:-ms-input-placeholder {
        color: var(--inputPlaceholder);
    }
`;
export const SubmitButton = styled.button`
    background: var(--button);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 10px;
    border: none;
`;