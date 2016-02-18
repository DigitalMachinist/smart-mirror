const settings = {
  'weather': {
    'width': 800,
    'height': 200,
    'apiKey': '5c084e3b39a49a5974701c58069592c6',
    'location': 'Toronto,CA',
    'forecastPeriod': 27,
    'pollingInterval': 1,
    'units': 'metric'
  },
  'ttc': {
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
}

export default Object.freeze( settings );
