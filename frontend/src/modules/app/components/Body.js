import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Home from "./Home";
import Test from "./Test";
import PlatformsList from "./PlatformsList";
import CategoriesList from "./CategoriesList";
import DevelopersList from "./DevelopersList";
import AdvancedSearch from "./AdvancedSearch";
import GameDetails from "./GameDetails";

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



        <Route path="/account" element={<Test />} />
        {/* NOT FOUND PAGE */}
    </Routes>
  );
};

export default Body;
