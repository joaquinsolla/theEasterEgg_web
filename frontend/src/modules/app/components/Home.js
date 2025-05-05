import React, { useState, useEffect } from "react";
import "../style/App.css";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";


const Home = () => {

  return (
    <div className="Content">
        <Searchbar />
    </div>
  );
};

export default Home;
