require( './Overview.css' );

import { default as React, Component, PropTypes } from 'react';
import Moment from 'moment';
import { getCurrentWeatherData } from '../../utils/OpenWeatherMap';

export default class Overview extends Component {

  constructor ( props ) {
    super( props );
  }

  render () {
    const { condition, date, temperature } = this.props;
    //console.log( temperature );
    //{ temperature.toFixed( 0 ) }
    return (
      <div className="overviewContainer">
        <div className="overview">
          <div className="time">
            <span className="value">{ Moment( date ).format( 'h:mm' ) }</span>
            <span className="period">{ Moment( date ).format( 'A' ) }</span>
          </div>
          <div className="details">
            <div className="date left">
              <span className="written">{ Moment( date ).format( 'dddd, MMMM' ).toUpperCase() }</span>
              <span className="numeric">{ Moment( date ).format( 'd' ) }</span>
            </div>
            <div className="temperature right">
              <span className="value">-33</span>
              <span className="degree">°</span>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    );
  }

}

Overview.defaultProps = {
  condition: '',
  date: new Date(),
  temperature: 0
};

Overview.propTypes = {
  condition: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  temperature: PropTypes.number.isRequired
};
