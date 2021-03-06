import React, { Component } from 'react';
import '../style/App.css';
import update from 'immutability-helper';
import {facesModelsPath, modelApiPath} from "../constants.js";

import { Button, Container, Row, Col} from 'reactstrap';
import ImageComponentCol from './ImageComponentCol';
import Slider from './Slider';
import Model from '../model.js';

/*
TODO: fix cancel state updates when component is unmounted
*/
class FacesContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        sample: null,
        decoderOutput: null,
        model: null,
        modelIsLoaded: false,
        decoderInput: null,
        encoderOutput: null,
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
      model.loadModel(facesModelsPath,()=>
        this.setState({model:model},() => {
          this.setState({modelIsLoaded:true}, () => {
            this.fetchPcInfo();
          });
        })
      );
    }
    
    componentWillUnmount(){
      if (!!this.state.model) {
        this.state.model.deleteModel();
      }
    }

    /*
      Fetch information necessary to order and "scale" slider appropriatly according to their correspoding latent feature. 
    */
    fetchPcInfo = () => {
      fetch(modelApiPath + "api/faces/fetch-pc-info")
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
    fetchData = () => {
      fetch(modelApiPath + "api/faces/fetch-face")
        .then(res => res.json())
        .then( result => {
          this.setState({sample: result[0]}, () => {
            this.predict();
          });
        })
        .catch(err=> {
            console.log(err);
        });
    }
  
    /* 
      Predict ouput with autoencoder
    */
    predict = () => {
      const decoderOutput = this.state.model.predict(this.state.sample);
      this.setState({decoderOutput:decoderOutput},() =>{
      });
      this.getEncoderOutput();
    }
  

    /*
      Predict with encoder to get latent features of the autoencoder. This is used to set the initial slider positions.
    */
    getEncoderOutput = () => {
      const encoderOutput = this.state.model.predictEncoder(this.state.sample);
      this.setState({encoderOutput:encoderOutput});
      this.setState({decoderInput:encoderOutput});
    }
  
    /*
      Update the decoder input. This update slider positions when moved and then use the updated decoder input to create new output.
    */
    updateDecoderInput = (index,data) => {
      //Update state of the decoder input array element corresponding do slider
      const newInput = update(this.state.decoderInput, {[index]: {$set: parseFloat(data.target.value)}});
      this.setState({decoderInput:newInput},() => {
        const decoderOutput = this.state.model.predictDecoder(this.state.decoderInput);
        this.setState({decoderOutput:decoderOutput}, () => {
        });
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
          if (j>=this.state.decoderInput.length){
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
              <Col><ImageComponentCol id={"inputCanvas"} name={"Input image"} data={this.state.sample} width={64} height={64} channels={3} scale={5}/></Col>
              <Col><ImageComponentCol id={"predCanvas"} name={"Output image"} data={this.state.decoderOutput} width={64} height={64} channels={3} scale={5}/></Col>
            </Row>
            <Row>
              <Col style={{margin: '1em auto'}}><Button onClick={() => this.fetchData()} color="danger" disabled={!!this.state.modelIsLoaded? false : true}>New input</Button></Col>
              <Col style={{margin: '1em auto'}}><Button onClick={() => this.predict()} color="primary"  disabled={!!this.state.sample? false : true} >Reset</Button></Col>
            </Row>
            {/*<Row><h4 style={{margin: '1em auto'}}>Latent features</h4></Row>*/}
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
  