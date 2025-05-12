import React from "react";

import { Route, Routes } from "react-router-dom";

import Home from "./Home";
import Test from "./Test";
import PlatformsList from "./PlatformsList";
import CategoriesList from "./CategoriesList";

const Body = () => {
  return (
    <Routes>
      <Route path="/">
          <Route index exact element={<Home />} />
          <Route path="account" element={<Test />} />
          <Route path="advanced-search" element={<Test />} />
          <Route path="game/:appid" element={<Test />} />

          <Route path="platforms-list" element={<PlatformsList />} />
          <Route path="categories-list" element={<CategoriesList />} />

      </Route>
    </Routes>
  );
};

export default Body;
