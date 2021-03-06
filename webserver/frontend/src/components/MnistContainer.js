import React, { Component } from 'react';
import '../style/App.css';
import update from 'immutability-helper';
import {mnistModelsPath,modelApiPath} from "../constants.js";

import { Button, Container, Row, Col} from 'reactstrap';
import ImageComponent from './ImageComponent';
import Slider from './Slider';
import Model from '../model.js';

/*TODO: fix fetchdigit when component mounts. 
TODO: merge mnist and faces container into one
*/
class MnistContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        digit: null,
        predDigit: null,
        model: null,
        modelIsLoaded: false,
        decoderInput: null,
        encoderOutout: null,
        pcOrder: null,
        minValues: null,
        maxValues: null,
        step: null
      };
    }
  
    /*
    Load model and fetch order of principal components, min, max and step values when component is mounted
    */
    componentDidMount(){
      //Instantiate model
      const model = new Model();
      model.loadModel(mnistModelsPath,()=>
        this.setState({model:model},() => {
          this.setState({modelIsLoaded:true}, () => {
            this.fetchPcInfo();
            //this.fetchDigit();
          });
        })
      );
    }

    componentWillUnmount(){
      //Make sure memory is not leaking
      if (!!this.state.model) {
        this.state.model.deleteModel();
      }
    }

    /*
      Fetch information necessary to order and "scale" slider appropriatly according to their correspoding latent feature. 
    */
    fetchPcInfo = () => {
      fetch(modelApiPath + "api/mnist/fetch-pc-info")
        .then(res => res.json())
        .then( result => {
          this.setState({pcOrder: result.order,minValues: result.min,maxValues: result.max,step: result.step});
        })
        .catch(err=> {
            console.log(err);
        });
    }
    
    /*
      Fetch input data to autoencoder
    */
    fetchDigit = () => {
      fetch(modelApiPath + "api/mnist/fetch-digit")
        .then(res => res.json())
        .then( result => {
          this.setState({digit: result[0]}, () => {
            this.predictDigit();
          });
        })
        .catch(err=> {
            console.log(err);
        });
    }
    
    /* 
      Predict ouput with autoencoder
    */
    predictDigit = () => {
      const predDigit = this.state.model.predict(this.state.digit);
      this.setState({predDigit:predDigit});
      this.getEncoderOutput();
    }

    /*
      Predict with encoder to get latent features of the autoencoder. This is used to set the initial slider positions.
    */
    getEncoderOutput = () => {
      const encoderOutout = this.state.model.predictEncoder(this.state.digit);
      this.setState({encoderOutout:encoderOutout},this.setState({decoderInput:encoderOutout}));
    }
  
    /*
      Update the decoder input. This update slider positions when moved and then use the updated decoder input to create new output.
    */
    updateDecoderInput = (index,data) => {
      const newInput = update(this.state.decoderInput, {[index]: {$set: parseFloat(data.target.value)}});
      this.setState({decoderInput:newInput},() => {
        const decoderOutput = this.state.model.predictDecoder(this.state.decoderInput);
        this.setState({predDigit:decoderOutput});
      });
    }
  
    /*
      Create sliders. One slider for each latent feature of the autoencoder.
    */
    createSliders = () => {
      const numCols = 8;
      const numRows = Math.ceil(this.state.decoderInput.length/numCols);
      var sliders = [];
      for (let i=0;i<numRows;i++){
        const rowOfSliders = [];
        for (let j = i*numCols; j < (i+1)*numCols; j++) {
          if (j>this.state.decoderInput.length){
            rowOfSliders.push(<Col key={-j} className='slider-col'></Col>)
          } else {
            rowOfSliders.push(<Col key={j} className='slider-col'><Slider id={this.state.pcOrder[j]} pc={j+1} value={this.state.decoderInput[this.state.pcOrder[j]]} onSlide={this.updateDecoderInput} min={this.state.minValues[j]} max={this.state.maxValues[j]} step={this.state.step[j]}/></Col>)
          }
        }
        sliders.push(<Row key={i.toString()+"_row"} >{rowOfSliders}</Row>);
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
              <Col style={{margin: '1em auto'}}><Button onClick={() => this.fetchDigit()} color="danger" disabled={!!this.state.modelIsLoaded? false : true}>New Input</Button></Col>
              <Col style={{margin: '1em auto'}}><Button onClick={() => this.predictDigit()} color="primary"  disabled={!!this.state.digit? false : true} >Reset</Button></Col>
            </Row>
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
  
  export default MnistContainer;
  