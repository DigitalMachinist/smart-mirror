require( './Weather.css' );

import { default as React, Component, PropTypes } from 'react';

export default class Weather extends Component {

  constructor ( props ) {
    super( props );
    this.__getIconData = this.__getIconData.bind( this );
    this.__renderTemperature = this.__renderTemperature.bind( this );
  }

  render () {
    const { data } = this.props;
    const { conditionCode, isExtreme, temperature, temperatureMax, temperatureMin } = data;
    const extremeClass = isExtreme ? ' extreme' : '';
    const iconData = this.__getIconData();
    const tempHigh = Math.max( temperature, temperatureMax );
    const tempLow = Math.min( temperature, temperatureMin );
    return (
      <div className="weather">
        <div className="display">
          <div className={ `icon wi wi-${ iconData.icon }` }></div>
          <div className={ `description${ extremeClass }` }>{ iconData.description }</div>
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

  __getIconData () {
    const { data, iconMap } = this.props;
    const { conditionCode, sunset, sunrise } = data;

    if ( !iconMap || !conditionCode ) {
      return '';
    }

    let iconKey = conditionCode.toFixed( 0 );
    const isDayNightCondition =
      !( conditionCode > 699 && conditionCode < 800 ) &&
      !( conditionCode > 899 && conditionCode < 1000 );
    if ( isDayNightCondition ) {
      const now = new Date();
      iconKey +=
        ( now > sunrise && now < sunset )
          ? '-day'
          : '-night';
    }

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
