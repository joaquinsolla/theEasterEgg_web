import "../style/SpecialPrices.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {FaPlus } from "react-icons/fa6";
import { ReactComponent as SteamIcon } from "./svg/steam.svg";
import { ReactComponent as XboxIcon } from "./svg/xbox.svg";
import { ReactComponent as EpicIcon } from "./svg/epic.svg";
import { ReactComponent as BattleIcon } from "./svg/battle.svg";
import { ReactComponent as GogIcon } from "./svg/gog.svg";
import {Link} from "react-router-dom";
import { LuLoader } from "react-icons/lu";

const SpecialPrices = () => {
    const initial_step = 20;
    const step = 10;
    const [games, setGames] = useState([]);
    const [from, setFrom] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchGames = async (start = 0) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:9200/theeasteregg_games_index/_search', {
                from: start,
                size: initial_step,
                query: {
                    bool: {
                        should: [
                            {
                                bool: {
                                    must: [
                                        { term: { "stores.steam.availability": true } },
                                        { range: { "stores.steam.price_in_cents": { gt: 0, lt: 2000 } } }
                                    ]
                                }
                            },
                            {
                                bool: {
                                    must: [
                                        { term: { "stores.xbox.availability": true } },
                                        { range: { "stores.xbox.price_in_cents": { gt: 0, lt: 2000 } } }
                                    ]
                                }
                            },
                            {
                                bool: {
                                    must: [
                                        { term: { "stores.epic.availability": true } },
                                        { range: { "stores.epic.price_in_cents": { gt: 0, lt: 2000 } } }
                                    ]
                                }
                            },
                            {
                                bool: {
                                    must: [
                                        { term: { "stores.battle.availability": true } },
                                        { range: { "stores.battle.price_in_cents": { gt: 0, lt: 2000 } } }
                                    ]
                                }
                            },
                            {
                                bool: {
                                    must: [
                                        { term: { "stores.gog.availability": true } },
                                        { range: { "stores.gog.price_in_cents": { gt: 0, lt: 2000 } } }
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
                _source: ["name", "data.capsule_image", "stores", "data.genres", "data.categories"]
            });

            const hits = response.data.hits.hits;
            const newGames = hits.map(hit => {
                const stores = hit._source.stores || {};
                let minPrice = Infinity;
                let platform = null;

                for (const [key, store] of Object.entries(stores)) {
                    if (store?.availability && typeof store.price_in_cents === 'number') {
                        const price = store.price_in_cents;
                        if (price > 0 && price < minPrice) {
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

                return {
                    ...hit._source,
                    genres,
                    categories,
                    min_price: minPrice !== Infinity ? `${(minPrice / 100).toFixed(2)} €` : 'No disponible',
                    min_price_platform: platform || 'No disponible'
                };
            });
            setGames(prev => {
                const existingNames = new Set(prev.map(game => game.name));
                const filteredNew = newGames.filter(game => !existingNames.has(game.name));
                return [...prev, ...filteredNew];
            });
            setFrom(start + step);
        } catch (error) {
            console.error("Error loading games:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames(0);
    }, []);

    return (
        <div>
            <div className="SpecialPrices Margin-bottom-small">
                {games.map((game, index) => (
                    <Link to={`/game/${game._id}`} key={game._id} className="Formatted-Link">
                        <div className="SpecialPrices-Item Flex-center-div Space-Between" key={index}>
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
                                        <div>Sin género</div>
                                    )}
                                    {game.categories && game.categories.length > 0 ? (
                                        game.categories.map((category, index) => (
                                            <span key={`category-${index}`} className="SpecialPrices-Item-Content-Info-Genre">{category}</span>
                                        ))
                                    ) : (
                                        <div>Sin categoría</div>
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
            </div>
            <button className="Formatted-Link" onClick={() => fetchGames(from)} disabled={loading}>
                {loading ?
                    <div className="SpecialPrices-LoadMore">
                        <LuLoader className="Margin-right-small"/><h4>Cargando...</h4>
                    </div>
                    :
                    <div className="SpecialPrices-LoadMore">
                        <FaPlus className="Margin-right-small"/><h4>Cargar más</h4>
                    </div>
                }
            </button>
        </div>
    );
};

export default SpecialPrices;
