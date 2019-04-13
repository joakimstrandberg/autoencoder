import React from 'react';
import { Route, Switch } from 'react-router-dom';
import '../style/App.css';

import MnistContainer from "./MnistContainer";
import FacesContainer from "./FacesContainer";
import Navbar from "./Navbar";

const App = () => (
  <div>
    <div>
      <Navbar/>
    </div>
    <Switch>
      <Route path="/faces" exact component={FacesContainer} />
      <Route path="/mnist" exact component={MnistContainer} />
      <Route path="/" exact component={MnistContainer} />
    </Switch>
  </div>
)

export default App;
