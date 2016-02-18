import { default as React, Component, PropTypes } from 'react';
import TTCDeparture from './TTCDeparture';

export default class TTCRoute extends Component {

  constructor ( props ) {
    super( props );
  }

  render () {
    const { dangerThreshold, departuresEastbound, departuresWestbound, id, missedThreshold, warningThreshold } = this.props;
    return (
      <div className="route">
        <div className="number">
          <span>{ id }</span>
        </div>
        <div className="direction eastbound">
          <div className="title column">E</div>
          {
            departuresEastbound
              .reduce( ( three, departure, i ) => ( i >= 3 ) ? three : three.concat( departure ), [] )
              .map( ( departure, index ) => {
                return (
                  <TTCDeparture
                    key = { index }
                    dangerThreshold = { dangerThreshold }
                    index = { index + 1 }
                    minutes = { departure }
                    missedThreshold = { missedThreshold }
                    postfix = { 'm' }
                    warningThreshold = { warningThreshold }
                  />
                )
              } )
          }
        </div>
        <div className="direction westbound">
          <div className="title column">W</div>
          {
              departuresWestbound
                .reduce( ( three, departure, i ) => ( i >= 3 ) ? three : three.concat( departure ), [] )
                .map( ( departure, index ) => {
                  return (
                    <TTCDeparture
                      key = { index }
                      dangerThreshold = { dangerThreshold }
                      index = { index + 1 }
                      minutes = { departure }
                      missedThreshold = { missedThreshold }
                      postfix = { 'm' }
                      warningThreshold = { warningThreshold }
                    />
                  )
                } )
          }
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
