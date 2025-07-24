import "../style/AdvancedSearch.css";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as SteamIcon } from "../../common/assets/svg/steam.svg";
import { ReactComponent as XboxIcon } from "../../common/assets/svg/xbox.svg";
import { ReactComponent as EpicIcon } from "../../common/assets/svg/epic.svg";
import { ReactComponent as BattleIcon } from "../../common/assets/svg/battle.svg";
import { ReactComponent as GogIcon } from "../../common/assets/svg/gog.svg";
import { MdCancel } from "react-icons/md";
import Searchbar from "./Searchbar";
import { CgDisplayGrid } from "react-icons/cg";
import { MdViewList } from "react-icons/md";
import { LuLoader } from "react-icons/lu";
import {FaAnglesDown, FaAnglesUp, FaPlus} from "react-icons/fa6";
import {
    EuiFieldSearch,
    EuiDualRange ,
    EuiComboBox,
    EuiSelectable,
    EuiButton,
    EuiCheckbox,
    EuiSelect
} from '@elastic/eui';
import {Link} from "react-router-dom";

const REACT_APP_ELASTICSEARCH_URL = process.env.REACT_APP_ELASTICSEARCH_URL;

const AdvancedSearch = () => {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(100);
    const step = 50;

    //region Filter constants
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
    const [isFreeChecked, setIsFreeChecked] = useState(false)
    const [isNotFreeChecked, setIsNotFreeChecked] = useState(false);

    /*** Genres ***/
    const [genresOptions, setGenresOptions] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    /*** Fetch genres for the combo box ***/
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_genres_index/_search`, {
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
                const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_categories_index/_search`, {
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
                const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_developers_index/_search`, {
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
                const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_publishers_index/_search`, {
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
                const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_pegi_index/_search`, {
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
    const [isComingSoonChecked, setIsComingSoonChecked] = useState(false)
    const yearOptions = [{ value: '', text: 'Seleccionar...' }];
    const currentYear = new Date().getFullYear();
    for (let y = 1990; y <= currentYear; y++) {
        yearOptions.push({ value: y.toString(), text: y.toString() });
    }

    /*** Sorting ***/
    const [sortOption, setSortOption] = useState('relevance');
    const getSortedGames = () => {
        return [...games].sort((a, b) => {
            switch (sortOption) {
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'name_desc':
                    return b.name.localeCompare(a.name);
                case 'min_price_asc':
                    return (a.min_price ?? Infinity) - (b.min_price ?? Infinity);
                case 'min_price_desc':
                    return (b.min_price ?? 0) - (a.min_price ?? 0);
                case 'release_date_asc':
                    return (a.release_date ?? Infinity) - (b.release_date ?? Infinity);
                case 'release_date_desc':
                    return (b.release_date ?? 0) - (a.release_date ?? 0);
                case 'relevance':
                default:
                    return 0;
            }
        });
    };

    /*** View ***/
    const [viewList, setViewList] = useState(false);
    //endregion

    //region URL params
    /*** Fetch filters from URL params ***/
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);

        // --- Platform ---
        const platformParam = params.get('platform');
        if (platformParam) {
            const match = platformOptions.find(p => p.value === platformParam);
            if (match) {
                setSelectedPlatforms([{ label: match.label, value: match.value }]);
            }
        }

        // --- Genre ---
        const genreParam = params.get('genre');
        if (genreParam && genresOptions.length > 0) {
            const match = genresOptions.find(c => c.label.toLowerCase() === genreParam.toLowerCase());
            if (match) {
                setSelectedGenres([match]);
            }
        }

        // --- Category ---
        const categoryParam = params.get('category');
        if (categoryParam && categoriesOptions.length > 0) {
            const match = categoriesOptions.find(c => c.label.toLowerCase() === categoryParam.toLowerCase());
            if (match) {
                setSelectedCategories([match]);
            }
        }

        // --- Developer ---
        const developerParam = params.get('developer');
        if (developerParam && developersOptions.length > 0) {
            const match = developersOptions.find(c => c.label.toLowerCase() === developerParam.toLowerCase());
            if (match) {
                setSelectedDevelopers([match]);
            }
        }

        // --- Publisher ---
        const publisherParam = params.get('publisher');
        if (publisherParam && publishersOptions.length > 0) {
            const match = publishersOptions.find(c => c.label.toLowerCase() === publisherParam.toLowerCase());
            if (match) {
                setSelectedPublishers([match]);
            }
        }

        // --- Free ---
        const freeParam = params.get('free');
        if (freeParam && freeParam === "true") {
            setIsFreeChecked(true);
        }

        // --- Coming soon ---
        const comingSoonParam = params.get('coming_soon');
        if (comingSoonParam && comingSoonParam === "true") {
            setIsComingSoonChecked(true);
        }

        // --- Search term ---
        const searchTermParam = params.get('search_term');
        if (searchTermParam && searchTermParam.length > 0) {
            setSearchTerm(searchTermParam);
        }

    }, [location.search, categoriesOptions, genresOptions, developersOptions, publishersOptions]);
    //endregion

    //region Fetch games based on filters
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setIsLoading(true);

                const must = [];
                const filter = [];

                //region Query filters
                /*** Name ***/
                if (searchTerm) {
                    must.push({
                        multi_match: {
                            query: searchTerm,
                            fields: ["name"],
                            analyzer: "ngram_analyzer",
                            minimum_should_match: "85%"
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
                                {
                                    bool: {
                                        must: [
                                            { range: { "stores.xbox.price_in_cents": { lte: 0 } } }
                                        ],
                                        must_not: [
                                            { term: { "stores.xbox.price_in_cents": -2 } }
                                        ]
                                    }
                                },
                                { range: { "stores.battle.price_in_cents": { lte: 0 } } },
                                { range: { "stores.gog.price_in_cents": { lte: 0 } } }
                            ],
                            minimum_should_match: 1
                        }
                    });
                } else {
                    const storePriceRanges = [
                        { range: { "stores.steam.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } },
                        { range: { "stores.epic.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } },
                        { range: { "stores.xbox.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } },
                        { range: { "stores.battle.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } },
                        { range: { "stores.gog.price_in_cents": { gte: priceRange[0] * 100, lte: priceRange[1] * 100 } } }
                    ];
                    if (isNotFreeChecked) {
                        filter.push({
                            bool: {
                                must_not: [
                                    {
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
                                    }
                                ]
                            }
                        });
                    }
                    if (priceRange[0] > 0 || priceRange[1] < 110) {
                        filter.push({
                            bool: {
                                should: storePriceRanges,
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
                if (isComingSoonChecked) {
                    filter.push({
                        term: {
                            "data.release_date.coming_soon": true
                        }
                    });
                } else if (releaseYearFrom || releaseYearTo) {
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

                //endregion

                /*** RESPONSE ***/
                must.push({ exists: { field: "data.capsule_image" } });
                must.push({ exists: { field: "data.header_image" } });
                const response = await axios.post(`${REACT_APP_ELASTICSEARCH_URL}/theeasteregg_games_index/_search`, {
                    query: {
                        bool: {
                            must,
                            filter
                        }
                    },
                    size: visibleCount,
                    _source: ["name", "data.header_image", "stores", "data.release_date.coming_soon", "data.capsule_image", "data.release_date.date"],
                });

                const hits = response.data.hits.hits;
                const gamesData = hits.map(hit => {
                    const stores = hit._source.stores || {};

                    const prices = Object.values(stores).filter(store => store && store.availability && store.price_in_cents != null).map(store => store.price_in_cents);
                    const minPrice = prices.length > 0 ? Math.min(...prices) / 100 : null;
                    const maxPrice = prices.length > 0 ? Math.max(...prices) / 100 : null;

                    const coming_soon = hit._source.data.release_date.coming_soon;

                    return {
                        id: hit._id,
                        name: hit._source.name,
                        header_image: hit._source.data?.header_image,
                        min_price: minPrice,
                        max_price: maxPrice,
                        availability_steam: stores.steam?.availability ?? false,
                        availability_epic: stores.epic?.availability ?? false,
                        availability_xbox: stores.xbox?.availability ?? false,
                        availability_battle: stores.battle?.availability ?? false,
                        availability_gog: stores.gog?.availability ?? false,
                        coming_soon: coming_soon,
                        capsule_image: hit._source.data?.capsule_image,
                        release_date: hit._source.data?.release_date.date,
                    };
                });
                setGames(gamesData);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();

    }, [searchTerm, selectedPlatforms, priceRange, isFreeChecked, isNotFreeChecked, selectedGenres,
        selectedCategories, selectedDevelopers, selectedPublishers, isSoWindowsChecked, isSoMacChecked,
        isSoLinuxChecked, selectedPegis, releaseYearFrom, releaseYearTo, viewList, visibleCount, isComingSoonChecked]);
    //endregion

    return (
        <div className="AdvancedSearch Content">
            <Searchbar />
            <h1 className="Margin-bottom HideOnBigToBlock">Búsqueda avanzada</h1>

            <div className="Flex-start-div">
                <div className="AdvancedSearch-Filters HideOnSmall">
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
                                {isFreeChecked ? "Rango de precios: Gratis" : `Rango de precios: ${priceRange[0]}€ ~ ${priceRange[1]}€`}
                            </h4>
                            {(isFreeChecked || isNotFreeChecked || priceRange[0] !== 0 || priceRange[1] !== 110) && (
                                <MdCancel
                                    className="ClearFilter-Button"
                                    onClick={() => {
                                        setPriceRange([0, 110]);
                                        setIsFreeChecked(false);
                                        setIsNotFreeChecked(false);
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
                            className="AdvancedSearch-Filter"
                        />
                        <EuiCheckbox
                            id="freeGamesCheckbox"
                            label="Mostrar solo juegos gratis"
                            checked={isFreeChecked}
                            onChange={(e) => setIsFreeChecked(e.target.checked)}
                            className="Margin-bottom-small AdvancedSearch-Filter"
                            disabled={isNotFreeChecked}
                        />
                        <EuiCheckbox
                            id="notFreeGamesCheckbox"
                            label="Excluir juegos gratis"
                            checked={isNotFreeChecked}
                            onChange={(e) => {
                                setIsNotFreeChecked(e.target.checked);
                                setIsFreeChecked(false);
                            }}
                            disabled={isFreeChecked}
                            className="AdvancedSearch-Filter"
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
                            className="AdvancedSearch-Filter"
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
                            className="AdvancedSearch-Filter"
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
                            className="AdvancedSearch-Filter"
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
                            className="AdvancedSearch-Filter"
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
                            className="AdvancedSearch-Filter"
                        />
                        <EuiCheckbox
                            id="soMacCheckbox"
                            label="Mac"
                            checked={isSoMacChecked}
                            onChange={(e) => setIsSoMacChecked(e.target.checked)}
                            className="AdvancedSearch-Filter"
                        />
                        <EuiCheckbox
                            id="soLinuxCheckbox"
                            label="Linux"
                            checked={isSoLinuxChecked}
                            onChange={(e) => setIsSoLinuxChecked(e.target.checked)}
                            className="Margin-bottom-small AdvancedSearch-Filter"
                        />
                    </div>
                    <div id="ReleaseYear" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                        <div className="Flex-start-div Space-Between">
                            <h4 className="Margin-bottom">Lanzamiento</h4>
                            {(releaseYearFrom !== '' || releaseYearTo !== '' || isComingSoonChecked ) && (
                                <MdCancel
                                    className="ClearFilter-Button"
                                    onClick={() => {
                                        setReleaseYearFrom('');
                                        setReleaseYearTo('');
                                        setIsComingSoonChecked(false)
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
                                disabled={isComingSoonChecked}
                                className="AdvancedSearch-Filter-ComboBox"
                            />
                        </div>
                        <div className="Margin-bottom">
                            <p className="Margin-bottom-small">Año hasta:</p>
                            <EuiSelect
                                options={yearOptions}
                                value={releaseYearTo}
                                onChange={(e) => setReleaseYearTo(e.target.value)}
                                aria-label="Año hasta"
                                disabled={isComingSoonChecked}
                                className="AdvancedSearch-Filter-ComboBox"
                            />
                        </div>
                        <EuiCheckbox
                            id="comingSoonCheckbox"
                            label="Mostrar solo próximos lanzamientos"
                            checked={isComingSoonChecked}
                            onChange={(e) => {
                                setIsComingSoonChecked(e.target.checked)
                                setReleaseYearFrom('');
                                setReleaseYearTo('');
                            }}
                            className="AdvancedSearch-Filter"
                        />
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
                                    className="Margin-bottom-small AdvancedSearch-Filter"
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
                            setIsNotFreeChecked(false);
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
                            setIsComingSoonChecked(false);
                        }}
                        className="ResetFilter-Button"
                    >
                        Reiniciar filtros
                    </EuiButton >

                </div>
                <div className="AdvancedSearch-Results-And-Sorting">
                    <div id="Name" className="AdvancedSearch-Filters-Container Margin-bottom HideOnBigToBlock">
                        <EuiFieldSearch
                            className="AdvancedSearch-Filters-EuiFieldSearch"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            isClearable
                            fullWidth
                        />
                    </div>

                    <div className="HideOnBigToBlock">
                        {showMobileFilters ? (
                            <div>
                                <div className="AdvancedSearch-Filters">
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
                                                {isFreeChecked ? "Rango de precios: Gratis" : `Rango de precios: ${priceRange[0]}€ ~ ${priceRange[1]}€`}
                                            </h4>
                                            {(isFreeChecked || isNotFreeChecked || priceRange[0] !== 0 || priceRange[1] !== 110) && (
                                                <MdCancel
                                                    className="ClearFilter-Button"
                                                    onClick={() => {
                                                        setPriceRange([0, 110]);
                                                        setIsFreeChecked(false);
                                                        setIsNotFreeChecked(false);
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
                                            className="AdvancedSearch-Filter"
                                        />
                                        <EuiCheckbox
                                            id="freeGamesCheckbox"
                                            label="Mostrar solo juegos gratis"
                                            checked={isFreeChecked}
                                            onChange={(e) => setIsFreeChecked(e.target.checked)}
                                            className="Margin-bottom-small AdvancedSearch-Filter"
                                            disabled={isNotFreeChecked}
                                        />
                                        <EuiCheckbox
                                            id="notFreeGamesCheckbox"
                                            label="Excluir juegos gratis"
                                            checked={isNotFreeChecked}
                                            onChange={(e) => {
                                                setIsNotFreeChecked(e.target.checked);
                                                setIsFreeChecked(false);
                                            }}
                                            disabled={isFreeChecked}
                                            className="AdvancedSearch-Filter"
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
                                            className="AdvancedSearch-Filter"
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
                                            className="AdvancedSearch-Filter"
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
                                            className="AdvancedSearch-Filter"
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
                                            className="AdvancedSearch-Filter"
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
                                            className="AdvancedSearch-Filter"
                                        />
                                        <EuiCheckbox
                                            id="soMacCheckbox"
                                            label="Mac"
                                            checked={isSoMacChecked}
                                            onChange={(e) => setIsSoMacChecked(e.target.checked)}
                                            className="AdvancedSearch-Filter"
                                        />
                                        <EuiCheckbox
                                            id="soLinuxCheckbox"
                                            label="Linux"
                                            checked={isSoLinuxChecked}
                                            onChange={(e) => setIsSoLinuxChecked(e.target.checked)}
                                            className="Margin-bottom-small AdvancedSearch-Filter"
                                        />
                                    </div>
                                    <div id="ReleaseYear" className="AdvancedSearch-Filters-Container Margin-bottom-big">
                                        <div className="Flex-start-div Space-Between">
                                            <h4 className="Margin-bottom">Lanzamiento</h4>
                                            {(releaseYearFrom !== '' || releaseYearTo !== '' || isComingSoonChecked ) && (
                                                <MdCancel
                                                    className="ClearFilter-Button"
                                                    onClick={() => {
                                                        setReleaseYearFrom('');
                                                        setReleaseYearTo('');
                                                        setIsComingSoonChecked(false)
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
                                                disabled={isComingSoonChecked}
                                                className="AdvancedSearch-Filter-ComboBox"
                                            />
                                        </div>
                                        <div className="Margin-bottom">
                                            <p className="Margin-bottom-small">Año hasta:</p>
                                            <EuiSelect
                                                options={yearOptions}
                                                value={releaseYearTo}
                                                onChange={(e) => setReleaseYearTo(e.target.value)}
                                                aria-label="Año hasta"
                                                disabled={isComingSoonChecked}
                                                className="AdvancedSearch-Filter-ComboBox"
                                            />
                                        </div>
                                        <EuiCheckbox
                                            id="comingSoonCheckbox"
                                            label="Mostrar solo próximos lanzamientos"
                                            checked={isComingSoonChecked}
                                            onChange={(e) => {
                                                setIsComingSoonChecked(e.target.checked)
                                                setReleaseYearFrom('');
                                                setReleaseYearTo('');
                                            }}
                                            className="AdvancedSearch-Filter"
                                        />
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
                                                    className="Margin-bottom-small AdvancedSearch-Filter"
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
                                            setIsNotFreeChecked(false);
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
                                            setIsComingSoonChecked(false);
                                        }}
                                        className="ResetFilter-Button"
                                    >
                                        Reiniciar filtros
                                    </EuiButton >

                                    <EuiButton
                                        size="s"
                                        onClick={() => setShowMobileFilters(false)}
                                        className="HideFilters-Button Margin-top"
                                    >
                                        Ocultar filtros
                                    </EuiButton >

                                </div>
                            </div>
                        ) : (
                            <div>
                                <EuiButton
                                    size="s"
                                    onClick={() => setShowMobileFilters(true)}
                                    className="ShowFilters-Button"
                                >
                                    Mostrar filtros
                                </EuiButton >
                            </div>
                        )}
                    </div>

                    <div className="AdvancedSearch-Sorting Flex-center-div">
                        <div className="AdvancedSearch-Sorting-Sorting">
                            <h4 className="Margin-bottom-small">Ordenar por: </h4>
                            <EuiSelect
                                options={[
                                    { value: 'relevance', text: 'Relevancia' },
                                    { value: 'name_asc', text: 'Nombre A-Z' },
                                    { value: 'name_desc', text: 'Nombre Z-A' },
                                    { value: 'min_price_asc', text: 'Precio: menor a mayor' },
                                    { value: 'min_price_desc', text: 'Precio: mayor a menor' },
                                    { value: 'release_date_desc', text: 'Lanzamiento: más recientes primero' },
                                    { value: 'release_date_asc', text: 'Lanzamiento: más antiguos primero' },
                                ]}
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                aria-label="Ordenar resultados"
                                className="AdvancedSearch-Filter"
                            />
                        </div>
                        <div className="AdvancedSearch-Sorting-View Margin-right">
                            <h4 className="Margin-bottom-small">Vista: </h4>
                            <div className="AdvancedSearch-Sorting-View-Content Flex-center-div">
                                {viewList ? (
                                    <>
                                        <CgDisplayGrid
                                            className="AdvancedSearch-Sorting-View-Icon-Disabled Margin-right-small"
                                            onClick={() => setViewList(false)}
                                        />
                                        <MdViewList
                                            className="AdvancedSearch-Sorting-View-Icon-Active"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <CgDisplayGrid
                                            className="AdvancedSearch-Sorting-View-Icon-Active Margin-right-small"
                                        />
                                        <MdViewList
                                            className="AdvancedSearch-Sorting-View-Icon-Disabled"
                                            onClick={() => setViewList(true)}
                                        />
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                    <div className={viewList ? "AdvancedSearch-Results-List Margin-bottom" : "AdvancedSearch-Results Margin-bottom"}>
                        {getSortedGames().map((game, index) => (
                            <Link to={`/game/${game.id}`} key={game.id} className="Formatted-Link">
                                {viewList ? (
                                    <div className="AdvancedSearch-List-Item Flex-center-div Space-Between" key={index}>
                                    <div className="AdvancedSearch-List-Item-Content Flex-start-div">
                                        <img className="AdvancedSearch-List-Item-Content-Image Margin-right" src={game.capsule_image} />
                                        <div className="AdvancedSearch-List-Item-Content-Info">
                                            <h4 className="Margin-bottom-small">{game.name}</h4>
                                            <div className="AdvancedSearch-List-Item-Price-Platform HideOnSmall">
                                                {game.availability_steam && (
                                                    <SteamIcon className="AdvancedSearch-List-Item-Price-Platform-Svg"/>
                                                )}
                                                {game.availability_epic && (
                                                    <EpicIcon className="AdvancedSearch-List-Item-Price-Platform-Svg Margin-left-small" />
                                                )}
                                                {game.availability_xbox && (
                                                    <XboxIcon className="AdvancedSearch-List-Item-Price-Platform-Svg Margin-left-small" />
                                                )}
                                                {game.availability_battle && (
                                                    <BattleIcon className="AdvancedSearch-List-Item-Price-Platform-Svg Margin-left-small" />
                                                )}
                                                {game.availability_gog && (
                                                    <GogIcon className="AdvancedSearch-List-Item-Price-Platform-Svg Margin-left-small" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="AdvancedSearch-List-Item-Price">
                                        <div className="AdvancedSearch-List-Item-Price-Price">
                                            {game.coming_soon === true ? (
                                                <span className="AdvancedSearch-Results-Item-Info-Price-ComingSoon">Próximamente</span>
                                            ) : game.min_price === -0.02 ? (
                                                <span className="AdvancedSearch-Results-Item-Info-Price-BattlePass">Battle&nbsp;Pass</span>
                                            ) : game.min_price === 0 && game.max_price === 0 ? (
                                                <span className="AdvancedSearch-Results-Item-Info-Price-Free">Gratis</span>
                                            ) : (
                                                <>
                                                    <span className="AdvancedSearch-Results-Item-Info-Price-Min">{game.min_price}€</span>
                                                    {game.max_price > game.min_price && (
                                                        <span className="AdvancedSearch-Results-Item-Info-Price-Max">&nbsp;~&nbsp;{game.max_price}€</span>
                                                    )}
                                                </>
                                            )}

                                        </div>
                                    </div>
                                </div>
                                ) : (
                                    <div className="AdvancedSearch-Results-Item" key={index}>
                                        <img className="AdvancedSearch-Results-Item-Image" src={game.header_image} />
                                        <div className="AdvancedSearch-Results-Item-Info">
                                            <h4 className="Margin-bottom-small">{game.name}</h4>
                                            <div className="Flex-center-div AdvancedSearch-Results-Item-Info-Vars">
                                                <div className="AdvancedSearch-Results-Item-Info-Misc">
                                                    <div className="AdvancedSearch-Results-Item-Info-Availability">
                                                        {game.availability_steam && (
                                                            <SteamIcon className="AdvancedSearch-Results-Item-Info-Availability-Svg"/>
                                                        )}
                                                        {game.availability_epic && (
                                                            <EpicIcon className="AdvancedSearch-Results-Item-Info-Availability-Svg Margin-left-small" />
                                                        )}
                                                        {game.availability_xbox && (
                                                            <XboxIcon className="AdvancedSearch-Results-Item-Info-Availability-Svg Margin-left-small" />
                                                        )}
                                                        {game.availability_battle && (
                                                            <BattleIcon className="AdvancedSearch-Results-Item-Info-Availability-Svg Margin-left-small" />
                                                        )}
                                                        {game.availability_gog && (
                                                            <GogIcon className="AdvancedSearch-Results-Item-Info-Availability-Svg Margin-left-small" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="AdvancedSearch-Results-Item-Info-Price">
                                                    {game.coming_soon === true ? (
                                                        <span className="AdvancedSearch-Results-Item-Info-Price-ComingSoon">Próximamente</span>
                                                    ) : game.min_price === -0.02 ? (
                                                        <span className="AdvancedSearch-Results-Item-Info-Price-BattlePass">Battle&nbsp;Pass</span>
                                                    ) : game.min_price === 0 && game.max_price === 0 ? (
                                                        <span className="AdvancedSearch-Results-Item-Info-Price-Free">Gratis</span>
                                                    ) : (
                                                        <>
                                                            <span className="AdvancedSearch-Results-Item-Info-Price-Min">{game.min_price}€</span>
                                                            {game.max_price > game.min_price && (
                                                                <span className="AdvancedSearch-Results-Item-Info-Price-Max">&nbsp;~&nbsp;{game.max_price}€</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                    <button className="Formatted-Link" onClick={() => setVisibleCount(prev => prev + step)}>
                        <div className="AdvancedSearch-LoadMore-Container">
                            {isLoading ?
                                <div className="AdvancedSearch-LoadMore">
                                    <LuLoader className="Margin-right-small"/><h4>Cargando...</h4>
                                </div>
                                :
                                <div className="AdvancedSearch-LoadMore">
                                    <FaPlus className="Margin-right-small"/><h4>Cargar más</h4>
                                </div>
                            }
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedSearch;
