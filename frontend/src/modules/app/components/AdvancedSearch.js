import "../style/AdvancedSearch.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactComponent as SteamIcon } from "./svg/steam.svg";
import { ReactComponent as XboxIcon } from "./svg/xbox.svg";
import { ReactComponent as EpicIcon } from "./svg/epic.svg";
import { ReactComponent as BattleIcon } from "./svg/battle.svg";
import { ReactComponent as GogIcon } from "./svg/gog.svg";
import { MdCancel } from "react-icons/md";
import Searchbar from "./Searchbar";
import {
    EuiFieldSearch,
    EuiDualRange ,
    EuiComboBox,
    EuiFlexGroup,
    EuiFlexItem,
    EuiCard,
    EuiSelectable,
    EuiButton,
    EuiCheckbox,
    EuiSelect
} from '@elastic/eui';


const AdvancedSearch = () => {
    const [games, setGames] = useState([]);

    /*** Name ***/
    const [searchTerm, setSearchTerm] = useState('');

    /*** Platforms ***/
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const platformOptions = [
        { label: 'Steam', value: 'steam' },
        { label: 'Epic Games', value: 'epic' },
        { label: 'Xbox', value: 'xbox' },
        { label: 'Battle.net', value: 'battle' },
        { label: 'GOG.com', value: 'gog' }
    ];
    const platformIcons = {
        "Steam": <div className="Flex-center-div"><SteamIcon className="Filter-Platform-Svg" /></div>,
        "Xbox": <div className="Flex-center-div"><XboxIcon className="Filter-Platform-Svg" /></div>,
        "Epic Games": <div className="Flex-center-div"><EpicIcon className="Filter-Platform-Svg" /></div>,
        "Battle.net": <div className="Flex-center-div"><BattleIcon className="Filter-Platform-Svg" /></div>,
        "GOG.com": <div className="Flex-center-div"><GogIcon className="Filter-Platform-Svg" /></div>
    };

    /*** Price ***/
    const [priceRange, setPriceRange] = useState([0, 110]);
    const [isFreeChecked, setIsFreeChecked] = useState(false);

    /*** Genres ***/
    const [genresOptions, setGenresOptions] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    /*** Fetch genres for the combo box ***/
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_genres_index/_search', {
                    query: { match_all: {} },
                    sort: [{ "name.keyword": { order: "asc" } }],
                    _source: ["name"],
                    size: 10000
                });
                const hits = response.data.hits.hits;
                const options = hits.map(hit => ({
                    label: hit._source.name
                }));
                setGenresOptions(options);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchGenres();
    }, []);

    /*** Categories ***/
    const [categoriesOptions, setCategoriesOptions] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    /*** Fetch categories for the combo box ***/
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_categories_index/_search', {
                    query: { match_all: {} },
                    sort: [{ "name.keyword": { order: "asc" } }],
                    _source: ["name"],
                    size: 10000
                });
                const hits = response.data.hits.hits;
                const options = hits.map(hit => ({
                    label: hit._source.name
                }));
                setCategoriesOptions(options);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    /*** Developers ***/
    const [developersOptions, setDevelopersOptions] = useState([]);
    const [selectedDevelopers, setSelectedDevelopers] = useState([]);
    /*** Fetch developers for the combo box ***/
    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_developers_index/_search', {
                    query: { match_all: {} },
                    sort: [{ "name.keyword": { order: "asc" } }],
                    _source: ["name"],
                    size: 10000
                });
                const hits = response.data.hits.hits;
                const options = hits.map(hit => ({
                    label: hit._source.name
                }));
                setDevelopersOptions(options);
            } catch (error) {
                console.error("Error fetching developers:", error);
            }
        };

        fetchDevelopers();
    }, []);

    /*** Publishers ***/
    const [publishersOptions, setPublishersOptions] = useState([]);
    const [selectedPublishers, setSelectedPublishers] = useState([]);
    /*** Fetch publishers for the combo box ***/
    useEffect(() => {
        const fetchPublishers = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_publishers_index/_search', {
                    query: { match_all: {} },
                    sort: [{ "name.keyword": { order: "asc" } }],
                    _source: ["name"],
                    size: 10000
                });
                const hits = response.data.hits.hits;
                const options = hits.map(hit => ({
                    label: hit._source.name
                }));
                setPublishersOptions(options);
            } catch (error) {
                console.error("Error fetching publishers:", error);
            }
        };

        fetchPublishers();
    }, []);

    /*** OS ***/
    const [isSoWindowsChecked, setIsSoWindowsChecked] = useState(false);
    const [isSoMacChecked, setIsSoMacChecked] = useState(false);
    const [isSoLinuxChecked, setIsSoLinuxChecked] = useState(false);

    /*** PEGI ***/
    const [pegiOptions, setPegiOptions] = useState([]);
    const [selectedPegis, setSelectedPegis] = useState([]);
    /*** Fetch PEGIs for the combo box ***/
    useEffect(() => {
        const fetchPegis = async () => {
            try {
                const response = await axios.post('http://localhost:9200/theeasteregg_pegi_index/_search', {
                    query: { match_all: {} },
                    sort: [{ "name.keyword": { order: "asc" } }],  // Este sort ya no es necesario, pero no molesta
                    _source: ["name"],
                    size: 10000
                });

                const pegis = response.data.hits.hits
                    .map(hit => hit._source.name)
                    .sort((a, b) => {
                        const parseA = isNaN(a) ? -1 : parseInt(a, 10);
                        const parseB = isNaN(b) ? -1 : parseInt(b, 10);
                        return parseB - parseA;
                    })
                    .map(name => ({
                        label: name,
                        value: name
                    }));

                setPegiOptions(pegis);
            } catch (error) {
                console.error("Error fetching PEGI data:", error);
            }
        };

        fetchPegis();
    }, []);

    /*** Release year ***/
    const [releaseYearFrom, setReleaseYearFrom] = useState('');
    const [releaseYearTo, setReleaseYearTo] = useState('');
    const yearOptions = [{ value: '', text: 'Seleccionar...' }];
    const currentYear = new Date().getFullYear();
    for (let y = 1990; y <= currentYear; y++) {
        yearOptions.push({ value: y.toString(), text: y.toString() });
    }

    /*** Fetch games based on filters ***/
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const must = [];
                const filter = [];

                /*** Name ***/
                if (searchTerm) {
                    must.push({
                        multi_match: {
                            query: searchTerm,
                            fields: ["name"],
                            analyzer: "ngram_analyzer",
                            minimum_should_match: "75%"
                        }
                    });
                }

                /*** Platforms ***/
                if (selectedPlatforms.length > 0) {
                    const platformShould = selectedPlatforms.map(platform => ({
                        term: {
                            [`stores.${platform.value}.availability`]: true
                        }
                    }));
                    filter.push({
                        bool: {
                            should: platformShould,
                            minimum_should_match: 1
                        }
                    });
                }

                /*** Price ***/
                if (isFreeChecked) {
                    filter.push({
                        bool: {
                            should: [
                                { range: { "stores.steam.price_in_cents": { lte: 0 } } },
                                { range: { "stores.epic.price_in_cents": { lte: 0 } } },
                                { range: { "stores.xbox.price_in_cents": { lte: 0 } } },
                                { range: { "stores.battle.price_in_cents": { lte: 0 } } },
                                { range: { "stores.gog.price_in_cents": { lte: 0 } } }
                            ],
                            minimum_should_match: 1
                        }
                    });
                }
                else {
                    if (priceRange[0] > 0 || priceRange[1] < 110) {
                        filter.push({
                            bool: {
                                should: [
                                    { range: { "stores.steam.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } },
                                    { range: { "stores.epic.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } },
                                    { range: { "stores.xbox.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } },
                                    { range: { "stores.battle.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } },
                                    { range: { "stores.gog.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } }
                                ],
                                minimum_should_match: 1
                            }
                        });
                    }
                }

                /*** Genres ***/
                if (selectedGenres.length > 0) {
                    must.push({
                        terms: {
                            "data.genres.keyword": selectedGenres.map(genre => genre.label)
                        }
                    });
                }

                /*** Categories ***/
                if (selectedCategories.length > 0) {
                    must.push({
                        terms: {
                            "data.categories.keyword": selectedCategories.map(category => category.label)
                        }
                    });
                }

                /*** Developers ***/
                if (selectedDevelopers.length > 0) {
                    must.push({
                        terms: {
                            "data.developers.keyword": selectedDevelopers.map(developer => developer.label)
                        }
                    });
                }

                /*** Publishers ***/
                if (selectedPublishers.length > 0) {
                    must.push({
                        terms: {
                            "data.publishers.keyword": selectedPublishers.map(publisher => publisher.label)
                        }
                    });
                }

                /*** SO ***/
                const osFilters = [];
                if (isSoWindowsChecked) {
                    osFilters.push({ term: { "data.availability_windows": true } });
                }
                if (isSoMacChecked) {
                    osFilters.push({ term: { "data.availability_mac": true } });
                }
                if (isSoLinuxChecked) {
                    osFilters.push({ term: { "data.availability_linux": true } });
                }
                if (osFilters.length > 0) {
                    must.push({
                        bool: {
                            should: osFilters,
                            minimum_should_match: 1
                        }
                    });
                }

                /*** PEGI ***/
                if (selectedPegis.length > 0) {
                    must.push({
                        terms: {
                            "data.pegi.rating": selectedPegis.map(pegi => pegi.label)
                        }
                    });
                }

                /*** Release year ***/
                if (releaseYearFrom || releaseYearTo) {
                    const rangeQuery = {};
                    if (releaseYearFrom) {
                        rangeQuery.gte = parseInt(releaseYearFrom);
                    }
                    if (releaseYearTo) {
                        rangeQuery.lte = parseInt(releaseYearTo);
                    }
                    filter.push({
                        range: {
                            "data.release_date.year": rangeQuery
                        }
                    });
                }

                /*** RESPONSE ***/
                const response = await axios.post('http://localhost:9200/theeasteregg_games_index/_search', {
                    query: {
                        bool: {
                            must,
                            filter
                        }
                    },
                    _source: ["name", "data.header_image", "stores"],
                    size: 100
                });

                const hits = response.data.hits.hits;
                const gamesData = hits.map(hit => {
                    const stores = hit._source.stores || {};
                    const prices = Object.values(stores)
                        .filter(store => store && store.availability && store.price_in_cents != null)
                        .map(store => store.price_in_cents);
                    const minPrice = prices.length > 0 ? Math.min(...prices) / 100 : null;

                    return {
                        id: hit._id,
                        name: hit._source.name,
                        image: hit._source.data?.header_image,
                        price: minPrice
                    };
                });

                setGames(gamesData);
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };

        fetchGames();
    }, [searchTerm, selectedPlatforms, priceRange, isFreeChecked, selectedGenres, selectedCategories,
        selectedDevelopers, selectedPublishers, isSoWindowsChecked, isSoMacChecked, isSoLinuxChecked,
        selectedPegis, releaseYearFrom, releaseYearTo]);

    return (
        <div className="AdvancedSearch Content">
            <Searchbar />

            <div className="Flex-start-div">
                <div className="AdvancedSearch-Filters">
                    <h1 className="Margin-bottom">Búsqueda avanzada</h1>
                    <div id="Name" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <EuiFieldSearch
                            className="AdvancedSearch-Filters-EuiFieldSearch"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            isClearable
                            fullWidth
                        />
                    </div>
                    <div id="Platforms" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom-small">Plataformas</h4>
                            {selectedPlatforms.length > 0 && (
                                <MdCancel className="ClearFilter-Button" onClick={() => setSelectedPlatforms([])}/>
                            )}
                        </div>
                        <EuiSelectable
                            searchable={false}
                            options={platformOptions.map(p => ({
                                label: p.label,
                                checked: selectedPlatforms.some(sp => sp.label === p.label) ? 'on' : undefined,
                                prepend: platformIcons[p.label] || null  // Aquí usamos prepend en lugar de append
                            }))}
                            onChange={(options) => {
                                const selected = options.filter(o => o.checked === 'on');
                                setSelectedPlatforms(
                                    selected.map(o => {
                                        const match = platformOptions.find(p => p.label === o.label);
                                        return { label: o.label, value: match?.value || '' };
                                    })
                                );
                            }}
                            listProps={{ bordered: true }}
                            fullWidth
                        >
                            {(list) => <>{list}</>}
                        </EuiSelectable>
                    </div>
                    <div id="Price" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom-small">
                                {isFreeChecked ? "Rango de precios: Gratis" : `Rango de precios: ${priceRange[0]}€ - ${priceRange[1]}€`}
                            </h4>
                            {(isFreeChecked || priceRange[0] !== 0 || priceRange[1] !== 110) && (
                                <MdCancel
                                    className="ClearFilter-Button"
                                    onClick={() => {
                                        setPriceRange([0, 110]);
                                        setIsFreeChecked(false);
                                    }}
                                />
                            )}
                        </div>
                        <EuiDualRange
                            min={0}
                            max={110}
                            step={1}
                            value={[priceRange[0], priceRange[1]]}
                            onChange={(value) => {
                                if (Array.isArray(value)) {
                                    setPriceRange(value.map(Number));
                                }
                            }}
                            showLabels
                            tickInterval={Math.ceil(110 / 5)}
                            fullWidth
                            disabled={isFreeChecked}

                        />
                        <EuiCheckbox
                            id="freeGamesCheckbox"
                            label="Solo juegos gratis"
                            checked={isFreeChecked}
                            onChange={(e) => setIsFreeChecked(e.target.checked)}
                            className="Margin-bottom-small"
                        />
                    </div>
                    <div id="Genres" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom-small">Géneros</h4>
                        </div>
                        <EuiComboBox
                            placeholder="Seleccionar..."
                            options={genresOptions}
                            selectedOptions={selectedGenres}
                            onChange={setSelectedGenres}
                            isClearable
                        />
                    </div>
                    <div id="Categories" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom-small">Categorías</h4>
                        </div>
                        <EuiComboBox
                            placeholder="Seleccionar..."
                            options={categoriesOptions}
                            selectedOptions={selectedCategories}
                            onChange={setSelectedCategories}
                            isClearable
                        />
                    </div>
                    <div id="Developers" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom-small">Desarrolladores</h4>
                        </div>
                        <EuiComboBox
                            placeholder="Seleccionar..."
                            options={developersOptions}
                            selectedOptions={selectedDevelopers}
                            onChange={setSelectedDevelopers}
                            isClearable
                        />
                    </div>
                    <div id="Publishers" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom-small">Publishers</h4>
                        </div>
                        <EuiComboBox
                            placeholder="Seleccionar..."
                            options={publishersOptions}
                            selectedOptions={selectedPublishers}
                            onChange={setSelectedPublishers}
                            isClearable
                        />
                    </div>
                    <div id="OS" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom-small">Sistemas operativos</h4>
                            {(isSoWindowsChecked || isSoMacChecked || isSoLinuxChecked ) && (
                                <MdCancel
                                    className="ClearFilter-Button"
                                    onClick={() => {
                                        setIsSoWindowsChecked(false);
                                        setIsSoMacChecked(false);
                                        setIsSoLinuxChecked(false);
                                    }}
                                />
                            )}
                        </div>
                        <EuiCheckbox
                            id="soWindowsCheckbox"
                            label="Windows"
                            checked={isSoWindowsChecked}
                            onChange={(e) => setIsSoWindowsChecked(e.target.checked)}
                        />
                        <EuiCheckbox
                            id="soMacCheckbox"
                            label="Mac"
                            checked={isSoMacChecked}
                            onChange={(e) => setIsSoMacChecked(e.target.checked)}
                        />
                        <EuiCheckbox
                            id="soLinuxCheckbox"
                            label="Linux"
                            checked={isSoLinuxChecked}
                            onChange={(e) => setIsSoLinuxChecked(e.target.checked)}
                            className="Margin-bottom-small"
                        />
                    </div>
                    <div id="ReleaseYear" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom">Lanzamiento</h4>
                            {(releaseYearFrom !== '' || releaseYearTo !== '' ) && (
                                <MdCancel
                                    className="ClearFilter-Button"
                                    onClick={() => {
                                        setReleaseYearFrom('');
                                        setReleaseYearTo('');
                                    }}
                                />
                            )}
                        </div>
                        <div className="Margin-bottom">
                            <p className="Margin-bottom-small">Año desde:</p>
                            <EuiSelect
                                options={yearOptions}
                                value={releaseYearFrom}
                                onChange={(e) => setReleaseYearFrom(e.target.value)}
                                aria-label="Año desde"
                            />
                        </div>
                        <div>
                            <p className="Margin-bottom-small">Año hasta:</p>
                            <EuiSelect
                                options={yearOptions}
                                value={releaseYearTo}
                                onChange={(e) => setReleaseYearTo(e.target.value)}
                                aria-label="Año hasta"
                            />
                        </div>
                    </div>
                    <div id="PEGI" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom-small">PEGI</h4>
                            {( selectedPegis.length > 0 ) && (
                                <MdCancel
                                    className="ClearFilter-Button"
                                    onClick={() => {
                                        setSelectedPegis([]);
                                    }}
                                />
                            )}
                        </div>
                        {pegiOptions.map((option) => {
                            const isChecked = selectedPegis.some((pegi) => pegi.value === option.value);
                            const handleChange = (e) => {
                                if (e.target.checked) {
                                    setSelectedPegis([...selectedPegis, option]);
                                } else {
                                    setSelectedPegis(selectedPegis.filter((pegi) => pegi.value !== option.value));
                                }
                            };
                            return (
                                <EuiCheckbox
                                    key={option.value}
                                    id={`pegi-${option.value}`}
                                    label={option.label}
                                    checked={isChecked}
                                    onChange={handleChange}
                                    className="Margin-bottom-small"
                                />
                            );
                        })}
                    </div>

                    <EuiButton
                        size="s"
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedPlatforms([]);
                            setPriceRange([0, 110]);
                            setIsFreeChecked(false);
                            setSelectedGenres([]);
                            setSelectedCategories([]);
                            setSelectedDevelopers([]);
                            setSelectedPublishers([]);
                            setIsSoWindowsChecked(false);
                            setIsSoMacChecked(false);
                            setIsSoLinuxChecked(false);
                            setSelectedPegis([]);
                            setReleaseYearFrom('');
                            setReleaseYearTo('');
                        }}
                        className="ResetFilter-Button"
                    >
                        Reiniciar filtros
                    </EuiButton >

                </div>

                <div className="AdvancedSearch-Results">
                    <EuiFlexGroup gutterSize="l" wrap>
                        {games.map(game => (
                            <EuiFlexItem key={game.id} grow={false} style={{ width: 300 }}>
                                <EuiCard
                                    image={game.image}
                                    title={game.name}
                                    description={game.price != null ? `Desde ${game.price.toFixed(2)} €` : 'Precio no disponible'}
                                />
                            </EuiFlexItem>
                        ))}
                    </EuiFlexGroup>
                </div>
            </div>

        </div>
    );
};

export default AdvancedSearch;
