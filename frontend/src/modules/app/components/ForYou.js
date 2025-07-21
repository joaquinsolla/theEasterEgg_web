import "../style/SpecialPrices.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactComponent as SteamIcon } from "../../common/assets/svg/steam.svg";
import { ReactComponent as XboxIcon } from "../../common/assets/svg/xbox.svg";
import { ReactComponent as EpicIcon } from "../../common/assets/svg/epic.svg";
import { ReactComponent as BattleIcon } from "../../common/assets/svg/battle.svg";
import { ReactComponent as GogIcon } from "../../common/assets/svg/gog.svg";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import users from "../../users";
import Searchbar from "./Searchbar";
import IndieGames from "./IndieGames";

const REACT_APP_ELASTICSEARCH_URL = process.env.REACT_APP_ELASTICSEARCH_URL;

const ForYou = () => {
    const [favoriteGames, setFavoriteGames] = useState([]);

    const [gamesSelection1, setGamesSelection1] = useState([]);
    const [gamesSelection2, setGamesSelection2] = useState([]);
    const [gamesSelection3, setGamesSelection3] = useState([]);
    const [gamesSelection4, setGamesSelection4] = useState([]);
    const [gamesSelection5, setGamesSelection5] = useState([]);

    const [gamesSelectionField1, setGamesSelectionField1] = useState(null);
    const [gamesSelectionField2, setGamesSelectionField2] = useState(null);
    const [gamesSelectionField3, setGamesSelectionField3] = useState(null);
    const [gamesSelectionField4, setGamesSelectionField4] = useState(null);
    const [gamesSelectionField5, setGamesSelectionField5] = useState(null);

    const [favoriteIds, setFavoriteIds] = useState([]);
    const user = useSelector(users.selectors.getUser);

    useEffect(() => {
        if (!user?.id) return;

        fetch(`/theeasteregg_web/api/users/${user.id}/favorites`)
            .then(res => res.json())
            .then(data => setFavoriteIds(data))
            .catch(console.error);
    }, [user]);

    useEffect(() => {
        if (favoriteIds.length > 0) {
            fetchFavoriteGames();
        }
    }, [favoriteIds]);

    const fetchFavoriteGames = async () => {
        if (!favoriteIds.length) return;

        try {
            const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                size: 5,
                query: {
                    ids: {
                        values: favoriteIds.map(String)
                    }
                },
                sort: [
                    { "data.total_recommendations": { order: "desc" } }
                ],
                _source: ["name", "data"]
            });

            const hits = response.data.hits.hits;

            const newGames = hits.map(hit => {
                return {
                    _id: hit._id,
                    name: hit._source.name,
                    data: hit._source.data
                };
            });

            setFavoriteGames(newGames);
        } catch (error) {
            console.error("Error loading favorite games:", error);
        }
    };

    useEffect(() => {
        if (favoriteGames.length > 0) {
            if (favoriteGames.length >= 1) fetchGamesByCategory(favoriteGames[0], setGamesSelection1, setGamesSelectionField1);
            if (favoriteGames.length >= 2) fetchGamesByCategory(favoriteGames[1], setGamesSelection2, setGamesSelectionField2);
            if (favoriteGames.length >= 3) fetchGamesByGenre(favoriteGames[2], setGamesSelection3, setGamesSelectionField3);
            if (favoriteGames.length >= 4) fetchGamesByDeveloper(favoriteGames[3], setGamesSelection4, setGamesSelectionField4);
            if (favoriteGames.length >= 5) fetchGamesByPublisher(favoriteGames[4], setGamesSelection5, setGamesSelectionField5);
        }
    }, [favoriteGames]);

    const fetchGamesByCategory = async (refGame, selectionSetter, fieldSetter) => {
        try {
            let category = refGame?.["data"]?.["categories"][0];

            const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                size: 5,
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    "data.categories.keyword": category
                                }
                            }
                        ],
                        must_not: refGame?.["name"] ? [
                            {
                                term: {
                                    "name.keyword": refGame["name"]
                                }
                            }
                        ] : []
                    }
                },
                sort: [
                    { "data.total_recommendations": { order: "desc" } }
                ],
                _source: ["name", "data.header_image", "stores"]
            });

            const hits = response.data.hits.hits;

            const retrievedGames = hits.map(hit => {

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

            selectionSetter(retrievedGames);
            fieldSetter(refGame?.["name"]);
        } catch (error) {
            console.error("Error fetching games (2):", error);
        }
    };

    const fetchGamesByGenre = async (refGame, selectionSetter, fieldSetter) => {
        try {
            let genre = refGame?.["data"]?.["genres"][0];

            const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                size: 5,
                query: {
                    bool: {
                        must: [
                            {
                                "term": {
                                    "data.genres.keyword": genre
                                }
                            }
                        ],
                        must_not: refGame?.["name"] ? [
                            {
                                term: {
                                    "name.keyword": refGame["name"]
                                }
                            }
                        ] : []
                    }
                },
                sort: [
                    { "data.total_recommendations": { order: "desc" } }
                ],
                _source: ["name", "data.header_image", "stores"]
            });

            const hits = response.data.hits.hits;

            const retrievedGames = hits.map(hit => {

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

            selectionSetter(retrievedGames);
            fieldSetter(genre);
        } catch (error) {
            console.error("Error fetching games (1):", error);
        }
    };

    const fetchGamesByDeveloper = async (refGame, selectionSetter, fieldSetter) => {
        try {
            let developer = refGame?.["data"]?.["developers"][0];

            const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                size: 5,
                query: {
                    bool: {
                        must: [
                            {
                                "term": {
                                    "data.developers.keyword": developer
                                }
                            }
                        ],
                        must_not: refGame?.["name"] ? [
                            {
                                term: {
                                    "name.keyword": refGame["name"]
                                }
                            }
                        ] : []
                    }
                },
                sort: [
                    { "data.total_recommendations": { order: "desc" } }
                ],
                _source: ["name", "data.header_image", "stores"]
            });

            const hits = response.data.hits.hits;

            const retrievedGames = hits.map(hit => {

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

            selectionSetter(retrievedGames);
            fieldSetter(developer);
        } catch (error) {
            console.error("Error fetching games (3):", error);
        }
    };

    const fetchGamesByPublisher = async (refGame, selectionSetter, fieldSetter) => {
        try {
            let publisher = refGame?.["data"]?.["publishers"][0];

            const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                size: 5,
                query: {
                    bool: {
                        must: [
                            {
                                "term": {
                                    "data.publishers.keyword": publisher
                                }
                            }
                        ],
                        must_not: refGame?.["name"] ? [
                            {
                                term: {
                                    "name.keyword": refGame["name"]
                                }
                            }
                        ] : []
                    }
                },
                sort: [
                    { "data.total_recommendations": { order: "desc" } }
                ],
                _source: ["name", "data.header_image", "stores"]
            });

            const hits = response.data.hits.hits;

            const retrievedGames = hits.map(hit => {

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

            selectionSetter(retrievedGames);
            fieldSetter(publisher);
        } catch (error) {
            console.error("Error fetching games (2):", error);
        }
    };

    return (
        <div className="Content">
            <Searchbar />
            <h1 className="Margin-bottom">Para ti</h1>
            <div className="SpecialPrices Margin-bottom-small">
                { favoriteGames.length > 0 ? (
                    <>
                    { gamesSelection1.length > 0 && (
                        <div className="Content-Section-1 Margin-bottom-big">
                            <h2 className="Margin-bottom">Porque te gusta {gamesSelectionField1}</h2>
                            <div className="FreeGames-List Margin-bottom">
                                {gamesSelection1.map((game, index) => (
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
                        </div>
                    )}
                    { gamesSelection2.length > 0 && (
                        <div className="Content-Section-1 Margin-bottom-big">
                            <h2 className="Margin-bottom">Similares a {gamesSelectionField2}</h2>
                            <div className="FreeGames-List Margin-bottom">
                                {gamesSelection2.map((game, index) => (
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
                        </div>
                    )}
                    { gamesSelection3.length > 0 && (
                        <div className="Content-Section-1 Margin-bottom-big">
                            <h2 className="Margin-bottom">Del género {gamesSelectionField3}</h2>
                            <div className="FreeGames-List Margin-bottom">
                                {gamesSelection3.map((game, index) => (
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
                        </div>
                    )}
                    { gamesSelection4.length > 0 && (
                        <div className="Content-Section-1 Margin-bottom-big">
                            <h2 className="Margin-bottom">Desarrollados por {gamesSelectionField4}</h2>
                            <div className="FreeGames-List Margin-bottom">
                                {gamesSelection4.map((game, index) => (
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
                        </div>
                    )}
                    { gamesSelection5.length > 0 && (
                        <div className="Content-Section-1 Margin-bottom-big">
                            <h2 className="Margin-bottom">Publicados por {gamesSelectionField5}</h2>
                            <div className="FreeGames-List Margin-bottom">
                                {gamesSelection5.map((game, index) => (
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
                        </div>
                    )}
                    </>
                ) : (
                    <div className="Text-center No-Desired-Games">
                        ¡Debes guardar juegos en tu lista de deseados para que se generen recomendaciones en función de tus gustos!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForYou;
