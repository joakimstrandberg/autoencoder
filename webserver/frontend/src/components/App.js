import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import '../style/App.css';

import MnistContainer from "./MnistContainer";
import FacesContainer from "./FacesContainer";
import Navbar from "./Navbar";

/*
TODO: Fix proper datafetching on server side.
TODO: add randomize button
TODO: add transistion button
*/
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.connecToServer = this.connecToServer.bind(this);
  }
  connecToServer() {
    fetch('/');
  }

  componentDidMount() {
    this.connecToServer();
  }

  render() {
    return(
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
  }
}

export default App;
