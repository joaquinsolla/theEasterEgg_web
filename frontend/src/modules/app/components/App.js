import React from "react";
import { EuiProvider } from '@elastic/eui';
import { HashRouter as Router } from "react-router-dom";

import Body from "./Body";
import Header from "./Header";
import Footer from "./Footer";

const App = () => {
  return (
      <Router>
          <Header />
          <EuiProvider colorMode="dark">
            <Body />
          </EuiProvider>
          <Footer />
      </Router>
  );
};

export default App;
