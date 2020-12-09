import styled from 'styled-components';
import img from './images/space.jpg';


export const Form = styled.form`
    background-color: #B6E2ED;
    border-radius: 25px;
    box-shadow: -.02px -.05px 30px -1px rgba(0,0,0,0.75);
    color: #454547;
    font-size: .90em;
    font-weight: bold;
    padding: 1em;   
    width: 100%;  
`;

export const Body = styled.body`
    background: url(${img});
    background-repeat: repeat-n;
    height: 1200px;
    
`;

export const Input = styled.input`
    border-radius: 5px;
    width: 100%;
    height: 4em;
    margin-top: 1em;
`;

export const Column = styled.div`
    border-radius: 20px;
    margin-top: 2em;    
    width: 100%;
`;

export const SelectBox = styled.select`
    width: 100%;
    padding: .25em;
`;