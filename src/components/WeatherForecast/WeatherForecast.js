require( './WeatherForecast.css' );

import { default as React, Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { drawChart, eraseChart } from './d3WeatherChart';

export default class WeatherForecast extends Component {

  constructor ( props ) {
    super( props );
  }

  render () {
    return <div className="weatherForecast"></div>;
  }

  componentDidMount () {
    const { data, height, margins, precipitationMax, width } = this.props;
    const element = ReactDOM.findDOMNode( this );
    drawChart( element, data, height, width, margins, precipitationMax );
  }

  componentDidUpdate () {
    const { data, height, margins, precipitationMax, width } = this.props;
    const element = ReactDOM.findDOMNode( this );
    eraseChart( element );
    drawChart( element, data, height, width, margins, precipitationMax );
  }

  componentWillUnmount () {
    const element = ReactDOM.findDOMNode( this );
    eraseChart( element );
  }

}

WeatherForecast.defaultProps = {
  data: [],
  height: 200,
  margins: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  precipitationMax: 10,
  width: 800
};

WeatherForecast.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number, // Pixels
  margins: PropTypes.object, // { top, right, bottom, left }
  precipitationMax: PropTypes.number, // mm
  width: PropTypes.number // Pixels
};
