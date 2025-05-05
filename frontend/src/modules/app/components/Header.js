import "../style/Header.css";
import {useSelector} from 'react-redux';
import React from "react";

import users from '../../users';

const Header = () => {

    const isLoggedIn = useSelector(users.selectors.isLoggedIn);

    return (
        <div className="Header">
            <div>
                <img src={process.env.PUBLIC_URL + "/assets/banner-3.webp"} className="Header-logo" alt="logo"/>
            </div>
            <div>
                {isLoggedIn ? (
                    <p>Usuario logeado</p>
                ) : (
                    <p>Usuario anónimo</p>
                )}
            </div>
        </div>
    );
}

export default Header;