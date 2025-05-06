import "../style/Header.css";
import {useSelector} from 'react-redux';
import React from "react";
import {FaUserCircle} from "react-icons/fa";

import users from '../../users';
import {Link} from "react-router-dom";

const Header = () => {

    const isLoggedIn = useSelector(users.selectors.isLoggedIn);

    return (
        <div className="Header">
            <div>
                <Link to="">
                    <img src={process.env.PUBLIC_URL + "/assets/banner-3.webp"} className="Header-logo" alt="logo"/>
                </Link>
            </div>
            <div>
                {isLoggedIn ? (
                    <div className="Flex-center-div">
                        <Link to="desired-games" className="Link-simple">
                            <p>Lista de deseados</p>
                        </Link>
                        <Link to="account" className="Link-simple Flex-center-div Margin-left">
                            <p>Mi cuenta</p>
                            <FaUserCircle className="Header-icon Margin-left"/>
                        </Link>
                    </div>
                ) : (
                    <div className="Flex-center-div">
                        <Link to="signup" className="Link-simple">
                            <p>Crear cuenta</p>
                        </Link>
                        <Link to="login" className="Link-simple Margin-left">
                            <p>Iniciar sesión</p>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;