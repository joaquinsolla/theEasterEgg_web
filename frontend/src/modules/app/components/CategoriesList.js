import "../style/CategoriesList.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { EuiFieldSearch } from "@elastic/eui";
import Searchbar from "./Searchbar";

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_categories_index/_search', {
                    query: { match_all: {} },
                    sort: [{ "name.keyword": { order: "asc" } }],
                    _source: ["name"],
                });
                const hits = response.data.hits.hits;
                setCategories(hits.map(hit => ({ _id: hit._id, name: hit._source.name })));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchGenres = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_genres_index/_search', {
                    query: { match_all: {} },
                    sort: [{ "name.keyword": { order: "asc" } }],
                    _source: ["name"],
                });
                const hits = response.data.hits.hits;
                setGenres(hits.map(hit => ({ _id: hit._id, name: hit._source.name })));
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchCategories();
        fetchGenres();
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
