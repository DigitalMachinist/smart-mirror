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
    const { data } = this.props;
    return (
      data
        .sort( ( a, b ) => b.id - a.id )
        .map( ( route, index ) => {
          const { dangerThreshold, departuresEastbound, departuresWestbound, id, missedThreshold, warningThreshold } = route;
          return (
            <TTCRoute
              key = { index }
              dangerThreshold = { dangerThreshold }
              departuresEastbound = { departuresEastbound }
              departuresWestbound = { departuresWestbound }
              id = { id }
              missedThreshold = { missedThreshold }
              warningThreshold = { warningThreshold }
            />
          );
        } )
    );
  }

}

TTCSchedule.defaultProps = {
  data: []
};

TTCSchedule.propTypes = {
  data: PropTypes.array.isRequired
};
