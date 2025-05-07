import React, { useState } from 'react';
import { EuiFieldSearch, EuiSpacer } from '@elastic/eui';
import axios from 'axios';

import "../style/App.css";
import Searchbar from "./Searchbar";  // Si necesitas tus propios estilos, este archivo sigue siendo útil

const Home = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    // Función para manejar la búsqueda
    const handleSearch = async (e) => {
        setQuery(e.target.value);

        if (e.target.value === '') {
            setResults([]); // Si no hay query, vaciar resultados
            return;
        }

        try {
            const response = await axios.post('http://localhost:9200/theeasteregg_games_index/_search', {
                query: {
                    match: { name: e.target.value },
                },
            });

            // Extraer los nombres de los resultados
            const hits = response.data.hits.hits;
            const names = hits.map((hit) => hit._source.name);

            setResults(names);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResults([]);
        }
    };

    return (
            <div className="Content">
                    <Searchbar />
                    <p>-----</p>
                    {/* Barra de búsqueda */}
                    <EuiFieldSearch
                        placeholder="Buscar por nombre"
                        value={query}
                        onChange={handleSearch}
                        isClearable
                    />

                    {/* Espaciado */}
                    <EuiSpacer size="m" />

                    {/* Mostrar los resultados debajo */}
                    {results.length > 0 && (
                        <div>
                            {results.map((name, index) => (
                                <p key={index}>{name}</p>
                            ))}
                        </div>
                    )}


            </div>
    );
};

export default Home;
