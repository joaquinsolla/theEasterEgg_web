import "../style/Searchbar.css";
import React from "react";
import {Link} from "react-router-dom";


const Searchbar = () => {
    return (
        <div className="Searchbar">
            <div className="Searchbar-separator Not-displayed"></div>
            <Link to="platforms" className="Link-simple">
                <p>Plataformas</p>
            </Link>
            <div className="Searchbar-separator"></div>
            <Link to="genres" className="Link-simple">
                <p>Géneros</p>
            </Link>
            <div className="Searchbar-separator"></div>

            <Link to="categories" className="Link-simple">
                <p>Categorías</p>
            </Link>
            <div className="Searchbar-separator"></div>

            <Link to="developers" className="Link-simple">
                <p>Desarrolladores</p>
            </Link>
            <div className="Searchbar-separator"></div>
            <Link to="publishers" className="Link-simple">
                <p>Publishers</p>
            </Link>
            <div className="Searchbar-separator"></div>







        </div>
    );
}

export default Searchbar;