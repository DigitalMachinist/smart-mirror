
const URL = 'http://api.openweathermap.org/data/2.5/';

export function getCurrentAnd3HForecast( apiKey, location, forecastPeriod = 120, units = 'metric', apiDelay = 500 ) {

  // Note: This used to use Promise.all() to perform these fetches in parallel, but the Open
  // Weather Map API is pissy and intermittantly rejects requests because they are too frequent.
  // I have opted for this sequential fetching process to hopefully avoid HTTP status 429s being
  // returned for violating the API rate limit.
  return getCurrentWeatherData( apiKey, location, units )
    .then( currentSample => {
      // Delay for another while to prevent rate limiting issues, then resolve with the current
      // sample so the next .then() can include it in the result set.
      return new Promise( ( resolve, reject ) => {
        setTimeout( () => resolve( currentSample ), apiDelay );
      } );
    } )
    .then( currentSample => {
      // Once the 3h forecast samples come back, flatten the current sample and the 3h forecast
      // samples into a single array and return that.
      return get3HourForecastData( apiKey, location, forecastPeriod, units )
        .then( forecastSamples => [ currentSample ].concat( forecastSamples ) );
    } );

}

export function get3HourForecastData( apiKey, location, forecastPeriod = 120, units = 'metric' ) {

  if ( !apiKey ) {
    throw new Error( 'An API key is required to access the weather API.' );
  }

  if ( !location ) {
    throw new Error( 'A location must be given to query weather conditions e.g. "Toronto,CA".' );
  }

  if ( forecastPeriod <= 0 ) {
    throw new Error( 'The provided forecastPeriod (time window) must be a positive integer value.' );
  }

  if ( units !== 'metric' && units != 'imperial' ) {
    throw new Error( 'Units must be either "metric" or "imperial".' );
  }

  const route = 'forecast';
  return fetch( `${ URL }${ route }?q=${ location }&units=${ units }&appid=${ apiKey }` )
    .then( res => res.json() )
    .catch( error => {
      console.error( 'Failed to get weather data from Open Weather Map API!' );
      throw error;
    } )
    .then( rawData => {
      const endDate = new Date( new Date().getTime() + forecastPeriod * 60 * 60 * 1000 );
      return rawData
        .list
        .filter( sample => getDate( sample ) <= endDate )
        .map( transformWeatherSample );
    } )
    .catch( error => {
      console.error( 'Failed to transform the data from the Open Weather Map API!' );
      throw error;
    } );

}

export function getCurrentWeatherData( apiKey, location, units = 'metric' ) {

  if ( !apiKey ) {
    throw new Error( 'An API key is required to access the weather API.' );
  }

  if ( !location ) {
    throw new Error( 'A location must be given to query weather conditions e.g. "Toronto,CA".' );
  }

  if ( units !== 'metric' && units != 'imperial' ) {
    throw new Error( 'Units must be either "metric" or "imperial".' );
  }

  const route = 'weather';
  return fetch( `${ URL }${ route }?q=${ location }&units=${ units }&appid=${ apiKey }` )
    .then( res => res.json() )
    .catch( error => {
      console.error( 'Failed to get weather data from Open Weather Map API!' );
      throw error;
    } )
    .then( rawData => transformWeatherSample( rawData ) )
    .catch( error => {
      console.error( 'Failed to transform the data from the Open Weather Map API!' );
      throw error;
    } );

}

function getDate ( sample ) {
  return new Date( sample.dt * 1000 );
}

function getPrecipitation ( sample, key ) {
  if ( !sample[ key ] ) {
    return 0;
  }
  if ( !sample[ key ][ '3h' ] ) {
    return 0;
  }
  return sample[ key ][ '3h' ];
}

function getWeatherCondition ( sample ) {
  return sample.weather[ 0 ].main;
}

function getWeatherIcon ( sample ) {
  return sample.weather[ 0 ].icon;
}

function isExtremeWeather ( sample ) {
  var extremes =
    sample
      .weather
        .filter( weather => weather.main.toLowerCase().includes( 'extreme' ) );
  return ( extremes.length > 0 );
}

function transformWeatherSample ( sample ) {
  return {
    date: getDate( sample ),
    condition: getWeatherCondition( sample ),
    isExtreme: isExtremeWeather( sample ),
    icon: getWeatherIcon( sample ),
    temperature: sample.main.temp, // C
    humidity: sample.main.humidity, // %
    pressure: sample.main.pressure / 10, // kPa
    precipitation: getPrecipitation( sample, 'rain' ) + getPrecipitation( sample, 'snow' ), // cm
    windspeed: sample.wind.speed * 3.6 // km/h
  };
}
