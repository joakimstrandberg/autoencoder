import React, { Component } from 'react';
import '../style/App.css';
import update from 'immutability-helper';
import {facesModelsPath} from "../constants.js";

import { Button, Container, Row, Col} from 'reactstrap';
import ImageComponentCol from './ImageComponentCol';
import Slider from './Slider';
import Model from '../model.js';

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
        pcOrder: [...Array(200).keys()]
      };
    }
  
    componentDidMount(){
      //Instantiate model
      const model = new Model([64,64]);
      model.loadModel(facesModelsPath,()=>
        this.setState({model:model},() => {
          this.setState({modelIsLoaded:true}, () => {
            console.log("State",this.state);
          });
        })
      );
    }

    fetchPcOrder = () => {
      fetch("http://localhost:5000/")
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
      fetch("http://localhost:5000/api/mnist/fetch-face")
        .then(res => res.json())
        .then( result => {
          console.log(result)
          this.setState({sample: result[0]}, () => {
            this.predict();
          });
        })
        .catch(err=> {
            console.log(err);
        });
    }
  
    predict = () => {
      const decoderOutput = this.state.model.predict(this.state.sample);
      this.setState({decoderOutput:decoderOutput},() =>{
        console.log(this.state);
      });
      this.getEncoderOutput();
    }
  
    getEncoderOutput = () => {
      const encoderOutput = this.state.model.predictEncoder(this.state.sample);
      this.setState({encoderOutput:encoderOutput},() => console.log("enc out", this.state));
      this.setState({decoderInput:encoderOutput});
    }
  
    updateDecoderInput = (index,data) => {
      //Update state of the decoder input array element corresponding do slider
      const newInput = update(this.state.decoderInput, {[index]: {$set: parseFloat(data.target.value)}});
      this.setState({decoderInput:newInput},() => {
        const decoderOutput = this.state.model.predictDecoder(this.state.decoderInput);
        this.setState({decoderOutput:decoderOutput}, () => {
          console.log("DECODER OUTPUT", this.state);
        });
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
              <Col><ImageComponentCol id={"inputCanvas"} name={"Input image"} data={this.state.sample} width={64} height={64} channels={3} scale={5}/></Col>
              <Col><ImageComponentCol id={"predCanvas"} name={"Output image"} data={this.state.decoderOutput} width={64} height={64} channels={3} scale={5}/></Col>
            </Row>
            <Row>
              <Col style={{margin: '1em auto'}}><Button onClick={() => this.fetchData()} color="danger">New face</Button></Col>
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
  