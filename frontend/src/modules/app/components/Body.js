import React from "react";
import { useSelector } from "react-redux";
import {Navigate, Route, Routes} from "react-router-dom";

import Home from "./Home";
import PlatformsList from "./PlatformsList";
import CategoriesList from "./CategoriesList";
import DevelopersList from "./DevelopersList";
import AdvancedSearch from "./AdvancedSearch";
import GameDetails from "./GameDetails";
import AccountDetails from "./AccountDetails";
import DesiredGames from "./DesiredGames";
import NotFoundPage from "./NotFoundPage";
import ForYou from "./ForYou";

import users, {
    Login,
    SignUp,
    Logout
} from "../../users";

const Body = () => {

    const loggedIn = useSelector(users.selectors.isLoggedIn);

    return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/platforms-list" element={<PlatformsList />} />
        <Route path="/categories-list" element={<CategoriesList />} />
        <Route path="/developers-list" element={<DevelopersList />} />
        <Route path="/game/:appid" element={<GameDetails />} />

        {!loggedIn && <Route path="/login" element={<Login />} />}
        {!loggedIn && <Route path="/signup" element={<SignUp />} />}
        {loggedIn && <Route path="/logout" element={<Logout />} />}
        {loggedIn && <Route path="/account" element={<AccountDetails />} />}
        {loggedIn && <Route path="/desired-games" element={<DesiredGames />} />}
        {loggedIn && <Route path="/for-you" element={<ForYou />} />}

        <Route path="/notFound" element={<NotFoundPage />} />
        {/*<Route path="/*" element={<Navigate to="/notFound" />} />*/}
    </Routes>
  );
};

export default Body;
