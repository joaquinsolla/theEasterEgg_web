import React from "react";

import { Route, Routes } from "react-router-dom";

import Home from "./Home";
import Test from "./Test";
import PlatformsList from "./PlatformsList";
import CategoriesList from "./CategoriesList";
import DevelopersList from "./DevelopersList";
import AdvancedSearch from "./AdvancedSearch";
import GameDetails from "./GameDetails";

const Body = () => {
  return (
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/platforms-list" element={<PlatformsList />} />
          <Route path="/categories-list" element={<CategoriesList />} />
          <Route path="/developers-list" element={<DevelopersList />} />
          <Route path="/game/:appid" element={<GameDetails />} />

          <Route path="/account" element={<Test />} />
    </Routes>
  );
};

export default Body;
