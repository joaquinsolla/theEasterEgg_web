import "../style/PlatformsList.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {FaPlus } from "react-icons/fa6";
import { ReactComponent as SteamIcon } from "./svg/steam.svg";
import { ReactComponent as XboxIcon } from "./svg/xbox.svg";
import { ReactComponent as EpicIcon } from "./svg/epic.svg";
import { ReactComponent as BattleIcon } from "./svg/battle.svg";
import { ReactComponent as GogIcon } from "./svg/gog.svg";
import {Link} from "react-router-dom";
import Searchbar from "./Searchbar";

const PlatformsList = () => {

    return (
        <div className="PlatformsList Content">
            <Searchbar />

            <h1 className="Margin-bottom-big">Plataformas</h1>

            <div className="PlatformsList-Container Flex-center-div">
                <Link to={{pathname: "/advanced-search", search: "?platform=steam"}} className="Formatted-Link">
                    <div className="PlatformsList-Container-Item">
                        <SteamIcon className="PlatformsList-Container-Item-Svg Margin-bottom" />
                        <h2>Steam</h2>
                    </div>
                </Link>
                <Link to={{pathname: "/advanced-search", search: "?platform=epic"}} className="Formatted-Link">
                    <div className="PlatformsList-Container-Item">
                        <EpicIcon className="PlatformsList-Container-Item-Svg Margin-bottom" />
                        <h2>Epic Games</h2>
                    </div>
                </Link>
                <Link to={{pathname: "/advanced-search", search: "?platform=xbox"}} className="Formatted-Link">
                    <div className="PlatformsList-Container-Item">
                        <XboxIcon className="PlatformsList-Container-Item-Svg Margin-bottom" />
                        <h2>Xbox</h2>
                    </div>
                </Link>
                <Link to={{pathname: "/advanced-search", search: "?platform=battle"}} className="Formatted-Link">
                    <div className="PlatformsList-Container-Item">
                        <BattleIcon className="PlatformsList-Container-Item-Svg Margin-bottom" />
                        <h2>Battle.net</h2>
                    </div>
                </Link>
                <Link to={{pathname: "/advanced-search", search: "?platform=gog"}} className="Formatted-Link">
                    <div className="PlatformsList-Container-Item">
                        <GogIcon className="PlatformsList-Container-Item-Svg Margin-bottom" />
                        <h2>GOG.com</h2>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default PlatformsList;
