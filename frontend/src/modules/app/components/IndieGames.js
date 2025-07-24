import "../style/FreeGames.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {FaPlus } from "react-icons/fa6";
import { ReactComponent as SteamIcon } from "../../common/assets/svg/steam.svg";
import { ReactComponent as XboxIcon } from "../../common/assets/svg/xbox.svg";
import { ReactComponent as EpicIcon } from "../../common/assets/svg/epic.svg";
import { ReactComponent as BattleIcon } from "../../common/assets/svg/battle.svg";
import { ReactComponent as GogIcon } from "../../common/assets/svg/gog.svg";
import {Link} from "react-router-dom";

const REACT_APP_ELASTICSEARCH_URL = process.env.REACT_APP_ELASTICSEARCH_URL;

const IndieGames = () => {
    const [indieGames, setIndieGames] = useState([]);

    useEffect(() => {
        const fetchIndieGames = async () => {
            try {
                const currentYear = new Date().getFullYear();

                const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                    size: 5,
                    query: {
                        bool: {
                            must: [
                                {
                                    term: {
                                        "data.genres.keyword": "Indie"
                                    }
                                },
                                {
                                    bool: {
                                        should: [
                                            { term: { "data.release_date.year": currentYear } },
                                            { term: { "data.release_date.year": currentYear -1} },
                                            { term: { "data.release_date.year": currentYear -2} },
                                            { term: { "data.release_date.year": currentYear -3} },
                                            { term: { "data.release_date.year": currentYear -4} }
                                        ],
                                        minimum_should_match: 1
                                    }
                                },
                                { exists: { field: "data.capsule_image" } },
                                { exists: { field: "data.header_image" } }
                            ]
                        }
                    },
                    sort: [
                        { "data.total_recommendations": { order: "desc" } }
                    ],
                    _source: ["name", "data.header_image", "stores"]
                });

                const hits = response.data.hits.hits;

                const indieGames = hits.map(hit => {

                    return {
                        _id: hit._id,
                        name: hit._source.name,
                        header_image: hit._source.data?.header_image,
                        availability_steam: hit._source.stores?.steam?.availability,
                        availability_epic: hit._source.stores?.epic?.availability,
                        availability_xbox: hit._source.stores?.xbox?.availability,
                        availability_battle: hit._source.stores?.battle?.availability,
                        availability_gog: hit._source.stores?.gog?.availability,
                    };
                });

                setIndieGames(indieGames);
            } catch (error) {
                console.error("Error fetching indie games:", error);
            }
        };

        fetchIndieGames();
    }, []);


    return (
        <div className="FreeGames Margin-bottom">
            <div className="FreeGames-List Margin-bottom">
                {indieGames.map((game, index) => (
                    <Link to={`/game/${game._id}`} key={game._id} className="Formatted-Link">
                        <div className="FreeGames-List-Item" key={index}>
                            <img className="FreeGames-List-Item-Image" src={game.header_image} />
                            <div className="FreeGames-List-Item-Info">
                                <h4 className="Margin-bottom-small">{game.name}</h4>
                                <div className="FreeGames-List-Item-Info-Availability">
                                    {game.availability_steam && (
                                        <SteamIcon className="FreeGames-List-Item-Info-Availability-Svg"/>
                                    )}
                                    {game.availability_epic && (
                                        <EpicIcon className="FreeGames-List-Item-Info-Availability-Svg Margin-left-small" />
                                    )}
                                    {game.availability_xbox && (
                                        <XboxIcon className="FreeGames-List-Item-Info-Availability-Svg Margin-left-small" />
                                    )}
                                    {game.availability_battle && (
                                        <BattleIcon className="FreeGames-List-Item-Info-Availability-Svg Margin-left-small" />
                                    )}
                                    {game.availability_gog && (
                                        <GogIcon className="FreeGames-List-Item-Info-Availability-Svg Margin-left-small" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <Link to={{pathname: "/advanced-search", search: "?genre=Indie"}} className="Formatted-Link">
                <div className="FreeGames-SeeMore">
                    <FaPlus className="Margin-right-small"/><h4>Ver más</h4>
                </div>
            </Link>
        </div>
    );
};

export default IndieGames;
