
import Cronofy from 'cronofy';
import Moment from 'moment';

export function getCalendarEventsData () {

  const now = Moment();
  const options = {
    access_token: 'xA6JpwM3w__PqxUUtuqUlDVzIiLyt3Mv',
    tzid: 'America/Toronto'//,
    // from: now.format( 'YYYY-MM-DD' ),
    // to: now.add( 7, 'days' ).format( 'YYYY-MM-DD' )
  };

  const accessToken = 'xA6JpwM3w__PqxUUtuqUlDVzIiLyt3Mv';
  const timezone = 'America/Toronto';
  const url = `https://api.cronofy.com/v1/events?access_token=${ accessToken }&tzid=${ timezone }`;

  // XHR request form
  const xhr = new XMLHttpRequest();
  xhr.open( 'GET', url );
  xhr.setRequestHeader( 'Accept', 'application/json' );
  xhr.setRequestHeader( 'Authorization', `Bearer ${ accessToken }` );
  xhr.send();

  // Fetch API form
  const request = new Request( url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${ accessToken }`
    },
    method: 'GET'//,
    //mode: 'no-cors'
  } );
  return fetch( request )
    .then( res => res.json() )
    .then( data => {
      const { events } = data;
      console.log( events );
    } )
    .catch( error => {
      console.error( error );
      throw error;
    } );

}
