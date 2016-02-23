require( './TTCSchedule.css' );

import { default as React, Component, PropTypes } from 'react';
import TTCRoute from './TTCRoute';

export default class TTCSchedule extends Component {

  constructor ( props ) {
    super( props );
    this.__renderTTCRoutes = this.__renderTTCRoutes.bind( this );
  }

  render () {
    return (
      <div className="ttc">
        { this.__renderTTCRoutes() }
      </div>
    );
  }

  __renderTTCRoutes () {
    const { data, maxDepartures } = this.props;
    return (
      data
        .sort( ( a, b ) => b.id - a.id )
        .map( ( route, i ) => {
          const { dangerThreshold, departuresEastbound, departuresWestbound, id, missedThreshold, warningThreshold } = route;
          return (
            <div
              key = { i }
            >
              { ( i > 0 ) ? <hr /> : '' }
              <TTCRoute
                dangerThreshold = { dangerThreshold }
                departuresEastbound = { departuresEastbound }
                departuresWestbound = { departuresWestbound }
                id = { id }
                maxDepartures = { maxDepartures }
                missedThreshold = { missedThreshold }
                warningThreshold = { warningThreshold }
              />
            </div>
          );
        } )
    );
  }

}

TTCSchedule.defaultProps = {
  data: [],
  maxDepartures: 3
};

TTCSchedule.propTypes = {
  data: PropTypes.array.isRequired,
  maxDepartures: PropTypes.number
};
