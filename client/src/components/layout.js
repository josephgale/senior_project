import React from 'react';
import { Nav,Navbar } from 'react-bootstrap';
import {Link,useHistory} from 'react-router-dom';
import styled from 'styled-components';
import {getCookie,removeCookie,removeLocalStorage} from '../validation/helpers'
//css imported from index.js

const LinkStyled = styled(Link)`
    margin-left: 2em;
`;

const Layout = (props) => {
    //setting a const seems simpler than setting state
    const isLoggedIn = getCookie('token')

    const history = useHistory();

    const handleLogout = () => {
        console.log('handling the log out')
        removeCookie('token')
        removeLocalStorage('user')
        history.push("/login")
    }

      
    const nav = () => (
        <Navbar>
                <LinkStyled to="/" className="text-light">Home</LinkStyled>
                {!isLoggedIn?<LinkStyled to="/login" className="text-light">Login</LinkStyled>:
                <LinkStyled to="/login" className="text-light" onClick={handleLogout}>Log out</LinkStyled>}
                {!isLoggedIn?<LinkStyled to="/signup" className="text-light">Signup</LinkStyled>:""}
                {isLoggedIn?<LinkStyled to="/dashboard" className="text-light">Dashboard</LinkStyled>:""}
                {isLoggedIn?<LinkStyled to="/account" className="text-light">Account</LinkStyled>:""}
        </Navbar>

    );
    return(
        <div>
            {nav()}
            {props.children}
        </div>
    );
}

export default Layout;