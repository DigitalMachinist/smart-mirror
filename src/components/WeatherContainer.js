import { default as React, Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import get3HourForecastData from '../utilities/weather';
import { drawChart, eraseChart } from '../utilities/weather-d3';

export default class WeatherContanier extends Component {

  constructor ( props ) {
    super( props );
    this.__updateWeatherData = this.__updateWeatherData.bind( this );
    this.__updateChart = this.__updateChart.bind( this );
    this.state = {
      pollingHandle: undefined
    };
  }

  render () {
    return <div className="weather"></div>;
  }

  componentDidMount () {
    const { pollingInterval } = this.props;
    this.__updateWeatherData();
    if ( pollingInterval > 0 ) {
      console.log( pollingInterval );
      const pollingHandle = setInterval( this.__updateWeatherData, pollingInterval * 60 * 1000 );
      this.setState( { pollingHandle } );
    }
  }

  componentWillUnmount () {
    const { pollingHandle } = this.state;
    clearInterval( pollingHandle );
    eraseChart( ReactDOM.findDOMNode( this ) );
  }

  __updateWeatherData () {
    const { apiKey, location, forecastPeriod, units } = this.props;
    get3HourForecastData( apiKey, location, forecastPeriod, units )
      .then( this.__updateChart );
  }

  __updateChart ( data ) {
    const { height, margins, width } = this.props;
    eraseChart( ReactDOM.findDOMNode( this ) );
    drawChart( ReactDOM.findDOMNode( this ), data, height, width, margins );
  }

}

WeatherContanier.defaultProps = {
  apiKey: '',
  forecastPeriod: 24,
  height: 200,
  location: 'Toronto,CA',
  margins: {
    top: 10,
    right: 80,
    bottom: 30,
    left: 50
  },
  pollingInterval: 60,
  units: 'metric',
  width: 800
};

WeatherContanier.propTypes = {
  apiKey: PropTypes.string.isRequired, // Valid OpenWeatherMap API key
  forecastPeriod: PropTypes.number, // Hours
  height: PropTypes.number, // Pixels
  location: PropTypes.string, // <City>,<Country Code> e.g. "Toronto,CA"
  margins: PropTypes.object, // { top, right, bottom, left }
  pollingInterval: PropTypes.number, // Minutes
  units: PropTypes.oneOf( [ 'metric', 'imperial' ] ),
  width: PropTypes.number // Pixels
};
