import "../style/CategoriesList.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { EuiFieldSearch } from "@elastic/eui";
import Searchbar from "./Searchbar";

const REACT_APP_ELASTICSEARCH_URL = process.env.REACT_APP_ELASTICSEARCH_URL;

const CategoriesList = () => {
    const [developers, setDevelopers] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const SCROLL_TIMEOUT = '1m';
    const BATCH_SIZE = 1000;

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

        fetchAllWithScroll("theeasteregg_developers_index", setDevelopers);
        fetchAllWithScroll("theeasteregg_publishers_index", setPublishers);
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

    const filteredDevelopers = developers.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredPublishers = publishers.filter(gen =>
        gen.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedDevelopers = groupByInitial(filteredDevelopers);
    const groupedPublishers = groupByInitial(filteredPublishers);

    return (
        <div className="CategoriesList Content">
            <Searchbar />

            <EuiFieldSearch
                className="CategoriesList-FieldSearch"
                placeholder="Buscar desarrolladores o publishers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isClearable
                fullWidth
            />

            <div className="CategoriesList-Container Flex-start-div Margin-top">
                <div className="CategoriesList-Container-Column">
                    <h1 className="Margin-bottom">Desarrolladores</h1>
                    {Object.entries(groupedDevelopers).map(([letter, items]) => (
                        <div key={letter}>
                            <div className="CategoriesList-Container-Column-Capital">{letter}</div>
                            {items.map(developer => (
                                <Link key={developer._id} to={{ pathname: "/advanced-search", search: `?developer=${encodeURIComponent(developer.name)}` }} className="Formatted-Link">
                                    <div className="CategoriesList-Container-Column-Item">
                                        {developer.name}
                                    </div>
                                </Link>
                            ))}
                            <br/>
                        </div>
                    ))}
                </div>

                <div className="CategoriesList-Container-Column">
                    <h1 className="Margin-bottom">Publishers</h1>
                    {Object.entries(groupedPublishers).map(([letter, items]) => (
                        <div key={letter}>
                            <div className="CategoriesList-Container-Column-Capital">{letter}</div>
                            {items.map(publisher => (
                                <Link key={publisher._id} to={{ pathname: "/advanced-search", search: `?publisher=${encodeURIComponent(publisher.name)}` }} className="Formatted-Link">
                                    <div className="CategoriesList-Container-Column-Item">
                                        {publisher.name}
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
