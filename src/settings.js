const settings = {
  'weather': {
    'apiKey': '5c084e3b39a49a5974701c58069592c6',
    'location': 'Toronto,CA',
    'units': 'metric',
    'forecastPeriod': 27,
    'pollingInterval': 5,
    'precipitationMax': 10,
    'width': 405,
    'height': 150,
    'margins': {
      'top': 10,
      'right': 15,
      'bottom': 15,
      'left': 35
    }
  },
  'ttcRoutes': {
    'pollingInterval': 1,
    'routes': [ {
      'id': 26,
      'stopEastbound': 7919,
      'stopWestbound': 3652,
      'warningThreshold': 15,
      'dangerThreshold': 10,
      'missedThreshold': 5
    }, {
      'id': 30,
      'stopEastbound': 4444,
      'stopWestbound': 4744,
      'warningThreshold': 10,
      'dangerThreshold': 5,
      'missedThreshold': 2
    }, {
      'id': 40,
      'stopEastbound': 4444,
      'stopWestbound': 4744,
      'warningThreshold': 10,
      'dangerThreshold': 5,
      'missedThreshold': 2
    } ]
  }
};

export default Object.freeze( settings );
