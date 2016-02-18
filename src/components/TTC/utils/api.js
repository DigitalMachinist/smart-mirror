
export default function getTTCDepartureData ( routes ) {

  // For each route, flat map the stops together into one long array and run an API request
  // for each of them. Promise.all() guarantees that the .then() function below will receive
  // an array of results in the same order as the requests mapped here.
  const stops =
    routes
      .map( route => [
        { route: route.id, id: route.stopEastbound },
        { route: route.id, id: route.stopWestbound }
      ] )
      .reduce( ( flatStops, stopsPair ) => flatStops.concat( stopsPair ), [] )
      .map( stop => getTTCStopDepartures( stop ) );

  return Promise
    .all( stops )
    .then( stops => {
      // Take each set of departures from a stop that we get back, and group them back up by
      // route number as they were. The output should resemble the input routes array, but instead
      // of stop numbers for each direction, we have arrays of departures for each direction.
      return stops
          .reduce( ( routeDepartures, departures, i ) => {
            const routeIndex = Math.floor( i / 2 );
            if ( i % 2 === 0 ) {
              routeDepartures.push( Object.assign( {}, routes[ routeIndex ] ) );
              routeDepartures[ routeIndex ].departuresEastbound = departures;
            }
            else {
              routeDepartures[ routeIndex ].departuresWestbound = departures;
            }
            return routeDepartures;
          }, [] )
    } )
    .catch( error => {
      throw new Error( error );
    } );
}

export function getTTCStopDepartures ( stop ) {

  return fetch( `http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&r=${ stop.route }&s=${ stop.id }` )
      .then( res => res.text() )
      .catch( error => {
        console.error( 'Failed to get predictions data from TTC NextBus API!' );
        throw error;
      } )
      .then( data => {

        // Parse the XML document from the raw text input.
        const parser = new DOMParser();
        const xml = parser.parseFromString( data, 'text/xml' );
        if ( xml.documentElement.nodeName == 'parsererror' ) {
          throw new Error( 'Failed to parse the TTC schedule XML!' );
        }

        // Get an HTMLCollection of <prediction> tags.
        const predictions =
          xml
            .getElementsByTagName( 'predictions' )[ 0 ]
            .getElementsByTagName( 'prediction' );

        // Go through the predictions and pull out the "minutes" attribute
        // for each one. We can't use map() since HTMLCollection doesn't
        // support it, unfotunately.
        const departures = [];
        for ( var i = 0; i < predictions.length; i++ ) {
          const minutes = parseInt( predictions[ i ].getAttribute( 'minutes' ) );
          if ( isNaN( minutes ) ) {
            continue;
          }
          departures.push( minutes );
        }

        return departures;

      } )
      .catch( error => {
        console.error( 'Failed to transform the data from the TTC NextBus API!' );
        throw error;
      } );

}
