import "../style/GameDetails.css";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { FaThumbsUp, FaAnglesDown, FaAnglesUp, FaCheck, FaXmark, FaLink } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { ReactComponent as SteamIcon } from "../../common/assets/svg/steam.svg";
import { ReactComponent as XboxIcon } from "../../common/assets/svg/xbox.svg";
import { ReactComponent as EpicIcon } from "../../common/assets/svg/epic.svg";
import { ReactComponent as BattleIcon } from "../../common/assets/svg/battle.svg";
import { ReactComponent as GogIcon } from "../../common/assets/svg/gog.svg";
import Metacritic from '../../common/assets/metacritic.webp';

import Pegi3 from '../../common/assets/pegi/PEGI_3.webp';
import Pegi7 from '../../common/assets/pegi/PEGI_7.webp';
import Pegi12 from '../../common/assets/pegi/PEGI_12.webp';
import Pegi16 from '../../common/assets/pegi/PEGI_16.webp';
import Pegi18 from '../../common/assets/pegi/PEGI_18.webp';

import PegiBadLanguage from '../../common/assets/pegi/bad-language.webp';
import PegiDicrimination from '../../common/assets/pegi/discrimination.webp';
import PegiDrugs from '../../common/assets/pegi/drugs.webp';
import PegiFear from '../../common/assets/pegi/fear.webp';
import PegiGambling from '../../common/assets/pegi/gambling.webp';
import PegiInGamePurchases from '../../common/assets/pegi/in-game-purchases.webp';
import PegiSexualContent from '../../common/assets/pegi/sexual-content.webp';
import PegiViolence from '../../common/assets/pegi/violence.webp';

import Searchbar from "./Searchbar";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {useSelector} from "react-redux";
import users from "../../users";

