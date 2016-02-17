
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

export default function get3HourForecastData( apiKey, location, forecastPeriod = 120, units = 'metric' ) {

  if ( !apiKey ) {
    throw new Error( 'An API key is required to access the weather API.' )
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

  const route = `http://api.openweathermap.org/data/2.5/forecast?q=${ location }&units=${ units }&appid=${ apiKey }`;

  return fetch( route )
    .then( res => res.json() )
    .catch( error => {
      console.error( 'Failed to get weather data from Open Weather Map API!' );
      throw error;
    } )
    .then( rawData => {

      const endDate = new Date( new Date().getTime() + forecastPeriod * 60 * 60 * 1000 );
      const data =
        rawData
          .list
          .filter( function ( sample ) {
            return ( getDate( sample ) <= endDate );
          } )
          .map( function ( sample ) {
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
          } );

      return data;

    } )
    .catch( error => {
      console.error( 'Failed to transform the data from the Open Weather Map API!' );
      throw error;
    } )

}
