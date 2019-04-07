import React, { Component } from 'react';
import '../style/App.css';
import update from 'immutability-helper';
import {mnistModelsPath} from "../constants.js";

import { Button, Container, Row, Col} from 'reactstrap';
import ImageComponent from './ImageComponent';
import Slider from './Slider';
import Model from '../model.js';
var mnist = require('mnist');

class FacesContainer extends Component {
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
        encoderOutout: null,
        pcOrder: null
      };
    }
  
    componentDidMount(){
      //Instantiate model
      const model = new Model([28,28]);
      model.loadModel(mnistModelsPath,()=>
        this.setState({model:model},() => {
          this.setState({modelIsLoaded:true}, () => {
            //this.fetchDigit();
            this.fetchPcOrder();
            console.log("State",this.state);
          });
        })
      );
    }

    fetchPcOrder = () => {
      fetch("http://localhost:5000/api/mnist/fetch-pc-order")
        .then(res => res.json())
        .then( result => {
          console.log(result)
          this.setState({pcOrder: result});
        })
        .catch(err=> {
            console.log(err);
        });
    }
    
    fetchData = () => {
      //let num = Math.floor(Math.random() * 10);
      //var dig = mnist[num].get();
      fetch("http://localhost:5000/api/mnist/fetch-digit")
        .then(res => res.json())
        .then( result => {
          console.log(result)
          this.setState({digit: result[0]}, () => {
            this.predictDigit();
          });
        })
        .catch(err=> {
            console.log(err);
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
      const numCols = 8;
      const numRows = Math.ceil(this.state.decoderInput.length/numCols);
      var sliders = [];
      for (let i=0;i<numRows;i++){
        const rowOfSliders = [];
        for (let j = i*numCols; j < (i+1)*numCols; j++) {
          if (j>this.state.decoderInput.length){
            rowOfSliders.push(<Col className='slider-col'></Col>)
          } else {
            rowOfSliders.push(<Col className='slider-col'><Slider id={this.state.pcOrder[j]} value={this.state.decoderInput[this.state.pcOrder[j]]} onSlide={this.updateDecoderInput} min={0} max={20}/></Col>)
          }
        }
        sliders.push(<Row>{rowOfSliders}</Row>);
      }
      return sliders;
    }
  
    render() {
      let sliders;
      if (!!this.state.decoderInput){
          sliders = this.createSliders();
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
            <Row><h4 style={{margin: '1em auto'}}>Latent features</h4></Row>
            {sliders}
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
  
  export default FacesContainer;
  