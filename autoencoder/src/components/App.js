import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import '../style/App.css';

import {mnistModelsPath} from "../constants.js";
import MnistContainer from "./MnistContainer";
import FacesContainer from "./FacesContainer";
import Navbar from "./Navbar";


//TODO: Add routes
const App = () => (
  <div>
    <div>
      <Navbar/>
    </div>
    <div>
      <FacesContainer/>
      {/*<MnistContainer/>*/}
    </div>
  </div>
)

export default App;
