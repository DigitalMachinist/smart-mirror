require( './TTC.css' );

import { default as React, Component, PropTypes } from 'react';
import getTTCDepartureData from './utils/api';
import TTCRoute from './TTCRoute';

export default class TTC extends Component {

  constructor ( props ) {
    super( props );
    this.__updateDeparturesData = this.__updateDeparturesData.bind( this );
    this.state = {
      routes: []
    };
  }

  render () {
    const { routes } = this.state;
    return (
      <div className="ttc">
        {
          routes
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
              )
            } )
        }
      </div>
    );
  }

  componentDidMount () {
    const { pollingInterval } = this.props;
    this.__updateDeparturesData();
    if ( pollingInterval > 0 ) {
      const pollingHandle = setInterval( this.__updateDeparturesData, pollingInterval * 60 * 1000 );
      this.setState( { pollingHandle } );
    }
  }

  __updateDeparturesData () {
    const { routes } = this.props;
    getTTCDepartureData( routes )
      .then( routes => this.setState( { routes } ) );
  }

}

TTC.defaultProps = {
  dangerThreshold: 5,
  missedThreshold: 2,
  pollingInterval: 60,
  routes: [],
  warningThreshold: 10
};

TTC.propTypes = {
  dangerThreshold: PropTypes.number, // Minutes
  missedThreshold: PropTypes.number, // Minutes
  pollingInterval: PropTypes.number, // Minutes
  routes: PropTypes.array.isRequired, // { departuresEastbound, departuresWestbound, id }
  warningThreshold: PropTypes.number // Minutes
};
