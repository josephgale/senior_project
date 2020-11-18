import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {getCookie} from '../validation/helpers'

const LinkStyled = styled(Link)`
    margin-left: 2em;
`;

const Layout = (props) => {
    //setting a const seems simpler than setting state
    const isLoggedIn = getCookie('token')
        
    const nav = () => (
        <ul className = "nav nav-tabs bg-primary">
            <li className="nav-item">
                <LinkStyled to="/" className="text-light">Home</LinkStyled>
                {!isLoggedIn?<LinkStyled to="/login" className="text-light">Login</LinkStyled>:
                <LinkStyled to="/logout" className="text-light">Log out</LinkStyled>}
                {!isLoggedIn?<LinkStyled to="/signup" className="text-light">Signup</LinkStyled>:""}
            </li>
        </ul>
    );
    return(
        <div>
            {nav()}
            {props.children}
        </div>
    );
}

export default Layout;