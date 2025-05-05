import React from "react";

import { HashRouter as Router } from "react-router-dom";

import Body from "./Body";
import Header from "./Header";
import Footer from "./Footer";

const App = () => {
  return (
      <Router>
          <Header />
          <Body />
          <Footer />
      </Router>
  );
};

export default App;
