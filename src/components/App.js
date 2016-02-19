require( 'normalize.css' );
require( '../index.css' );

import { default as React, Component } from 'react';
import Settings from '../settings';
import { getCurrentAnd3HForecast } from '../utils/OpenWeatherMap';
import { getTTCDepartureData } from '../utils/NextBus';
import Overview from './Overview/Overview';
import TTC from './TTC/TTC';
import WeatherForecast from './WeatherForecast/WeatherForecast';

export default class AppComponent extends Component {

  constructor( props ) {
    super( props );
    this.__renderOverview = this.__renderOverview.bind( this );
    this.__renderTTCSchedule = this.__renderTTCSchedule.bind( this );
    this.__renderWeatherForecast = this.__renderWeatherForecast.bind( this );
    this.__startPollingDate = this.__startPollingDate.bind( this );
    this.__startPollingTTCRoutes = this.__startPollingTTCRoutes.bind( this );
    this.__startPollingWeather = this.__startPollingWeather.bind( this );
    this.__stopPollingDate = this.__stopPollingDate.bind( this );
    this.__stopPollingTTCRoutes = this.__stopPollingTTCRoutes.bind( this );
    this.__stopPollingWeather = this.__stopPollingWeather.bind( this );
    this.__updateDate = this.__updateDate.bind( this );
    this.__updateTTCRoutes = this.__updateTTCRoutes.bind( this );
    this.__updateWeather = this.__updateWeather.bind( this );
    this.state = {
      date: new Date(),
      datePollingHandle: null,
      ttcRoutes: [],
      ttcRoutesPollingHandle: null,
      weather: [],
      weatherPollingHandle: null
    };
  }

  render () {
    return (
      <div className="index">
        { this.__renderWeatherForecast() }
        { this.__renderTTCSchedule() }
        { this.__renderOverview() }
      </div>
    );
  }

  componentDidMount () {
    this.__updateTTCRoutes();
    this.__updateWeather();
    this.__startPollingDate();
    this.__startPollingTTCRoutes();
    this.__startPollingWeather();
  }

  componentWillUnmount () {
    this.__stopPollingDate();
    this.__stopPollingTTCRoutes();
    this.__stopPollingWeather();
  }

  __renderOverview () {
    const { date, weather } = this.state;
    if ( weather && weather.length > 0 ) {
      const { condition, temperature } = weather[ 0 ];
      return (
        <Overview
          condition = { condition }
          date = { date }
          temperature = { temperature }
        />
      );
    }
    return '';
  }

  __renderTTCSchedule () {
    const { ttcRoutes } = this.state;
    return (
      <TTC
        data = { ttcRoutes }
      />
    );
  }

  __renderWeatherForecast() {
    const { height, margins, precipitationMax, width } = Settings.weather;
    const { weather } = this.state;
    return (
      <WeatherForecast
        data = { weather }
        height = { height }
        margins = { margins }
        precipitationMax = { precipitationMax }
        width = { width }
      />
    );
  }

  __startPollingDate () {
    const handle = setInterval( this.__updateDate, 1000 );
    this.setState( {
      datePollingHandle: handle
    } );
  }

  __updateDate () {
    this.setState( {
      date: new Date()
    } );
  }

  __stopPollingDate () {
    const { datePollingHandle } = this.state;
    if ( datePollingHandle ) {
      clearInterval( datePollingHandle );
    }
  }

  __startPollingTTCRoutes () {
    const { pollingInterval } = Settings.ttcRoutes;
    if ( pollingInterval > 0 ) {
      const handle = setInterval( this.__updateTTCRoutes, pollingInterval * 60 * 1000 );
      this.setState( {
        ttcRoutesPollinghandle: handle
      } );
    }
  }

  __updateTTCRoutes () {
    const { routes } = Settings.ttcRoutes;
    getTTCDepartureData( routes )
      .then( ttcRoutes => this.setState( { ttcRoutes } ) );
  }

  __stopPollingTTCRoutes () {
    const { ttcRoutesPollingHandle } = this.state;
    if ( ttcRoutesPollingHandle ) {
      clearInterval( ttcRoutesPollingHandle );
    }
  }

  __startPollingWeather () {
    const { pollingInterval } = Settings.weather;
    if ( pollingInterval > 0 ) {
      const handle = setInterval( this.__updateWeather, pollingInterval * 60 * 1000 );
      this.setState( {
        weatherPollinghandle: handle
      } );
    }
  }

  __updateWeather () {
    const { apiKey, location, forecastPeriod, units } = Settings.weather;
    getCurrentAnd3HForecast( apiKey, location, forecastPeriod, units )
      .then( weather => this.setState( { weather } ) );
  }

  __stopPollingWeather () {
    const { weatherPollingHandle } = this.state;
    if ( weatherPollingHandle ) {
      clearInterval( weatherPollingHandle );
    }
  }

}

AppComponent.defaultProps = {};
