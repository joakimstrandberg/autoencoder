import '../style/Slider.css';
import React from 'react';

const Slider = props => (
    <div className="slider-div">
        <div>
            <b style={{display: "inline", float: "left"}}>PC {props.pc}</b>
            <p style={{display: "inline", float: "right"}} className='slider-value'>{parseFloat(props.value).toFixed(2)}</p>
        </div>
        <input type="range" step={props.step} min={props.min} max={props.max} value={props.value} onChange={event => props.onSlide(props.id,event)} className="slider" id={props.id}/>
    </div>
);

export default Slider;