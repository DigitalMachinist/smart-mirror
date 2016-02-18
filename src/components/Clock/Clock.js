import { default as React, Component, PropTypes } from 'react';

export default class Clock extends Component {

  constructor ( props ) {
    super( props );
    this.state = {
    };
  }

  render () {
    const { routes } = this.state;
    return (
      <div className="clock">
      </div>
    );
  }

  componentDidMount () {
  }

}

Clock.defaultProps = {
};

Clock.propTypes = {
};
