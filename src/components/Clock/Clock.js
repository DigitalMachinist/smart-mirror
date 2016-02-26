require( './Clock.css' );

import { default as React, Component, PropTypes } from 'react';
import Moment from 'moment';
import { getCurrentWeatherData } from '../../utils/OpenWeatherMap';

export default class Clock extends Component {

  constructor ( props ) {
    super( props );
  }

  render () {
    const { condition, date } = this.props;
    const now = Moment( date );
    return (
      <div className="clock">
        <div className="display">
          <div className="time">
            { now.format( 'h:mm' ) }
          </div>
          <div className="weekday">
            { now.format( 'dddd' ) }
          </div>
          <div className="date">
            { now.format( 'MMMM Do' ) }
          </div>
        </div>
      </div>
    );
  }

}

Clock.defaultProps = {
  date: new Date()
};

Clock.propTypes = {
  date: PropTypes.object.isRequired
};
