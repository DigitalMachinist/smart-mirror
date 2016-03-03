require( './Weather.css' );

import { default as React, Component, PropTypes } from 'react';

export default class Weather extends Component {

  constructor ( props ) {
    super( props );
    this.__getIconSettings = this.__getIconSettings.bind( this );
    this.__renderTemperature = this.__renderTemperature.bind( this );
  }

  render () {
    const { data, iconMap } = this.props;
    const { conditionCode, isExtreme, temperature, sunrise, sunset, temperatureMax, temperatureMin } = data;
    const extremeClass = isExtreme ? ' extreme' : '';
    const iconSettings = this.__getIconSettings( iconMap, conditionCode, sunrise, sunset );
    const tempHigh = Math.max( temperature, temperatureMax );
    const tempLow = Math.min( temperature, temperatureMin );
    return (
      <div className="weather">
        <div className="display">
          <div className={ `icon wi wi-${ iconSettings.icon }` }></div>
          <div className={ `description${ extremeClass }` }>{ iconSettings.description }</div>
          <div className="temperature">{ this.__renderTemperature( temperature ) }</div>
          <div className="clearfix">
            <div className="temp low left">
              <div className="title">Low</div>
              <div className="value">{ this.__renderTemperature( tempLow ) }</div>
            </div>
            <div className="temp high right">
              <div className="title">High</div>
              <div className="value">{ this.__renderTemperature( tempHigh ) }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  __renderTemperature ( value ) {
    return !!value
      ? `${ Math.round( value ).toFixed( 0 ) }°`
      : '';
  }

  __getIconSettings ( iconMap, conditionCode, sunriseDate, sunsetDate ) {
    if ( !iconMap || !conditionCode ) {
      return '';
    }
    const now = new Date();
    const iconKey =
      conditionCode
        .toFixed( 0 )
        .concat( ( now > sunriseDate && now < sunsetDate ) ? '-day' : '-night' );
    return iconMap[ iconKey ];
  }

}

Weather.defaultProps = {
  data: {},
  iconMap: {}
};

Weather.propTypes = {
  data: PropTypes.object.isRequired,
  iconMap : PropTypes.object.isRequired
};