const GameDetails = () => {
    const { appid } = useParams();
    const [game, setGame] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);

    //region Description overflow
    const [isDescriptionOverflowing, setIsDescriptionOverflowing] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const descriptionRef = useRef(null);

    useEffect(() => {
        if (game?.data?.about_the_game && descriptionRef.current) {
            const element = descriptionRef.current;
            const maxHeight = window.innerHeight * 0.5;
            setIsDescriptionOverflowing(element.scrollHeight > maxHeight);
        }
    }, [game]);

    const toggleDescriptionExpand = () => setIsDescriptionExpanded(prev => !prev);
    //endregion

    //region Requirements overflow
    const [isRequirementsOverflowing, setIsRequirementsOverflowing] = useState(false);
    const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(false);
    const requirementsRef = useRef(null);

    useEffect(() => {
        if (requirementsRef.current) {
            const element = requirementsRef.current;
            const maxHeight = window.innerHeight * 0.2;
            setIsRequirementsOverflowing(element.scrollHeight > maxHeight);
        }
    }, [game]);

    const toggleRequirementsExpand = () => setIsRequirementsExpanded(prev => !prev);
    //endregion

    //region Fetch game
    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_games_index/_search', {
                    size: 1,
                    query: {
                        term: {
                            "appid": parseInt(appid)
                        }
                    },
                    _source: ["name", "data", "stores", "metacritic"]
                });

                const hits = response.data.hits.hits;

                if (hits.length > 0) {
                    if (hits[0]._source.stores.steam.availability) hits[0]._source.stores.steam.price_in_euros = hits[0]._source.stores.steam.price_in_cents === 0 ? "Gratis" : `${(hits[0]._source.stores.steam.price_in_cents / 100).toFixed(2)} €`;
                    else hits[0]._source.stores.steam.price_in_euros = "No disponible"
                    if (hits[0]._source.stores.epic.availability) hits[0]._source.stores.epic.price_in_euros = hits[0]._source.stores.epic.price_in_cents === 0 ? "Gratis" : `${(hits[0]._source.stores.epic.price_in_cents / 100).toFixed(2)} €`;
                    else hits[0]._source.stores.epic.price_in_euros = "No disponible"
                    if (hits[0]._source.stores.xbox.availability) {
                        const xboxPrice = hits[0]._source.stores.xbox.price_in_cents;
                        hits[0]._source.stores.xbox.price_in_euros =
                            xboxPrice === 0
                                ? "Gratis"
                                : xboxPrice === -2
                                    ? "Solo en Battle Pass"
                                    : `${(xboxPrice / 100).toFixed(2)} €`;
                    } else hits[0]._source.stores.xbox.price_in_euros = "No disponible"
                    if (hits[0]._source.stores.battle.availability) hits[0]._source.stores.battle.price_in_euros = hits[0]._source.stores.battle.price_in_cents === 0 ? "Gratis" : `${(hits[0]._source.stores.battle.price_in_cents / 100).toFixed(2)} €`;
                    else hits[0]._source.stores.battle.price_in_euros = "No disponible"
                    if (hits[0]._source.stores.gog.availability) hits[0]._source.stores.gog.price_in_euros = hits[0]._source.stores.gog.price_in_cents === 0 ? "Gratis" : `${(hits[0]._source.stores.gog.price_in_cents / 100).toFixed(2)} €`;
                    else hits[0]._source.stores.gog.price_in_euros = "No disponible"

                    if (hits[0]._source.data?.pc_requirements?.minimum === '<strong>Minimum:</strong><br><ul class="bb_ul"></ul>') hits[0]._source.data.pc_requirements.minimum = '<i>Sin Información</i>'
                    if (hits[0]._source.data?.pc_requirements?.recommended === '<strong>Recommended:</strong><br><ul class="bb_ul"></ul>') hits[0]._source.data.pc_requirements.recommended = '<i>Sin Información</i>'
                    if (hits[0]._source.data?.mac_requirements?.minimum === '<strong>Minimum:</strong><br><ul class="bb_ul"></ul>') hits[0]._source.data.mac_requirements.minimum = '<i>Sin Información</i>'
                    if (hits[0]._source.data?.mac_requirements?.recommended === '<strong>Recommended:</strong><br><ul class="bb_ul"></ul>') hits[0]._source.data.mac_requirements.recommended = '<i>Sin Información</i>'
                    if (hits[0]._source.data?.linux_requirements?.minimum === '<strong>Minimum:</strong><br><ul class="bb_ul"></ul>') hits[0]._source.data.linux_requirements.minimum = '<i>Sin Información</i>'
                    if (hits[0]._source.data?.linux_requirements?.recommended === '<strong>Recommended:</strong><br><ul class="bb_ul"></ul>') hits[0]._source.data.linux_requirements.recommended = '<i>Sin Información</i>'

                    const timestamp = hits[0]._source.data.release_date.date;
                    const date = new Date(timestamp * 1000);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
                    const year = date.getFullYear();
                    if (hits[0]._source.data.release_date.date) hits[0]._source.data.release_date.date_string = `${day}/${month}/${year}`;
                    else hits[0]._source.data.release_date.date_string = "Sin información"

                    if (hits[0]._source.metacritic.score) {
                        if (hits[0]._source.metacritic.score >= 75) hits[0]._source.metacritic.color = '#66cc33';
                        else if (hits[0]._source.metacritic.score < 75 && hits[0]._source.metacritic.score >= 50) hits[0]._source.metacritic.color = '#ffcc33';
                        else hits[0]._source.metacritic.color = '#ff0000';
                    }

                    if (hits[0]._source.data.pegi.rating !== null){
                        switch (hits[0]._source.data.pegi.rating) {
                            case "3":
                                hits[0]._source.data.pegi.rating_image = Pegi3;
                                break;
                            case "7":
                                hits[0]._source.data.pegi.rating_image = Pegi7;
                                break;
                            case "12":
                                hits[0]._source.data.pegi.rating_image = Pegi12;
                                break;
                            case "16":
                                hits[0]._source.data.pegi.rating_image = Pegi16;
                                break;
                            case "18":
                                hits[0]._source.data.pegi.rating_image = Pegi18;
                                break;
                            default:
                                hits[0]._source.data.pegi.rating_image = Pegi3;
                                break;
                        }
                    }
                    if (hits[0]._source.data.pegi.descriptors !== null) {
                        hits[0]._source.data.pegi.descriptors_list = hits[0]._source.data.pegi.descriptors
                            .split(/,|\r?\n/)              // divide por coma o salto de línea
                            .map(s => s.trim())            // elimina espacios alrededor
                            .filter(s => s.length > 0);

                        const descriptors = hits[0]._source.data.pegi.descriptors.toLowerCase();
                        const descriptors_images = [];

                        const checks = [
                            { keywords: ["bad", "language"], file: PegiBadLanguage },
                            { keywords: ["discrimination"], file: PegiDicrimination },
                            { keywords: ["drugs"], file: PegiDrugs },
                            { keywords: ["fear"], file: PegiFear },
                            { keywords: ["gambling"], file: PegiGambling },
                            { keywords: ["purchase", "purchases"], file: PegiInGamePurchases },
                            { keywords: ["sex", "sexual"], file: PegiSexualContent },
                            { keywords: ["extreme", "violence"], file: PegiViolence },
                        ];

                        checks.forEach(({ keywords, file }) => {
                            if (keywords.some(word => descriptors.includes(word))) {
                                descriptors_images.push(file);
                            }
                        });

                        hits[0]._source.data.pegi.descriptors_images = descriptors_images;
                    }

                    setGame(hits[0]._source);
                }

            } catch (error) {
                console.error("Error fetching game details:", error);
            }
        };

        fetchGameDetails();
    }, [appid]);
    //endregion

    //region Fetch prices history
    const [pricesHistory, setPricesHistory] = useState([]);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_prices_history_index/_search', {
                    size: 1,
                    query: {
                        term: {
                            "appid": parseInt(appid)
                        }
                    },
                    _source: ["steam", "epic", "xbox", "battle", "gog"]
                });

                const hits = response.data.hits.hits;

                if (hits.length > 0) {
                    const data = hits[0]._source;

                    // Procesar los precios
                    const allPrices = [];
                    const platforms = [
                        {key: 'steam', value: 'Steam'},
                        {key: 'epic', value: 'Epic Games'},
                        {key: 'xbox', value: 'Xbox'},
                        {key: 'battle', value: 'Battle.net'},
                        {key: 'gog', value: 'GOG.com'},
                    ];

                    platforms.forEach(platform => {
                        const prices = data[platform["key"]] || [];
                        prices.forEach(entry => {
                            const date = new Date(entry.price_time * 1000);
                            const formattedDate = date.toLocaleDateString('es-ES'); // "dd/MM/yyyy"
                            allPrices.push({
                                date: formattedDate,
                                price_in_euros: entry.price_in_cents / 100,
                                platform: platform["value"]
                            });
                        });
                    });

                    // Agrupar por fecha y quedarse con el precio más bajo
                    const groupedByDate = {};

                    allPrices.forEach(({ date, price_in_euros, platform }) => {
                        if (!groupedByDate[date] || price_in_euros < groupedByDate[date].price_in_euros) {
                            groupedByDate[date] = {
                                price_in_euros,
                                price_time: date,
                                platform
                            };
                        }
                    });

                    const prices_history = Object.values(groupedByDate);
                    console.log(prices_history);
                    setPricesHistory(prices_history);
                }

            } catch (error) {
                console.error("Error fetching game prices history:", error);
            }
        };

        fetchGameDetails();
    }, [appid]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 rounded shadow text-sm border border-gray-200">
                    <p><strong>Fecha:</strong> {data.price_time}</p>
                    <p><strong>Precio:</strong> {data.price_in_euros.toFixed(2)}€</p>
                    <p><strong>Plataforma:</strong> {data.platform}</p>
                </div>
            );
        }

        return null;
    };

    const allowedTicks = [pricesHistory[0]?.price_time, pricesHistory[pricesHistory.length - 1]?.price_time];
    const CustomXAxisTick = ({ x, y, payload, index, allowedTicks }) => {
        if (payload && (payload.value === allowedTicks[0] || payload.value === allowedTicks[allowedTicks.length - 1])) {
            return (
                <text x={x} y={y + 15} textAnchor="middle" fill="#FFFFFF" fontSize={12}>
                    {payload.value}
                </text>
            );
        }
        return null;
    };

    //endregion

    //region Manage media
    useEffect(() => {
        if (game) {
            const firstScreenshot = game.data.screenshots?.[0];
            const firstMovie = game.data.movies?.[0];

            if (firstMovie) {
                setSelectedMedia({ type: "video", id: firstMovie.id });
            } else if (firstScreenshot) {
                setSelectedMedia({ type: "image", src: firstScreenshot });
            }
        }
    }, [game]);

    const renderMainMedia = () => {
        if (!selectedMedia) return null;

        if (selectedMedia.type === "image") {
            return <img className="GameDetails-MainInfo-DisplayingMedia GameDetails-MainInfo-DisplayingMedia-Image Margin-bottom-small" src={selectedMedia.src} />;
        }

        if (selectedMedia.type === "video") {
            const videoUrl = `http://video.akamai.steamstatic.com/store_trailers/${selectedMedia.id}/movie480.mp4`;
            return (
                <video className="GameDetails-MainInfo-DisplayingMedia GameDetails-MainInfo-DisplayingMedia-Video Margin-bottom-small" src={videoUrl} controls autoPlay muted/>
            );
        }

        return null;
    };

    const renderThumbnails = () => {
        const thumbnails = [];

        if (game.data.movies) {
            thumbnails.push(
                ...game.data.movies.map((movie) => ({
                    type: "video",
                    src: movie.thumbnail,
                    id: movie.id,
                    key: `video-${movie.id}`,
                }))
            );
        }

        if (game.data.screenshots) {
            thumbnails.push(
                ...game.data.screenshots.map((url, i) => ({
                    type: "image",
                    src: url,
                    key: `screenshot-${i}`,
                }))
            );
        }

        return thumbnails.map((media) => (
            <img key={media.key} className="GameDetails-MainInfo-Thumbnail" src={media.src}
                onClick={() =>
                    setSelectedMedia(
                        media.type === "video"
                            ? { type: "video", id: media.id }
                            : { type: "image", src: media.src }
                    )
                }
            />
        ));
    };
    //endregion

    //region Favorite
    const user = useSelector(users.selectors.getUser);
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const [favoriteGameIds, setFavoriteGameIds] = useState([]);
    const isFavorite = favoriteGameIds.includes(Number(appid));

    useEffect(() => {
        if (user?.id) {
            fetch(`/theeasteregg_web/api/users/${user.id}/favorites`)
                .then(res => {
                    if (!res.ok) throw new Error("Error fetching favorites");
                    return res.json();
                })
                .then(setFavoriteGameIds)
                .catch(console.error);
        }
    }, [user]);

    const handleAddFavorite = () => {
        if (!user?.id) return;

        fetch(`/theeasteregg_web/api/users/${user.id}/addFavorite/${appid}`, {
            method: "POST",
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al añadir a favoritos");
                setFavoriteGameIds(prev => [...prev, Number(appid)]);
            })
            .catch(console.error);
    };

    const handleRemoveFavorite = () => {
        if (!user?.id) return;

        fetch(`/theeasteregg_web/api/users/${user.id}/removeFavorite/${appid}`, {
            method: "POST",
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al quitar de favoritos");
                setFavoriteGameIds(prev => prev.filter(id => id !== Number(appid)));
            })
            .catch(console.error);
    };
    //endregion

    return (
        <>
            {game ? (
                <div className="GameDetails Content" style={{backgroundImage: `var(--background-image-opacity-2), url(${game.data.background_raw})`}}>
                    <Searchbar />
                    <div className="Flex-center-div Space-Between">
                        <h1 className="Margin-bottom-small">{game.name}&nbsp;{ game.data.release_date.year !== null && (<span className="GameDetails-Year">{game.data.release_date.year}</span>)}</h1>
                        {isLoggedIn ? (
                            <>
                                {isFavorite ? (
                                    <div className="Flex-center-div" onClick={handleRemoveFavorite} style={{ cursor: 'pointer' }}>
                                        <span className="GameDetails-Liked-Text Margin-right">En la lista de deseados</span>
                                        <FaHeart className="GameDetails-Liked" />
                                    </div>
                                ) : (
                                    <div className="Flex-center-div" onClick={handleAddFavorite} style={{ cursor: 'pointer' }}>
                                        <span className="GameDetails-Liked-Text Margin-right">Añadir a la lista de deseados</span>
                                        <FaRegHeart className="GameDetails-NoLiked" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link to="/login" className="Link-simple">
                                <div className="Flex-center-div" onClick={handleAddFavorite} style={{ cursor: 'pointer' }}>
                                    <span className="GameDetails-Liked-Text Margin-right">Añadir a la lista de deseados</span>
                                    <FaRegHeart className="GameDetails-NoLiked" />
                                </div>
                            </Link>
                        )}

                    </div>
                    <div className="GameDetails-Year-Recommendations Flex-center-div Margin-bottom-small">
                        Recomendaciones: {game.data.total_recommendations}
                        <FaThumbsUp className="Margin-left-small"/>
                    </div>
                    <div className="Flex-start-div">
                        <div className="GameDetails-MainInfo">
                            <div className="GameDetails-MainInfo-Media Margin-bottom">
                                {renderMainMedia()}
                                <div className="GameDetails-MainInfo-Thumbnails-Container">{renderThumbnails()}</div>
                            </div>
                            <div className="GameDetails-MainInfo-Description-Container Margin-bottom">
                                <h2 className="Margin-bottom-small">Acerca del juego</h2>
                                <div
                                    ref={descriptionRef}
                                    className={`GameDetails-MainInfo-Description Margin-bottom ${isDescriptionOverflowing && !isDescriptionExpanded ? 'clamped' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: game?.data?.about_the_game }}
                                />
                                {isDescriptionOverflowing && (
                                    <div onClick={toggleDescriptionExpand} className="GameDetails-MainInfo-Description-ShowMoreButton">
                                        {isDescriptionExpanded ? <div className="Flex-center-div"><FaAnglesUp />&nbsp;Mostrar menos</div> : <div className="Flex-center-div"><FaAnglesDown />&nbsp;Mostrar más</div>}
                                    </div>
                                )}
                            </div>
                            <div className="GameDetails-MainInfo-Requirements Margin-bottom">
                                <div
                                    ref={requirementsRef}
                                    className={`GameDetails-MainInfo-Requirements-Expandible ${isRequirementsOverflowing && !isRequirementsExpanded ? 'clamped' : ''}`}
                                >
                                    <h2 className="Margin-bottom-small">Requisitos</h2>
                                    <div className="GameDetails-MainInfo-GameDetails-MainInfo-Requirements-Container">
                                        <h3>Windows</h3>
                                        <div className="Flex-start-div Margin-bottom-small">
                                            <div
                                                className="GameDetails-MainInfo-GameDetails-MainInfo-Requirements-Item Margin-bottom"
                                                dangerouslySetInnerHTML={{ __html: game.data?.pc_requirements?.minimum }}
                                            />
                                            <div
                                                className="GameDetails-MainInfo-GameDetails-MainInfo-Requirements-Item Margin-bottom"
                                                dangerouslySetInnerHTML={{ __html: game.data?.pc_requirements?.recommended }}
                                            />
                                        </div>
                                    </div>
                                    <div className="GameDetails-MainInfo-GameDetails-MainInfo-Requirements-Container">
                                        <h3>Mac</h3>
                                        <div className="Flex-start-div Margin-bottom-small">
                                            <div
                                                className="GameDetails-MainInfo-GameDetails-MainInfo-Requirements-Item Margin-bottom"
                                                dangerouslySetInnerHTML={{ __html: game.data?.mac_requirements?.minimum }}
                                            />
                                            <div
                                                className="GameDetails-MainInfo-GameDetails-MainInfo-Requirements-Item Margin-bottom"
                                                dangerouslySetInnerHTML={{ __html: game.data?.mac_requirements?.recommended }}
                                            />
                                        </div>
                                    </div>
                                    <div className="GameDetails-MainInfo-GameDetails-MainInfo-Requirements-Container">
                                        <h3>Linux</h3>
                                        <div className="Flex-start-div Margin-bottom-small">
                                            <div
                                                className="GameDetails-MainInfo-GameDetails-MainInfo-Requirements-Item Margin-bottom"
                                                dangerouslySetInnerHTML={{ __html: game.data?.linux_requirements?.minimum }}
                                            />
                                            <div
                                                className="GameDetails-MainInfo-GameDetails-MainInfo-Requirements-Item Margin-bottom"
                                                dangerouslySetInnerHTML={{ __html: game.data?.linux_requirements?.recommended }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {isRequirementsOverflowing && (
                                    <div onClick={toggleRequirementsExpand} className="GameDetails-MainInfo-Description-ShowMoreButton">
                                        {isRequirementsExpanded ? <div className="Flex-center-div"><FaAnglesUp />&nbsp;Mostrar menos</div> : <div className="Flex-center-div"><FaAnglesDown />&nbsp;Mostrar más</div>}
                                    </div>
                                )}
                            </div>
                            <div className="GameDetails-MainInfo-Languages Margin-bottom">
                                <h2 className="Margin-bottom-small">Idiomas soportados</h2>
                                <div className="GameDetails-MainInfo-GameDetails-MainInfo-Languages-Container">
                                    <div className="GameDetails-MainInfo-GameDetails-MainInfo-Languages-Languages Margin-bottom-small"
                                         dangerouslySetInnerHTML={{ __html: game.data?.supported_languages }}
                                    />
                                </div>
                            </div>
                            <div className="GameDetails-MainInfo-LegalInfo Margin-bottom" dangerouslySetInnerHTML={{ __html: game.data?.legal_notice }}/>
                        </div>
                        <div className="GameDetails-SecondaryInfo">
                            <img className="GameDetails-SecondaryInfo-HeaderImage Margin-bottom" src={game.data.header_image} />
                            <div className="Margin-bottom">
                                <h2 className="Margin-bottom-small">Tabla de precios</h2>
                                <div className="GameDetails-SecondaryInfo-PricesTable">
                                    <a href={game.stores.steam.availability === true ? game.stores.steam.url : undefined} target="_blank">
                                        <div className="GameDetails-SecondaryInfo-PricesTable-Row-First Flex-center-div Space-Between">
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Store Flex-center-div">
                                                <SteamIcon className="Prices-Svg Margin-right-small"/><h4>Steam</h4>
                                            </div>
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Price">
                                                <h4>{game.stores.steam.price_in_euros}</h4>
                                            </div>
                                        </div>
                                    </a>
                                    <a href={game.stores.epic.availability === true ? game.stores.epic.url : undefined} target="_blank">
                                        <div className="GameDetails-SecondaryInfo-PricesTable-Row Flex-center-div Space-Between">
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Store Flex-center-div">
                                                <EpicIcon className="Prices-Svg Margin-right-small"/><h4>Epic Games</h4>
                                            </div>
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Price">
                                                <h4>{game.stores.epic.price_in_euros}</h4>
                                            </div>
                                        </div>
                                    </a>
                                    <a href={game.stores.xbox.availability === true ? game.stores.xbox.url : undefined} target="_blank">
                                        <div className="GameDetails-SecondaryInfo-PricesTable-Row Flex-center-div Space-Between">
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Store Flex-center-div">
                                                <XboxIcon className="Prices-Svg Margin-right-small"/><h4>Xbox</h4>
                                            </div>
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Price">
                                                <h4>{game.stores.xbox.price_in_euros}</h4>
                                            </div>
                                        </div>
                                    </a>
                                    <a href={game.stores.battle.availability === true ? game.stores.battle.url : undefined} target="_blank">
                                        <div className="GameDetails-SecondaryInfo-PricesTable-Row Flex-center-div Space-Between">
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Store Flex-center-div">
                                                <BattleIcon className="Prices-Svg Margin-right-small"/><h4>Battle.net</h4>
                                            </div>
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Price">
                                                <h4>{game.stores.battle.price_in_euros}</h4>
                                            </div>
                                        </div>
                                    </a>
                                    <a href={game.stores.gog.availability === true ? game.stores.gog.url : undefined} target="_blank">
                                        <div className="GameDetails-SecondaryInfo-PricesTable-Row-Last Flex-center-div Space-Between">
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Store Flex-center-div">
                                                <GogIcon className="Prices-Svg Margin-right-small"/><h4>GOG.com</h4>
                                            </div>
                                            <div className="GameDetails-SecondaryInfo-PricesTable-Price">
                                                <h4>{game.stores.gog.price_in_euros}</h4>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            {pricesHistory.length > 0 && (
                                <div className="Margin-bottom">
                                    <h2 className="Margin-bottom-small">Historial de precios</h2>
                                    <div className="GameDetails-SecondaryInfo-Section GameDetails-SecondaryInfo-PricesHistory">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={pricesHistory}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <CartesianGrid
                                                    stroke="#FFFFFF"
                                                    strokeDasharray="3 3"
                                                    vertical={true}
                                                    horizontal={true}
                                                />
                                                <XAxis
                                                    dataKey="price_time"
                                                    tick={(props) => <CustomXAxisTick {...props} allowedTicks={allowedTicks} />}
                                                    ticks={allowedTicks}
                                                    stroke="#FFFFFF"
                                                />
                                                <YAxis
                                                    domain={[0, 'auto']}
                                                    unit="€"
                                                    stroke="#FFFFFF"
                                                />
                                                <Tooltip
                                                    content={<CustomTooltip />}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="price_in_euros"
                                                    stroke="#61a2ff"
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                            <div className="Margin-bottom">
                                <h2 className="Margin-bottom-small">Información</h2>
                                <div className="GameDetails-SecondaryInfo-Section">
                                    <div className="Margin-bottom-small">
                                        <span><b>Título:&nbsp;</b>{game.name}</span>
                                    </div>
                                    <div className="Margin-bottom-small">
                                        { game.data.release_date.coming_soon ? (
                                            <span><b>Lanzamiento:&nbsp;</b>Próximamente</span>
                                        ) : (
                                            <span><b>Lanzamiento:&nbsp;</b>{game.data.release_date.date_string}</span>
                                        )}
                                    </div>
                                    <div className="Margin-bottom-small">
                                        { game.data.website && (
                                            <span><b>Web oficial:</b><br/>
                                                <a href={game.data.website} target="_blank" className="CenteredLink">
                                                    {game.data.website}&nbsp;<FaLink />
                                                </a>
                                            </span>
                                        )}
                                    </div>
                                    <div className="Margin-bottom-small">
                                        <span>
                                          <b>Desarrolladores:</b><br />
                                            {game.data.developers.map((dev, index) => (
                                                <Link key={index} to={{ pathname: "/advanced-search", search: `?developer=${encodeURIComponent(dev)}` }} className="Formatted-Link-Blue">
                                                    <div key={index}>{dev}</div>
                                                </Link>
                                            ))}
                                        </span>
                                    </div>
                                    <div>
                                        <span>
                                            <b>Publishers:</b><br />
                                                {game.data.publishers.map((pub, index) => (
                                                    <Link key={index} to={{ pathname: "/advanced-search", search: `?publisher=${encodeURIComponent(pub)}` }} className="Formatted-Link-Blue">
                                                        <div key={index}>{pub}</div>
                                                    </Link>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            { game.metacritic.score && (
                                <a href={game.metacritic.url} target="_blank">
                                    <div className="GameDetails-SecondaryInfo-Section Margin-bottom Flex-center-div">
                                        <div className="GameDetails-SecondaryInfo-Metacritic-Grade Margin-right" style={{ backgroundColor: game.metacritic.color }}>
                                            {game.metacritic.score}
                                        </div>
                                        <img src={Metacritic} className="Margin-right GameDetails-SecondaryInfo-Metacritic-Image" />
                                    </div>
                                </a>
                            ) }
                            <div className="Margin-bottom">
                                <div className="GameDetails-SecondaryInfo-Section">
                                    <div className="Margin-bottom-small">
                                        <span><b>Géneros:</b></span>
                                    </div>
                                    <div className="Margin-bottom">
                                        {game.data.genres.map((genre, index) => (
                                            <Link key={index} to={{ pathname: "/advanced-search", search: `?genre=${encodeURIComponent(genre)}` }} className="Formatted-Link">
                                                <div className="GameDetails-SecondaryInfo-ListItem" key={index}>{genre}</div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="Margin-bottom-small">
                                        <span><b>Categorías:</b></span>
                                    </div>
                                    <div className="">
                                        {game.data.categories.map((category, index) => (
                                            <Link key={index} to={{ pathname: "/advanced-search", search: `?category=${encodeURIComponent(category)}` }} className="Formatted-Link">
                                                <div className="GameDetails-SecondaryInfo-ListItem" key={index}>{category}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="Margin-bottom">
                                <div className="GameDetails-SecondaryInfo-Section">
                                    <div className="Margin-bottom-small">
                                        <span><b>Sistemas Operativos:</b></span>
                                    </div>
                                    <div>
                                        { game.data.availability_windows ? (
                                            <div className="GameDetails-SecondaryInfo-SO Flex-center-div">
                                                <FaCheck />&nbsp;Windows
                                            </div>
                                        ) : (
                                            <div className="GameDetails-SecondaryInfo-SO-disabled Flex-center-div">
                                                <FaXmark />&nbsp;Windows
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        { game.data.availability_mac ? (
                                            <div className="GameDetails-SecondaryInfo-SO Flex-center-div">
                                                <FaCheck />&nbsp;Mac
                                            </div>
                                        ) : (
                                            <div className="GameDetails-SecondaryInfo-SO-disabled Flex-center-div">
                                                <FaXmark />&nbsp;Mac
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        { game.data.availability_linux ? (
                                            <div className="GameDetails-SecondaryInfo-SO Flex-center-div">
                                                <FaCheck />&nbsp;Linux
                                            </div>
                                        ) : (
                                            <div className="GameDetails-SecondaryInfo-SO-disabled Flex-center-div">
                                                <FaXmark />&nbsp;Linux
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            { (game.data.pegi.rating !== null) && (
                                <div className="Margin-bottom">
                                    <div className="GameDetails-SecondaryInfo-Section">
                                        <div className="Margin-bottom-small Flex-start-div">
                                            <img className="GameDetails-SecondaryInfo-Pegi-RatingImage Margin-right-small" src={game.data.pegi.rating_image}/>
                                            { (game.data.pegi.descriptors !== null) && (
                                                <div>
                                                    {game.data.pegi.descriptors_list.map((desc, index) => (
                                                        <div className="GameDetails-SecondaryInfo-Pegi-Descriptor" key={index}>{desc}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        { (game.data.pegi.descriptors !== null) && (
                                            <div>
                                                {game.data.pegi.descriptors_images.map((img, index) => (
                                                    <img className="GameDetails-SecondaryInfo-Pegi-DescriptorImage Margin-right-small" key={index} src={img}/>
                                                ))}
                                            </div>
                                        )}
                                        <div className="Text-center Margin-top-small">
                                            <a href="https://pegi.info/" target="_blank" className="CenteredLink">
                                                <b>PEGI.info</b>&nbsp;<FaLink />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                </>
            )}
        </>
    );
};

export default GameDetails;
