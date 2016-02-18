import { default as React, Component, PropTypes } from 'react';

export default class TTCDeparture extends Component {

  constructor ( props ) {
    super( props );
  }

  render () {
    const { dangerThreshold, index, minutes, missedThreshold, text, warningThreshold } = this.props;
    let warningClass = '';
    if ( minutes <= missedThreshold ) {
      warningClass = ' missed';
    }
    else if ( minutes <= dangerThreshold ) {
      warningClass = ' danger';
    }
    else if ( minutes <= warningThreshold ) {
      warningClass = ' warning';
    }
    const className = `departure d${ index } column${ warningClass }`;
    return (
      <div className={ className }>
        { text }
      </div>
    );
  }

}

TTCDeparture.defaultProps = {
  dangerThreshold: 5,
  index: 0,
  minutes: 0,
  missedThreshold: 2,
  text: '',
  warningThreshold: 10
};

TTCDeparture.propTypes = {
  dangerThreshold: PropTypes.number, // Minutes
  index: PropTypes.number.isRequired, // Index in departures array
  minutes: PropTypes.number.isRequired, // Minutes
  missedThreshold: PropTypes.number, // Minutes
  text: PropTypes.string.isRequired, // String to display
  warningThreshold: PropTypes.number // Minutes
};
