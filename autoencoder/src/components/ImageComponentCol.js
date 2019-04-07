import React, { Component } from 'react';

//TODO: should have fixed size
class ImageComponentCol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 10,
            height: 28,
            width: 28
        };
    }

    componentDidUpdate(nextProps) {
        if (this.props.data !== nextProps.data){
            this.showImage(this.props.data);
        }
    }

    componentDidMount(){
        if (this.props.data !== null){
            this.showImage(this.props.data);
        }
    }

    reshape = (data) =>{
        var pixelData = [];
        for (var x=0; x<this.props.width; x++) {
            pixelData[x] = [];
            for (var y=0; y<this.props.height; y++) {
                pixelData[x][y] = "rgb("+Math.floor(data[this.props.height*y+x]*255.0)+","+
                Math.floor(data[this.props.height*y+x]*255.0)+","+
                Math.floor(data[this.props.height*y+x]*255.0)+")";
            }
        }
        return pixelData
    }

    showImage = (data) => {
        if(data === undefined){return}
        var pixelData = this.reshape(data);
        var c = document.getElementById(this.props.id);
        c.width = this.props.width*this.props.scale;
        c.height = this.props.height*this.props.scale;
        var ctx = c.getContext("2d");

        for (var x=0; x<this.state.width; x++) {
            for (var y=0; y<this.props.height; y++) {
                ctx.fillStyle = pixelData[x][y];
                ctx.fillRect(x*this.props.scale, y*this.props.scale, this.props.scale, this.props.scale);
            }
        }
    }
  
    render() {
      return (
        <div style= {canvasDiv}>
        <h4>{this.props.name}</h4>
          <canvas id={this.props.id} style={{border:'1px solid #d3d3d3'}} height={this.props.height*this.state.scale} width={this.props.width*this.props.scale}></canvas>
        </div>
      );
    }
  }
      
  const canvasDiv = {
    border: '1px solid #d3d3d3',
    borderRadius: '5px',
    padding: '0.5em'
  }
  
  export default ImageComponentCol;