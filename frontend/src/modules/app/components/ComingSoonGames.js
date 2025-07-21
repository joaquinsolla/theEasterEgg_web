import "../style/FreeGames.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {FaPlus } from "react-icons/fa6";
import {Link} from "react-router-dom";

const REACT_APP_ELASTICSEARCH_URL = process.env.REACT_APP_ELASTICSEARCH_URL;

const ComingSoonGames = () => {
    const [comingSoonGames, setComingSoonGames] = useState([]);

    useEffect(() => {
        const fetchComingSoonGames = async () => {
            try {
                const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                    size: 5,
                    query: {
                        bool: {
                            must: [
                                { term: { "data.release_date.coming_soon": true } },
                            ],
                        }
                    },
                    sort: [
                        { "data.total_recommendations": { order: "desc" } }
                    ],
                    _source: ["name", "data.header_image", "stores"]
                });

                const hits = response.data.hits.hits;

                const comingSoonGames = hits.map(hit => {

                    return {
                        _id: hit._id,
                        name: hit._source.name,
                        header_image: hit._source.data?.header_image,
                    };
                });

                setComingSoonGames(comingSoonGames);
            } catch (error) {
                console.error("Error fetching coming soon games:", error);
            }
        };

        fetchComingSoonGames();
    }, []);


    return (
        <div className="FreeGames Margin-bottom">
            <div className="FreeGames-List Margin-bottom">
                {comingSoonGames.map((game, index) => (
                    <Link to={`/game/${game._id}`} key={game._id} className="Formatted-Link">
                        <div className="FreeGames-List-Item" key={index}>
                            <img className="FreeGames-List-Item-Image" src={game.header_image} />
                            <div className="FreeGames-List-Item-Info">
                                <h4 className="Margin-bottom-small">{game.name}</h4>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <Link to={{pathname: "/advanced-search", search: "?coming_soon=true"}} className="Formatted-Link">
                <div className="FreeGames-SeeMore">
                    <FaPlus className="Margin-right-small"/><h4>Ver más</h4>
                </div>
            </Link>
        </div>
    );
};

export default ComingSoonGames;
