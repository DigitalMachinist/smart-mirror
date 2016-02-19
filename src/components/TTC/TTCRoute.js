import { default as React, Component, PropTypes } from 'react';
import TTCDeparture from './TTCDeparture';

export default class TTCRoute extends Component {

  constructor ( props ) {
    super( props );
    this.__renderTTCDepartures = this.__renderTTCDepartures.bind( this );
  }

  render () {
    const { departuresEastbound, departuresWestbound, id } = this.props;
    return (
      <div className="routeContainer">
        <div className="route">
          <div className="number">
            <span>{ id }</span>
          </div>
          <div className="direction eastbound">
            <div className="title column">E</div>
            { this.__renderTTCDepartures( departuresEastbound, 4 ) }
          </div>
          <div className="direction westbound">
            <div className="title column">W</div>
            { this.__renderTTCDepartures( departuresWestbound, 4 ) }
          </div>
        </div>
      </div>
    );
  }

  __renderTTCDepartures ( departures, max = 4 ) {
    const { dangerThreshold, id, missedThreshold, warningThreshold } = this.props;
    return (
      departures
        .reduce( ( take, departure, i ) => {
          return ( i >= max )
            ? take
            : take.concat( departure );
        }, [] )
        .map( ( totalMinutes, index ) => {
          // const hours = Math.floor( totalMinutes / 60 );
          // const minutes = ( totalMinutes % 60 ).toFixed( 0 );
          return (
            <TTCDeparture
              key = { index }
              dangerThreshold = { dangerThreshold }
              index = { index + 1 }
              minutes = { totalMinutes }
              missedThreshold = { missedThreshold }
              text = { `${ totalMinutes }m` }
              warningThreshold = { warningThreshold }
            />
          );
        } )
    );
  }

}

TTCRoute.defaultProps = {
  dangerThreshold: 5,
  departuresEastbound: [],
  departuresWestbound: [],
  id: 0,
  missedThreshold: 2,
  warningThreshold: 10
};

TTCRoute.propTypes = {
  dangerThreshold: PropTypes.number, // Minutes
  departuresEastbound: PropTypes.array.isRequired, // Array of minutes
  departuresWestbound: PropTypes.array.isRequired, // Array of minutes
  id: PropTypes.number.isRequired, // Stop number
  missedThreshold: PropTypes.number, // Minutes
  warningThreshold: PropTypes.number // Minutes
};
