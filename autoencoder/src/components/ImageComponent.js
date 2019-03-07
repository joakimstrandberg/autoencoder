import React, { Component } from 'react';

class ImageComponent extends Component {
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
        var pixelData1 = new Array();
        var pixelData2 = new Array();
        for (var x=0; x<this.state.width; x++) {
            pixelData1[x] = new Array();
            pixelData2[x] = new Array();
            for (var y=0; y<this.state.height; y++) {
                pixelData1[x][y] = {r:Math.floor(data[this.state.height*y+x]*255.0),
                                   g:Math.floor(data[this.state.height*y+x]*255.0),
                                   b:Math.floor(data[this.state.height*y+x]*255.0)};
                pixelData2[x][y] = "rgb("+pixelData1[x][y].r+","+
                                          pixelData1[x][y].g+","+
                                          pixelData1[x][y].b+")";
            }
        }
        return pixelData2
    }

    showImage = (data) => {
        if(data === undefined){return}
        var pixelData = this.reshape(data);
        var c = document.getElementById(this.props.id);
        c.width = this.state.width*this.state.scale;
        c.height = this.state.height*this.state.scale;
        var ctx = c.getContext("2d");

        for (var x=0; x<this.state.width; x++) {
            for (var y=0; y<this.state.height; y++) {
                ctx.fillStyle = pixelData[x][y];
                ctx.fillRect(x*this.state.scale, y*this.state.scale, this.state.scale, this.state.scale);
            }
        }
    }
  
    render() {
      return (
        <div style= {canvasDiv}>
        <h4>{this.props.name}</h4>
          <canvas id={this.props.id} style={{border:'1px solid #d3d3d3'}} height={this.state.height*this.state.scale} width={this.state.width*this.state.scale}></canvas>
        </div>
      );
    }
  }

      
  const canvasDiv = {
    border: '1px solid #d3d3d3',
    borderRadius: '5px',
    padding: '0.5em'
  }
  
  export default ImageComponent;