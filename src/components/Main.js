import React from 'react';
import Weather from './WeatherContainer';

require( 'normalize.css' );
require( 'styles/App.css' );
const yeomanImage = require( '../images/yeoman.png' );

class AppComponent extends React.Component {

  constructor() {
    super();
  }

  render () {

    const width = 800;
    const height = 200;
    const apiKey = '5c084e3b39a49a5974701c58069592c6';
    const location = 'Toronto,CA'; // Make sure to include the country code!
    const forecastPeriod = 27; // Hours
    const pollingInterval = 1; // Minutes
    const units = 'metric';

    return (
      <div className="index">
        <Weather
          width = { width }
          height = { height }
          apiKey = { apiKey }
          location = { location }
          forecastPeriod = { forecastPeriod }
          pollingInterval = { pollingInterval }
          units = { units }
        />
      </div>
    );

  }

}

AppComponent.defaultProps = {
};

export default AppComponent;
