import React, { useState } from 'react';
import { useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import "../../app/style/UserStyle.css";
import users from "../../users";

const AccountDetails = () => {

    const user = useSelector(users.selectors.getUser);

    return (
        <div className="User-Login Content Justify-Content-Center"
             style={{ backgroundImage: `var(--background-image-opacity-2), url(https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/377160/ss_f649b8e57749f380cca225db5074edbb1e06d7f5.1920x1080.jpg?t=1726758475)` }}>
            <div className="Flex-center-div Text-center Justify-Content-Center">
                <div className="User-Login-Container">
                    <img src="/theeasteregg_web/assets/vault_boy.webp" className="User-Login-Image" />
                    <div className="Text-left">
                        <h1 className="Margin-top Margin-bottom">
                            Mi cuenta
                        </h1>

                        <div className="Margin-bottom">
                            <div className="User-Login-Label">
                                Correo electrónico
                            </div>
                            <p>
                                {user.email}
                            </p>
                        </div>

                        <div className="Margin-bottom">
                            <div className="User-Login-Label">
                                Nombre de usuario
                            </div>
                            <p>
                                {user.userName}
                            </p>
                        </div>

                        <div className="Margin-bottom">
                            <Link to="/desired-games" className="Formatted-Link-Blue">
                                Mis juegos deseados
                            </Link>
                        </div>

                        <div>
                            <Link to="/logout" className="Formatted-Link-Red">
                                Cerrar sesión
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
