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

const REACT_APP_ELASTICSEARCH_URL = process.env.REACT_APP_ELASTICSEARCH_URL;

const DesiredGames = () => {
    const [games, setGames] = useState([]);
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
            fetchGames();
        }
    }, [favoriteIds]);

    const fetchGames = async () => {
        if (!favoriteIds.length) return;

        try {
            const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                size: favoriteIds.length,
                query: {
                    ids: {
                        values: favoriteIds.map(String)
                    }
                },
                sort: [
                    { "data.total_recommendations": { order: "desc" } }
                ],
                _source: ["name", "data.capsule_image", "stores", "data.genres", "data.categories", "data.release_date"]
            });

            const hits = response.data.hits.hits;

            const newGames = hits.map(hit => {
                const stores = hit._source.stores || {};
                let coming_soon = hit._source.data.release_date.coming_soon;
                let minPrice = Infinity;
                let platform = null;

                for (const [key, store] of Object.entries(stores)) {
                    if (store?.availability && typeof store.price_in_cents === 'number') {
                        const price = store.price_in_cents;
                        if (price >= 0 && price < minPrice) {
                            minPrice = price;
                            platform = key;
                        }
                    }
                }

                const genres = Array.isArray(hit._source.data.genres)
                    ? hit._source.data.genres.slice(0, 2)
                    : [];
                const categories = Array.isArray(hit._source.data.categories)
                    ? hit._source.data.categories.slice(0, 2)
                    : [];

                if (!coming_soon){
                    return {
                        ...hit._source,
                        genres,
                        categories,
                        _id: hit._id,
                        min_price: (minPrice !== Infinity && minPrice !== 0) ? `${(minPrice / 100).toFixed(2)} €` : 'Gratis',
                        min_price_platform: platform || 'Gratis'
                    };
                } else {
                    return {
                        ...hit._source,
                        genres,
                        categories,
                        _id: hit._id,
                        min_price: 'Próximamente',
                        min_price_platform: 'No diponible'
                    };
                }

            });

            setGames(newGames);
        } catch (error) {
            console.error("Error loading favorite games:", error);
        }
    };

    return (
        <div className="Content">
            <Searchbar />
            <h1 className="Margin-bottom">Lista de deseados</h1>
            <div className="SpecialPrices Margin-bottom-small">
                { games.length > 0 ? (
                    <>
                        {games.map((game, index) => (
                            <Link to={`/game/${game._id}`} key={game._id} className="Formatted-Link">
                                <div className="SpecialPrices-Item-2 Flex-center-div Space-Between" key={index}>
                                    <div className="SpecialPrices-Item-Content Flex-start-div">
                                        <img className="SpecialPrices-Item-Content-Image Margin-right" src={game.data.capsule_image} />
                                        <div className="SpecialPrices-Item-Content-Info">
                                            <h3 className="Margin-bottom-small">{game.name}</h3>
                                            <div>
                                                {game.genres && game.genres.length > 0 ? (
                                                    game.genres.map((genre, index) => (
                                                        <span key={`genre-${index}`} className="SpecialPrices-Item-Content-Info-Genre">{genre}</span>
                                                    ))
                                                ) : (
                                                    <span className="SpecialPrices-Item-Content-Info-Genre">Sin género</span>
                                                )}
                                                {game.categories && game.categories.length > 0 ? (
                                                    game.categories.map((category, index) => (
                                                        <span key={`category-${index}`} className="SpecialPrices-Item-Content-Info-Genre">{category}</span>
                                                    ))
                                                ) : (
                                                    <span className="SpecialPrices-Item-Content-Info-Genre">Sin categoría</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="SpecialPrices-Item-Price Flex-center-div">
                                        <div className="SpecialPrices-Item-Price-Platform Margin-right">
                                            {game.min_price_platform === "steam" && (
                                                <SteamIcon className="SpecialPrices-Item-Price-Platform-Svg"/>
                                            )}
                                            {game.min_price_platform === "epic" && (
                                                <EpicIcon className="SpecialPrices-Item-Price-Platform-Svg Margin-left-small" />
                                            )}
                                            {game.min_price_platform === "xbox" && (
                                                <XboxIcon className="SpecialPrices-Item-Price-Platform-Svg Margin-left-small" />
                                            )}
                                            {game.min_price_platform === "battle" && (
                                                <BattleIcon className="SpecialPrices-Item-Price-Platform-Svg Margin-left-small" />
                                            )}
                                            {game.min_price_platform === "gog" && (
                                                <GogIcon className="SpecialPrices-Item-Price-Platform-Svg Margin-left-small" />
                                            )}
                                        </div>
                                        <div className="SpecialPrices-Item-Price-Price Margin-right">
                                            {game.min_price}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </>
                ) : (
                    <div className="Text-center No-Desired-Games">
                        Tu lista de juegos deseados está vacía.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DesiredGames;
