import { default as React, Component, PropTypes } from 'react';
import TTCDeparture from './TTCDeparture';

export default class TTCRoute extends Component {

  constructor ( props ) {
    super( props );
    this.__renderTTCDepartures = this.__renderTTCDepartures.bind( this );
  }

  render () {
    const { departuresEastbound, departuresWestbound, id, maxDepartures } = this.props;
    return (
      <div className="route clearfix">
        <div className="number">
          <span>{ id }</span>
        </div>
        <div className="direction eastbound left">
          <div className="title">E</div>
          { this.__renderTTCDepartures( departuresEastbound, maxDepartures ) }
        </div>
        <div className="direction westbound right">
          <div className="title">W</div>
          { this.__renderTTCDepartures( departuresWestbound, maxDepartures ) }
        </div>
      </div>
    );
  }

  __renderTTCDepartures ( departures, max ) {
    const { dangerThreshold, id, maxDepartures, missedThreshold, warningThreshold } = this.props;
    return (
      departures
        .reduce( ( take, departure, i ) => {
          return ( i < max )
            ? take.concat( departure )
            : take;
        }, [] )
        .map( ( totalMinutes, index ) => {
          return (
            <TTCDeparture
              key = { index }
              dangerThreshold = { dangerThreshold }
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
  maxDepartures: 3,
  missedThreshold: 2,
  warningThreshold: 10
};

TTCRoute.propTypes = {
  dangerThreshold: PropTypes.number, // Minutes
  departuresEastbound: PropTypes.array.isRequired, // Array of minutes
  departuresWestbound: PropTypes.array.isRequired, // Array of minutes
  id: PropTypes.number.isRequired, // Stop number
  maxDepartures: PropTypes.number, // Max # of departures to display
  missedThreshold: PropTypes.number, // Minutes
  warningThreshold: PropTypes.number // Minutes
};
