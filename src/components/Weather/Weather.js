require( './Weather.css' );

import { default as React, Component, PropTypes } from 'react';

export default class Weather extends Component {

  constructor ( props ) {
    super( props );
  }

  render () {
    const { condition, temperature } = this.props;
    return (
      <div className="weather">

      </div>
    );
  }

}

Weather.defaultProps = {
  condition: '',
  temperature: 0
};

Weather.propTypes = {
  condition: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired
};
