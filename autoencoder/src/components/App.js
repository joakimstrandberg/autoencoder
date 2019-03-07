import React, { Component } from 'react';
import '../style/App.css';
import update from 'immutability-helper';

import { Button, Container, Row, Col  } from 'reactstrap';
import ImageComponent from './ImageComponent';
import Slider from './Slider';
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
      modelIsLoaded: false,
      decoderInput: null,
      encoderOutout: null
    };
  }

  componentDidMount(){
    //Instantiate model
    const model = new Model([28,28]);
    model.loadModel(()=>
      this.setState({model:model},() => {
        this.setState({modelIsLoaded:true}, () => {
          //this.fetchDigit();
          console.log("hej",this.state);
        });
      })
    );
  }
  
  fetchDigit = () => {
    let num = Math.floor(Math.random() * 10);
    var dig = mnist[num].get();
    this.setState({digit: dig}, () => {
      this.predictDigit();
    });
  }

  predictDigit = () => {
    const predDigit = this.state.model.predict(this.state.digit);
    this.setState({predDigit:predDigit});
    this.getEncoderOutput();
  }

  getEncoderOutput = () => {
    const encoderOutout = this.state.model.predictEncoder(this.state.digit);
    this.setState({encoderOutout:encoderOutout},this.setState({decoderInput:encoderOutout}));
  }

  updateDecoderInput = (index,data) => {
    const newInput = update(this.state.decoderInput, {[index]: {$set: parseFloat(data.target.value)}});
    this.setState({decoderInput:newInput},() => {
      const decoderOutput = this.state.model.predictDecoder(this.state.decoderInput);
      this.setState({predDigit:decoderOutput});
      
    });
  }

  createSliders = () => {

  }

  render() {
    let sliders;
    if (!!this.state.decoderInput){
      sliders = this.state.decoderInput.map((item,index)=>{
          return (
            <Col><Slider id={index} value={this.state.decoderInput[index]} onSlide={this.updateDecoderInput} min={0} max={20}/></Col>
          )});
    } else {
      sliders = null;
    }

    return (
      <div className="App">
        <h1>Autoencoder</h1>
        <div className="container" style={appDiv}>
        <Container>
          <Row>
            <Col><ImageComponent id={"inputCanvas"} name={"Input image"} data={this.state.digit}/></Col>
            <Col><ImageComponent id={"predCanvas"} name={"Output image"} data={this.state.predDigit}/></Col>
          </Row>
          <Row>
            <Col style={{margin: '1em auto'}}><Button onClick={() => this.fetchDigit()} color="danger">New digit</Button></Col>
          </Row>
          <Row>
            {sliders}
            {false ? <Col><Slider id={0} value={this.state.decoderInput[0]} onSlide={this.updateDecoderInput} min={0} max={50}/></Col>:null}

          </Row>
        </Container>
        </div>
      </div>
    );
  }
}

const appDiv = {
  border: '1px solid #d3d3d3',
  padding: '1em',
}

export default App;
