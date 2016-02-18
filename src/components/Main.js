require( 'normalize.css' );
require( '../index.css' );

import { default as React, Component } from 'react';
import Settings from '../settings';
import TTC from './TTC/TTC';
import Weather from './Weather/Weather';

export default class AppComponent extends Component {

  constructor() {
    super();
  }

  render () {
    const { weather, ttc } = Settings;
    return (
      <div className="index">
        <Weather
          width = { weather.width }
          height = { weather.height }
          margins = { weather.margins }
          apiKey = { weather.apiKey }
          location = { weather.location }
          forecastPeriod = { weather.forecastPeriod }
          pollingInterval = { weather.pollingInterval }
          precipitationMax = { weather.precipitationMax }
          units = { weather.units }
        />
        <TTC
          pollingInterval = { ttc.pollingInterval }
          routes = { ttc.routes }
        />
      </div>
    );
  }

}

AppComponent.defaultProps = {};
