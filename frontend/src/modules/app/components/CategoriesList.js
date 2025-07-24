import "../style/CategoriesList.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { EuiFieldSearch } from "@elastic/eui";
import Searchbar from "./Searchbar";

const REACT_APP_ELASTICSEARCH_URL = process.env.REACT_APP_ELASTICSEARCH_URL;

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const BATCH_SIZE = 1000;
    const SCROLL_TIMEOUT = '1m';

    useEffect(() => {
        const fetchAllWithScroll = async (indexName, setStateCallback) => {
            try {
                let allHits = [];

                const firstResponse = await axios.post(
                    `${REACT_APP_ELASTICSEARCH_URL}/${indexName}/_search?scroll=${SCROLL_TIMEOUT}`,
                    {
                        size: BATCH_SIZE,
                        query: { match_all: {} },
                        sort: [{ "name.keyword": { order: "asc" } }],
                        _source: ["name"]
                    }
                );

                let scrollId = firstResponse.data._scroll_id;
                let hits = firstResponse.data.hits.hits;
                allHits.push(...hits);

                while (hits.length > 0) {
                    const scrollResponse = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/_search/scroll`, {
                        scroll: SCROLL_TIMEOUT,
                        scroll_id: scrollId
                    });

                    scrollId = scrollResponse.data._scroll_id;
                    hits = scrollResponse.data.hits.hits;
                    allHits.push(...hits);
                }

                const items = allHits.map(hit => ({ _id: hit._id, name: hit._source.name }));
                setStateCallback(items);
            } catch (error) {
                console.error(`Error fetching ${indexName}:`, error);
            }
        };

        fetchAllWithScroll("theeasteregg_categories_index", setCategories);
        fetchAllWithScroll("theeasteregg_genres_index", setGenres);
    }, []);

    const groupByInitial = (items) => {
        const grouped = {};
        items.forEach(item => {
            const initial = item.name[0].toUpperCase();
            if (!grouped[initial]) grouped[initial] = [];
            grouped[initial].push(item);
        });
        return grouped;
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredGenres = genres.filter(gen =>
        gen.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedCategories = groupByInitial(filteredCategories);
    const groupedGenres = groupByInitial(filteredGenres);

    return (
        <div className="CategoriesList Content">
            <Searchbar />

            <EuiFieldSearch
                className="CategoriesList-FieldSearch"
                placeholder="Buscar categorías o géneros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isClearable
                fullWidth
            />

            <div className="CategoriesList-Container Flex-start-div Margin-top">
                <div className="CategoriesList-Container-Column">
                    <h1 className="Margin-bottom">Categorías</h1>
                    {Object.entries(groupedCategories).map(([letter, items]) => (
                        <div key={letter}>
                            <div className="CategoriesList-Container-Column-Capital">{letter}</div>
                            {items.map(category => (
                                <Link key={category._id} to={{ pathname: "/advanced-search", search: `?category=${encodeURIComponent(category.name)}` }} className="Formatted-Link">
                                    <div className="CategoriesList-Container-Column-Item">
                                        {category.name}
                                    </div>
                                </Link>
                            ))}
                            <br/>
                        </div>
                    ))}
                </div>

                <div className="CategoriesList-Container-Column">
                    <h1 className="Margin-bottom">Géneros</h1>
                    {Object.entries(groupedGenres).map(([letter, items]) => (
                        <div key={letter}>
                            <div className="CategoriesList-Container-Column-Capital">{letter}</div>
                            {items.map(genre => (
                                <Link key={genre._id} to={{ pathname: "/advanced-search", search: `?genre=${encodeURIComponent(genre.name)}` }} className="Formatted-Link">
                                    <div className="CategoriesList-Container-Column-Item">
                                        {genre.name}
                                    </div>
                                </Link>
                            ))}
                            <br/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesList;
