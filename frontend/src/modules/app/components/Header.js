import "../style/Header.css";
import {useSelector} from 'react-redux';
import React from "react";
import { TbLogout } from "react-icons/tb";
import users from '../../users';
import {Link} from "react-router-dom";

const Header = () => {

    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const user = useSelector(users.selectors.getUser);

    return (
        <div className="Header">
            <div className="Header-Banner-Container">
                <Link to="">
                    <img src="/theeasteregg_web/assets/header-logo-3.webp" className="Header-Banner" alt="logo"/>
                </Link>
            </div>
            <div className="Header-Buttons-Container">
                {isLoggedIn ? (
                    <div className="Flex-center-div">
                        <div className="Flex-center-div Header-Buttons-Container-Userbuttons">
                            <Link to="/for-you" className="Link-simple">
                                <p>Para ti</p>
                            </Link>
                            <Link to="/desired-games" className="Link-simple Flex-center-div Margin-left Flex-center-div">
                                <p>Lista de deseados</p>
                            </Link>
                            <Link to="/account" className="Link-simple Flex-center-div Margin-left Flex-center-div">
                                <p>{user.userName}</p>
                            </Link>
                        </div>
                        <Link to="/logout" className="Link-simple Flex-center-div Margin-left Flex-center-div Logout-Container">
                            <p>Cerrar sesión</p>
                            <TbLogout className="Header-User-Icon Margin-left-small"/>
                        </Link>
                    </div>
                ) : (
                    <div className="Flex-center-div">
                        <Link to="/signup" className="Link-simple">
                            <p>Crear cuenta</p>
                        </Link>
                        <Link to="/login" className="Link-simple Margin-left">
                            <p>Iniciar sesión</p>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;