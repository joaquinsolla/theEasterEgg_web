import "../style/SelectedGames.css";
import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import {FaAngleLeft, FaAngleRight, FaThumbsUp } from "react-icons/fa6";
import { ReactComponent as SteamIcon } from "./svg/steam.svg";
import { ReactComponent as XboxIcon } from "./svg/xbox.svg";
import { ReactComponent as EpicIcon } from "./svg/epic.svg";
import { ReactComponent as BattleIcon } from "./svg/battle.svg";
import { ReactComponent as GogIcon } from "./svg/gog.svg";

const SelectedGames = () => {
    const [games, setGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTopGames = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_games_index/_search', {
                    size: 5,
                    query: {
                        match_all: {}
                    },
                    sort: [
                        { "data.total_recommendations": "desc" }
                    ],
                    _source: ["name", "data.header_image", "stores", "data.background_raw", "data.short_description",
                        "data.total_recommendations", "data.genres", "data.categories"]
                });

                const hits = response.data.hits.hits;

                const topGames = hits.map(hit => {
                    let min_price = "No disponible";
                    const stores = hit._source.stores || {};
                    const validPrices = Object.values(stores)
                        .filter(s => s?.availability)
                        .map(s => s.price_in_cents)
                        .filter(p => p >= 0);

                    if (validPrices.length > 0) {
                        const rawMin = Math.min(...validPrices);
                        min_price = rawMin === 0 ? "Gratis" : `${(rawMin / 100).toFixed(2)}€`;
                    }

                    return {
                        _id: hit._id,
                        name: hit._source.name,
                        min_price,
                        header_image: hit._source.data?.header_image,
                        background_raw: hit._source.data?.background_raw,
                        short_description: hit._source.data?.short_description,
                        total_recommendations: hit._source.data?.total_recommendations,
                        genres: hit._source.data?.genres?.slice(0, 2),
                        categories: hit._source.data?.categories?.slice(0, 2),
                        availability_steam: hit._source.stores?.steam?.availability,
                        availability_epic: hit._source.stores?.epic?.availability,
                        availability_xbox: hit._source.stores?.xbox?.availability,
                        availability_battle: hit._source.stores?.battle?.availability,
                        availability_gog: hit._source.stores?.gog?.availability,
                    };
                });

                setGames(topGames);
            } catch (error) {
                console.error("Error fetching top games:", error);
            }
        };

        fetchTopGames();
    }, []);

    // Avance automático cada 5s
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                games.length > 0 ? (prevIndex + 1) % games.length : 0
            );
        }, 10000);
        return () => clearInterval(interval);
    }, [games]);

    const goNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
    };

    const goPrev = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + games.length) % games.length
        );
    };

    const currentGame = games[currentIndex];


    return (
        <div className="SelectedGames-Carousel Margin-bottom">
            {currentGame && (
                <div className="SelectedGames-Carousel-Content Flex-center-div">
                    <button onClick={goPrev} className="SelectedGames-Carousel-Arrow"><FaAngleLeft /></button>
                    <Link to={`/game/${currentGame._id}`} key={currentGame._id} className="SelectedGames-Link">
                        <div className="SelectedGames-Carousel-Content-Item">
                            <img src={currentGame.header_image} alt={currentGame.name} className="SelectedGames-Carousel-Content-Item-Image" />
                            <div className="SelectedGames-Carousel-Content-Item-Info" style={{backgroundImage: `var(--default-background-image-opacity), url(${currentGame.background_raw})`}}>
                                <div>
                                    <div className="Flex-center-div Space-Between Margin-bottom">
                                        <h1>{currentGame.name}</h1>
                                        <div>
                                            {currentGame.availability_steam && (
                                                <SteamIcon className="Availability-Svg"/>
                                            )}
                                            {currentGame.availability_epic && (
                                                <EpicIcon className="Availability-Svg Margin-left-small" />
                                            )}
                                            {currentGame.availability_xbox && (
                                                <XboxIcon className="Availability-Svg Margin-left-small" />
                                            )}
                                            {currentGame.availability_battle && (
                                                <BattleIcon className="Availability-Svg Margin-left-small" />
                                            )}
                                            {currentGame.availability_gog && (
                                                <GogIcon className="Availability-Svg Margin-left-small" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="Margin-bottom">
                                        {currentGame.genres && currentGame.genres.length > 0 ? (
                                            currentGame.genres.map((genre, index) => (
                                                <span key={index} className="SelectedGames-Carousel-Content-Item-Info-Genre">{genre}</span>
                                            ))
                                        ) : (
                                            <div>Sin género</div>
                                        )}
                                        {currentGame.categories && currentGame.categories.length > 0 ? (
                                            currentGame.categories.map((category, index) => (
                                                <span key={index} className="SelectedGames-Carousel-Content-Item-Info-Genre">{category}</span>
                                            ))
                                        ) : (
                                            <div>Sin categoría</div>
                                        )}
                                    </div>
                                    <div className="SelectedGames-Carousel-Content-Item-Info-Description Margin-bottom">{currentGame.short_description}</div>
                                </div>
                                <div className="Flex-center-div Space-Between">
                                    <div className="Flex-center-div Space-Between SelectedGames-Carousel-Content-Item-Info-Recommendations">
                                        {currentGame.total_recommendations}
                                        <FaThumbsUp className="Margin-left-small"/>
                                    </div>
                                    <div className="SelectedGames-Carousel-Content-Item-Info-Price">
                                        {currentGame.min_price}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <button onClick={goNext} className="SelectedGames-Carousel-Arrow"><FaAngleRight /></button>
                </div>
            )}

            <div className="SelectedGames-Carousel-Lines">
                {games.map((_, index) => (
                    <button
                        key={index}
                        className={`SelectedGames-Carousel-Lines-Line ${index === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Ver juego ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SelectedGames;
