import "../style/Searchbar.css";
import React, {useState} from "react";
import {Link, useNavigate } from "react-router-dom";
import {EuiFieldSearch} from "@elastic/eui";
import axios from "axios";
import { BsFillLightningFill } from "react-icons/bs";

const REACT_APP_ELASTICSEARCH_URL = process.env.REACT_APP_ELASTICSEARCH_URL;

const Searchbar = () => {
    const [fieldSearchQuery, setFieldSearchQuery] = useState('');
    const [fieldSearchResults, setFieldSearchResults] = useState([]);
    const navigate = useNavigate();

    const handleFieldSearchSubmit = () => {
        if (fieldSearchQuery.trim() !== '') {
            navigate(`/advanced-search?search_term=${encodeURIComponent(fieldSearchQuery.trim())}`);
        }
    };


    const handleFieldSearchQuery = async (e) => {
        const query = e.target.value;
        setFieldSearchQuery(query);

        if (query === '') {
            setFieldSearchResults([]);
            return;
        }

        try {
            const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                size: 5,
                query: {
                    bool: {
                        must: [
                            {
                                multi_match: {
                                    query: query,
                                    fields: ["name"],
                                    analyzer: "ngram_analyzer",
                                    minimum_should_match: "75%"
                                }
                            },
                            { exists: { field: "data.capsule_image" } },
                            { exists: { field: "data.header_image" } }
                        ]
                    }
                },
                sort: [
                    { "_score": "desc" },
                    { "data.total_recommendations": "desc" }
                ],
                _source: ["name", "data.capsule_image", "stores"]
            });

            const hits = response.data.hits.hits;

            const results = hits.map(hit => {
                // Calculo precio minimo
                let min_price = "No disponible";
                let steam = null;
                let epic = null;
                let xbox = null;
                let battle = null;
                let gog = null;

                if (hit._source.stores?.steam?.availability) steam = hit._source.stores?.steam?.price_in_cents;
                if (hit._source.stores?.epic?.availability) epic = hit._source.stores?.epic?.price_in_cents;
                if (hit._source.stores?.xbox?.availability) xbox = hit._source.stores?.xbox?.price_in_cents;
                if (hit._source.stores?.battle?.availability) battle = hit._source.stores?.battle?.price_in_cents;
                if (hit._source.stores?.gog?.availability) gog = hit._source.stores?.gog?.price_in_cents;

                const validPrices = [steam, epic, xbox, battle, gog].filter(p => p !== null && p >= 0);


                if (validPrices.length > 0) {
                    const rawMin = Math.min(...validPrices);
                    min_price = rawMin === 0 ? "Gratis" : `${(rawMin / 100).toFixed(2)}€`;
                }

                return {
                    _id: hit._id,
                    name: hit._source.name,
                    min_price: min_price,
                    capsule_image: hit._source.data?.capsule_image
                };
            }).filter(Boolean);

            setFieldSearchResults(results);
        } catch (error) {
            console.error('Error fetching data:', error);
            setFieldSearchResults([]);
        }
    };

    return (
        <div>
            <div className="Searchbar">
                <div className="Searchbar-separator Not-displayed"></div>
                <Link to="/platforms-list" className="Link-simple">
                    <p>Plataformas</p>
                </Link>
                <div className="Searchbar-separator"></div>
                <Link to="/categories-list" className="Link-simple">
                    <p>Categorías</p>
                </Link>
                <div className="Searchbar-separator"></div>
                <Link to="/developers-list" className="Link-simple">
                    <p>Desarrolladores</p>
                </Link>
                <div className="Searchbar-separator Not-displayedOnSmall"></div>
                <Link to="/advanced-search" className="Link-simple Flex-center-div HideOnSmall">
                    <BsFillLightningFill />
                    <p>&nbsp;Búsqueda avanzada</p>
                </Link>
                <div className="Searchbar-FieldSearch-Container HideOnSmall">
                    <EuiFieldSearch
                        className="Searchbar-FieldSearch"
                        placeholder="Buscar..."
                        value={fieldSearchQuery}
                        onChange={handleFieldSearchQuery}
                        isClearable
                        fullWidth
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFieldSearchSubmit();
                            }
                        }}
                    />
                    <div className="Searchbar-FieldSearch-Results">
                        {fieldSearchResults.length > 0 && (
                            <div>
                                {fieldSearchResults.map(({ _id, name, min_price, capsule_image }) => (
                                    <Link to={`/game/${_id}`} key={_id} className="Searchbar-FieldSearch-Link">
                                        <div className="Searchbar-FieldSearch-Result Flex-center-div">
                                            <img src={capsule_image} alt={name} className="Searchbar-FieldSearch-Result-Image"/>
                                            <div className="Searchbar-FieldSearch-Result-Info">
                                                <h4>{name}</h4>
                                                <div className="Searchbar-FieldSearch-Result-Info-Price">
                                                    <p>{min_price}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="Searchbar-FieldSearch-Result-Hr"/>
                                    </Link>
                                ))}
                                <Link to="/advanced-search" className="Searchbar-FieldSearch-Link">
                                    <div className="Searchbar-FieldSearch-Link-AdvancedSearch">
                                        <div className="Flex-center-div">
                                            <BsFillLightningFill />
                                            &nbsp;Búsqueda avanzada
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="Searchbar-Small HideOnBigToFlex">
                <div className="Searchbar-separator Not-displayed"></div>
                <Link to="/advanced-search" className="Link-simple Flex-center-div">
                    <BsFillLightningFill />
                    <p>&nbsp;Búsqueda avanzada</p>
                </Link>
                <div className="Searchbar-FieldSearch-Container">
                    <EuiFieldSearch
                        className="Searchbar-FieldSearch"
                        placeholder="Buscar..."
                        value={fieldSearchQuery}
                        onChange={handleFieldSearchQuery}
                        isClearable
                        fullWidth
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFieldSearchSubmit();
                            }
                        }}
                    />
                    <div className="Searchbar-FieldSearch-Results">
                        {fieldSearchResults.length > 0 && (
                            <div>
                                {fieldSearchResults.map(({ _id, name, min_price, capsule_image }) => (
                                    <Link to={`/game/${_id}`} key={_id} className="Searchbar-FieldSearch-Link">
                                        <div className="Searchbar-FieldSearch-Result Flex-center-div">
                                            <img src={capsule_image} alt={name} className="Searchbar-FieldSearch-Result-Image"/>
                                            <div className="Searchbar-FieldSearch-Result-Info">
                                                <h4>{name}</h4>
                                                <div className="Searchbar-FieldSearch-Result-Info-Price">
                                                    <p>{min_price}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="Searchbar-FieldSearch-Result-Hr"/>
                                    </Link>
                                ))}
                                <Link to="/advanced-search" className="Searchbar-FieldSearch-Link">
                                    <div className="Searchbar-FieldSearch-Link-AdvancedSearch">
                                        <div className="Flex-center-div">
                                            <BsFillLightningFill />
                                            &nbsp;Búsqueda avanzada
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Searchbar;