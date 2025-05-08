import "../style/Searchbar.css";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {EuiFieldSearch, EuiSpacer} from "@elastic/eui";
import axios from "axios";

const Searchbar = () => {
    const [fieldSearchQuery, setFieldSearchQuery] = useState('');
    const [fieldSearchResults, setFieldSearchResults] = useState([]);

    const handleFieldSearchQuery = async (e) => {
        const query = e.target.value;
        setFieldSearchQuery(query);

        if (query === '') {
            setFieldSearchResults([]);
            return;
        }

        try {
            const response = await axios.post('http://localhost:9200/theeasteregg_games_index/_search', {
                size: 5,
                query: {
                    multi_match: {
                        query: query,
                        fields: [
                            "name",
                            "data.developers",
                            "data.publishers"
                        ],
                        analyzer: "ngram_analyzer",
                        minimum_should_match: "75%"
                    }
                },
                sort: [
                    { "_score": "desc" },
                    { "data.total_recommendations": "desc" },
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
            <div className="Searchbar-FieldSearch-Container">
                <EuiFieldSearch
                    className="Searchbar-FieldSearch"
                    placeholder="Buscar..."
                    value={fieldSearchQuery}
                    onChange={handleFieldSearchQuery}
                    isClearable
                    fullWidth
                />
                <div className="Searchbar-FieldSearch-Results">
                    {fieldSearchResults.length > 0 && (
                        <div>
                            {fieldSearchResults.map(({ _id, name, min_price, capsule_image }) => (
                                <Link to={`/game/${_id}`} key={_id} className="Searchbar-FieldSearch-Link">
                                    <div className="Searchbar-FieldSearch-Result Flex-center-div">
                                        <img src={capsule_image} alt={name} className="Searchbar-FieldSearch-Result-Image"/>
                                        <div className="Searchbar-FieldSearch-Result-Info">
                                            <h3>{name}</h3>
                                            <div className="Searchbar-FieldSearch-Result-Info-Price">
                                                <p>{min_price}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="Searchbar-FieldSearch-Result-Hr"/>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Searchbar;