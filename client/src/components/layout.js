import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const LinkStyled = styled(Link)`
    margin-left: 2em;
`;

const Layout = (props) => {
    const nav = () => (
        <ul className = "nav nav-tabs bg-primary">
            <li className="nav-item">
                <LinkStyled to="/" className="text-light">Home</LinkStyled>
                <LinkStyled to="/login" className="text-light">Login</LinkStyled>
                <LinkStyled to="/signup" className="text-light">Signup</LinkStyled>
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