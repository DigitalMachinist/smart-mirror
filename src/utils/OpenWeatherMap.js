
export function get3HourForecastData( apiKey, location, units = 'metric', forecastPeriod = 120 ) {
  validateInputs( apiKey, location, units );
  if ( forecastPeriod <= 0 ) {
    throw new Error( 'The provided forecastPeriod (time window) must be a positive integer value.' );
  }
  return fetchData (
    'forecast',
    {
      q: location,
      units,
      appid: apiKey
    },
    data => {
      const endDate = new Date( new Date().getTime() + forecastPeriod * 60 * 60 * 1000 );
      return data
        .list
        .filter( sample => getDate( sample.dt ) <= endDate )
        .map( transform3HWeatherSample );
    }
  );
}

export function getCurrentWeatherData( apiKey, location, units = 'metric' ) {
  validateInputs( apiKey, location, units );
  return fetchData (
    'weather',
    {
      q: location,
      units,
      appid: apiKey
    },
    data => transform3HWeatherSample( data )
  );
}

export function getTodaysWeatherData ( apiKey, location, units = 'metric' ) {
  validateInputs( apiKey, location, units );
  return fetchData (
    'forecast/daily',
    {
      q: location,
      units,
      appid: apiKey
    },
    data => {
      return data
        .list
        .reduce( ( acc, sample ) => transformTodaysWeatherSample( sample ) );
    }
  );
}

function fetchData ( resource, args, dataTransformFunc ) {
  const baseUrl = 'http://api.openweathermap.org/data/2.5/';
  let url = `${ baseUrl }${ resource }?`;
  for ( let argKey of Object.keys( args ) ) {
    url += `${ argKey }=${ args[ argKey ] }&`;
  }
  url = url.slice( 0, url.length - 1 );
  return fetchDataFromUrl( url, dataTransformFunc );
}

function fetchDataFromUrl ( url, dataTransformFunc ) {
  return fetch( url )
    .then( res => res.json() )
    .catch( error => {
      console.error( 'Failed to get weather data from Open Weather Map API!' );
      throw error;
    } )
    .then( dataTransformFunc )
    .catch( error => {
      console.error( 'Failed to transform the data from the Open Weather Map API!' );
      throw error;
    } );
}

function getDate ( value ) {
  return new Date( 1000 * value );
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

function isExtremeWeather ( sample ) {
  var extremes =
    sample
      .weather
      .filter( weather => weather.main.toLowerCase().includes( 'extreme' ) );
  return ( extremes.length > 0 );
}

function transform3HWeatherSample ( sample ) {
  return {
    date: getDate( sample.dt ),
    condition: sample.weather[ 0 ].main,
    conditionCode: sample.weather[ 0 ].id,
    iconCode: sample.weather[ 0 ].icon,
    isExtreme: isExtremeWeather( sample ),
    temperature: sample.main.temp, // C
    humidity: sample.main.humidity, // %
    pressure: sample.main.pressure / 10, // kPa
    precipitation: getPrecipitation( sample, 'rain' ) + getPrecipitation( sample, 'snow' ), // cm
    sunrise: getDate( sample.sys.sunrise ),
    sunset: getDate( sample.sys.sunset ),
    windspeed: sample.wind.speed * 3.6 // km/h
  };
}

function transformTodaysWeatherSample ( sample ) {
  return {
    date: getDate( sample.dt ),
    condition: sample.weather[ 0 ].description,
    conditionCode: sample.weather[ 0 ].id,
    iconCode: sample.weather[ 0 ].icon,
    isExtreme: isExtremeWeather( sample ),
    temperatureMax: sample.temp.max,
    temperatureMin: sample.temp.min
  };
}

function validateInputs ( apiKey, location, units ) {
  if ( !apiKey ) {
    throw new Error( 'An API key is required to access the weather API.' );
  }
  if ( !location ) {
    throw new Error( 'A location must be given to query weather conditions e.g. "Toronto,CA".' );
  }
  if ( units !== 'metric' && units != 'imperial' ) {
    throw new Error( 'Units must be either "metric" or "imperial".' );
  }
}
