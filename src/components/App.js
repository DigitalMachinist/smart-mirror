require( 'normalize.css' );
require( '../index.css' );
require( 'weather-icons/css/weather-icons.css' );

import { default as React, Component } from 'react';
import Settings from '../settings';
import { get3HourForecastData, getCurrentWeatherData, getTodaysWeatherData } from '../utils/OpenWeatherMap';
import { getTTCDepartureData } from '../utils/NextBus';
import Clock from './Clock/Clock';
import TTCSchedule from './TTCSchedule/TTCSchedule';
import Weather from './Weather/Weather';
import WeatherForecast from './WeatherForecast/WeatherForecast';

export default class AppComponent extends Component {

  constructor( props ) {
    super( props );
    this.__renderClock = this.__renderClock.bind( this );
    this.__renderTTCSchedule = this.__renderTTCSchedule.bind( this );
    this.__renderTodaysWeather = this.__renderTodaysWeather.bind( this );
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
    this.__startPolling = this.__startPolling.bind( this );
    this.__stopPolling = this.__stopPolling.bind( this );
    this.__delay = this.__delay.bind( this );
    this.state = {
      date: new Date(),
      datePollingHandle: null,
      ttcRoutes: [],
      ttcRoutesPollingHandle: null,
      weatherForecast: [],
      weatherPollingHandle: null,
      weatherToday: {}
    };
  }

  // <div className="column left clearfix">
  //   <div className="container left">
  //     { this.__renderTTCSchedule() }
  //   </div>
  // </div>
  // <div className="column right clearfix">
  //   <div className="container right">
  //     { this.__renderClock() }
  //     <hr />
  //   </div>
  //   <div className="container right">
  //     { this.__renderTodaysWeather() }
  //   </div>
  // </div>
  render () {

    return (
      <div className="app">
        <div className="weatherForecastContainer">
          { this.__renderWeatherForecast() }
        </div>
        <div className="ttcScheduleContainer">
          { this.__renderTTCSchedule() }
          <hr />
        </div>
        <div className="clockContainer">
          { this.__renderClock() }
          <hr />
        </div>
        <div className="weatherContainer">
          { this.__renderTodaysWeather() }
          <hr />
        </div>
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
    this.__stopPollingWeather();
  }

  __renderClock () {
    const { date } = this.state;
    return (
      <Clock
        date = { date }
      />
    );
  }

  __renderTodaysWeather () {
    const { iconMap } = Settings;
    const { weatherForecast, weatherToday } = this.state;
    const weatherCurrent = weatherForecast.slice( 0, 1 );
    const data = Object.assign( {}, weatherToday );
    data.temperature = ( weatherCurrent.length > 0 )
      ? weatherCurrent[ 0 ].temperature
      : NaN;
    return (
      <Weather
        data = { data }
        iconMap = { iconMap }
      />
    );
  }

  __renderTTCSchedule () {
    const { maxDepartures } = Settings.ttcRoutes;
    const { ttcRoutes } = this.state;
    return (
      <TTCSchedule
        data = { ttcRoutes }
        maxDepartures = { maxDepartures }
      />
    );
  }

  __renderWeatherForecast() {
    const { height, margins, precipitationMax, width } = Settings.weather;
    const { weatherForecast } = this.state;
    return (
      <WeatherForecast
        data = { weatherForecast }
        height = { height }
        margins = { margins }
        precipitationMax = { precipitationMax }
        width = { width }
      />
    );
  }


  __startPollingDate () {
    this.__startPolling( 'datePollingHandle', 1, this.__updateDate );
  }
  __updateDate () {
    this.setState( { date: new Date() } );
  }
  __stopPollingDate () {
    this.__stopPolling( 'datePollingHandle' );
  }


  __startPollingTTCRoutes () {
    const { pollingInterval } = Settings.ttcRoutes;
    this.__startPolling( 'ttcRoutesPollinghandle', 60 * pollingInterval, this.__updateTTCRoutes );
  }
  __updateTTCRoutes () {
    const { routes } = Settings.ttcRoutes;
    getTTCDepartureData( routes )
      .then( ttcRoutes => this.setState( { ttcRoutes } ) );
  }
  __stopPollingTTCRoutes () {
    this.__stopPolling( 'ttcRoutesPollingHandle' );
  }


  __startPollingWeather () {
    const { pollingInterval } = Settings.weather;
    this.__startPolling( 'weatherPollinghandle', 60 * pollingInterval, this.__updateWeather );
  }
  __updateWeather () {
    // Note: We need to spread 3 API requests out through time here to avoid going over the API's
    // rate limit or the requests will be rejected with HTTP status code 429.
    const { apiKey, apiRequestDelay, forecastPeriod, location, units } = Settings.weather;
    getTodaysWeatherData( apiKey, location, units )
      .then( weatherToday => this.setState( { weatherToday } ) )
      .then( this.__delay( apiRequestDelay ) )
      .then( undef => getCurrentWeatherData( apiKey, location, units ) )
      .then( this.__delay( apiRequestDelay ) )
      .then( current => {
        return get3HourForecastData( apiKey, location, units, forecastPeriod )
          .then( forecast => [ current ].concat( forecast ) );
      } )
      .then( weatherForecast => this.setState( { weatherForecast } ) );
  }
  __stopPollingWeather () {
    this.__stopPolling( 'weatherPollingHandle' );
  }


  __startPolling ( handleKey, intervalSeconds, procFunc ) {
    if ( intervalSeconds > 0 ) {
      const handle = setInterval( procFunc, 1000 * intervalSeconds );
      const state = {};
      state[ handleKey ] = handle;
      this.setState( state );
    }
  }
  __stopPolling ( handleKey ) {
    const handle = this.state[ handleKey ];
    if ( handle ) {
      clearInterval( handle );
    }
  }
  __delay ( ms ) {
    return passthroughValue => {
      return new Promise( ( resolve, reject ) => {
        return setTimeout( () => resolve( passthroughValue ), ms );
      } );
    };
  }

}

AppComponent.defaultProps = {};
