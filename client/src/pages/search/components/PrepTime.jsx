import React, { createRef } from 'react';

import { Timer } from '@material-ui/icons';

class PrepTime extends React.Component {
  state = {
    priceInputValue: '1',
    priceInput: {
      0: '',
      1: '',
      2: ''
    },
    priceOutput: {
      plan1: {
        0: '',
        1: '',
        2: ''
      }
    }
  };

  slider = createRef();
  sliderValue = createRef();

  componentDidMount() {
    this.slider.current.setAttribute('min', 0);
    this.slider.current.setAttribute(
      'max',
      Object.keys(this.state.priceInput).length - 1
    );
    this.thumbSize = parseInt(
      window
        .getComputedStyle(this.sliderValue.current)
        .getPropertyValue('--thumb-size'),
      10
    );
    this.handleSliderValuePosition(this.slider.current);
  }

  handlePricingSlide = (e) => {
    this.setState({ priceInputValue: e.target.value });
    this.handleSliderValuePosition(e.target);
    this.props.setPrepTime(e.target.value);
  };

  handleSliderValuePosition = (input) => {
    const multiplier = input.value / input.max;
    const thumbOffset = this.thumbSize * multiplier;
    const priceInputOffset =
      (this.thumbSize - this.sliderValue.current.clientWidth) / 2;
    this.sliderValue.current.style.left =
      input.clientWidth * multiplier - thumbOffset + priceInputOffset + 'px';
  };

  getPricingData = (obj, pos) => {
    return pos !== undefined
      ? obj[this.state.priceInputValue][pos]
      : obj[this.state.priceInputValue];
  };

  render() {
    return (
      <div className='sslider'>
        <span>Time</span>
        <div className="slider-w-pics">
          <div ><Timer/></div>
        <input className='sslidercolor'
          type='range'
          ref={this.slider}
          defaultValue={this.state.priceInputValue}
          onChange={this.handlePricingSlide}
          />
          <div >
            <Timer />
            <Timer />
            <Timer/>
            </div>
        </div>

        <div ref={this.sliderValue} className='spricing-slider-value'></div>
        {this.getPricingData(this.state.priceInput)}

        {this.getPricingData(this.state.priceOutput.plan1, 0)}

        {this.getPricingData(this.state.priceOutput.plan1, 1)}

        {this.getPricingData(this.state.priceOutput.plan1, 2)}
      </div>
    );
  }
}

export default PrepTime;
