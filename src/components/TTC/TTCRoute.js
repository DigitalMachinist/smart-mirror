import { default as React, Component, PropTypes } from 'react';
import TTCDeparture from './TTCDeparture';

export default class TTCRoute extends Component {

  constructor ( props ) {
    super( props );
  }

  render () {
    const { dangerThreshold, departuresEastbound, departuresWestbound, id, missedThreshold, warningThreshold } = this.props;
    return (
      <div className="routeContainer">
        <div className="route">
          <div className="number">
            <span>{ id }</span>
          </div>
          <div className="direction eastbound">
            <div className="title column">E</div>
            {
              departuresEastbound
                .reduce( ( departures, departure, i ) => ( i >= 4 ) ? departures : departures.concat( departure ), [] )
                .map( ( totalMinutes, index ) => {
                  const hours = Math.floor( totalMinutes / 60 );
                  const minutes = ( totalMinutes % 60 ).toFixed( 0 );
                  return (
                    <TTCDeparture
                      key = { index }
                      dangerThreshold = { dangerThreshold }
                      index = { index + 1 }
                      minutes = { totalMinutes }
                      missedThreshold = { missedThreshold }
                      text = { `${ hours }:${ ( ( minutes < 10 ) ? '0' : '' ) }${ minutes }` }
                      warningThreshold = { warningThreshold }
                    />
                  );
                } )
            }
          </div>
          <div className="direction westbound">
            <div className="title column">W</div>
            {
                departuresWestbound
                  .reduce( ( departures, departure, i ) => ( i >= 3 ) ? departures : departures.concat( departure ), [] )
                  .map( ( totalMinutes, index ) => {
                    const hours = Math.floor( totalMinutes / 60 );
                    const minutes = ( totalMinutes % 60 ).toFixed( 0 );
                    return (
                      <TTCDeparture
                        key = { index }
                        dangerThreshold = { dangerThreshold }
                        index = { index + 1 }
                        minutes = { totalMinutes }
                        missedThreshold = { missedThreshold }
                        text = { `${ hours }:${ ( ( minutes < 10 ) ? '0' : '' ) }${ minutes }` }
                        warningThreshold = { warningThreshold }
                      />
                    );
                  } )
            }
          </div>
        </div>
      </div>
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
