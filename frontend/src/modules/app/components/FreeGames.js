import "../style/FreeGames.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {FaPlus } from "react-icons/fa6";
import { ReactComponent as SteamIcon } from "./svg/steam.svg";
import { ReactComponent as XboxIcon } from "./svg/xbox.svg";
import { ReactComponent as EpicIcon } from "./svg/epic.svg";
import { ReactComponent as BattleIcon } from "./svg/battle.svg";
import { ReactComponent as GogIcon } from "./svg/gog.svg";
import {Link} from "react-router-dom";

const FreeGames = () => {
    const [freeGames, setFreeGames] = useState([]);

    useEffect(() => {
        const fetchFreeGames = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_games_index/_search', {
                    size: 5,
                    query: {
                        bool: {
                            should: [
                                {
                                    bool: {
                                        must: [
                                            { term: { "stores.steam.availability": true } },
                                            { term: { "stores.steam.price_in_cents": 0 } }
                                        ]
                                    }
                                },
                                {
                                    bool: {
                                        must: [
                                            { term: { "stores.xbox.availability": true } },
                                            { term: { "stores.xbox.price_in_cents": 0 } }
                                        ]
                                    }
                                },
                                {
                                    bool: {
                                        must: [
                                            { term: { "stores.epic.availability": true } },
                                            { term: { "stores.epic.price_in_cents": 0 } }
                                        ]
                                    }
                                },
                                {
                                    bool: {
                                        must: [
                                            { term: { "stores.battle.availability": true } },
                                            { term: { "stores.battle.price_in_cents": 0 } }
                                        ]
                                    }
                                },
                                {
                                    bool: {
                                        must: [
                                            { term: { "stores.gog.availability": true } },
                                            { term: { "stores.gog.price_in_cents": 0 } }
                                        ]
                                    }
                                }
                            ],
                            minimum_should_match: 1
                        }
                    },
                    sort: [
                        { "data.total_recommendations": { order: "desc" } }
                    ],
                    _source: ["name", "data.header_image", "stores"]
                });

                const hits = response.data.hits.hits;

                const freeGames = hits.map(hit => {

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

                setFreeGames(freeGames);
            } catch (error) {
                console.error("Error fetching free games:", error);
            }
        };

        fetchFreeGames();
    }, []);


    return (
        <div className="FreeGames Margin-bottom">
            <div className="FreeGames-List Margin-bottom">
                {freeGames.map((game, index) => (
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
            <Link to="/free-to-play" className="Formatted-Link">
                <div className="FreeGames-SeeMore">
                    <FaPlus className="Margin-right-small"/><h4>Ver más</h4>
                </div>
            </Link>
        </div>
    );
};

export default FreeGames;
