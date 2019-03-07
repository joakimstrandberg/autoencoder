import React, { Component } from 'react';
import '../style/App.css';

import { Button, Container, Row, Col  } from 'reactstrap';
import ImageComponent from './ImageComponent';
import Model from '../model.js';
var mnist = require('mnist');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      digit: null,
      predDigit: null,
      model: null,
      train: null,
      test: null,
      isTraining: false,
    };
  }

  componentDidMount(){
    this.fetchDigit();
    const model = new Model([28,28]);
    model.loadModel(()=>[
      this.setState({model:model})
    ]);
    
  }
  
  fetchDigit = () => {
    let num = Math.floor(Math.random() * 10);
    var dig = mnist[num].get();
    console.log(dig);
    this.setState({digit: dig},()=> {console.log(this.state)});
  }
  
  getData = (train,test,callback) => {
    const set =  mnist.set(train,test);
    let tr = set.training.map(({ input }) => input);
    let te = set.test.map(({ input }) => input);
    this.setState({train:tr,test:te},callback);
  }

  trainModel = () => {
    this.setState({isTraining:true});
    this.getData(20000,0, () => {
      console.log(this.state);
      this.state.model.trainModel(this.state.train,(res) => {
        this.setState({isTraining:false});
        console.log(res);
      });
    });

  }

  predictDigit = () => {
    console.log(this.state);
    const predDigit = this.state.model.predict(this.state.digit);
    console.log(predDigit);
    this.setState({predDigit:predDigit},console.log(this.state));
  }

  render() {
    return (
      <div className="App">
        <Container>
        <Row>
          <Col>.col</Col>
          <Col>.col</Col>
        </Row>
        </Container>
        <Button onClick={() => this.fetchDigit()} color="danger">New digit</Button>
        {!!this.state.digit ? <ImageComponent id={"inputCanvas"} height={28} width={28} data={this.state.digit}/> : null}
        <Button disabled={this.state.isTraining} onClick={() => this.trainModel()} color="primary">Train</Button>
        <Button disabled={this.state.isTraining} onClick={() => this.predictDigit()} color="primary">Predict</Button>
        {!!this.state.predDigit ? <ImageComponent id={"predCanvas"} height={28} width={28} data={this.state.predDigit}/> : null}
      </div>
    );
  }
}

export default App;
