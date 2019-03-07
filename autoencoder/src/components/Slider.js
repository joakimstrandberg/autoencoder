import '../style/Slider.css';
import React from 'react';

const Slider = props => (
    <div className="slider-div">
        <p>{parseFloat(props.value).toFixed(2)}</p>
        <input type="range" step="1" min={props.min} max={props.max} value={props.value} onChange={event => props.onSlide(props.id,event)} className="slider" id={props.id}/>
    </div>
);


export default Slider;