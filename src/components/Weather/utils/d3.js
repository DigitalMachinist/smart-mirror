import d3 from 'd3';

export function drawChart ( element, data, height, width, margins ) {

  // Set the dimensions of the graph.
  var innerWidth = width - margins.left - margins.right;
  var innerHeight = height - margins.top - margins.bottom;

  // Define the scales.
  var xScale =
    d3
      .time
      .scale()
      .domain( [
        d3.min( data, d => d.date ),
        d3.max( data, d => d.date )
      ] )
      .range( [ 0, innerWidth ] );

  var yScalePrecipitation =
    d3
      .scale
      .linear()
      .domain( [ 0, 10 ] )
      .range( [ innerHeight, 0 ] );

  var yScaleTemperature =
    d3
      .scale
      .linear()
      .domain( [
        d3.min( data, d => d.temperature ) - 2,
        d3.max( data, d => d.temperature ) + 2
      ] )
      .range( [ innerHeight, 0 ] );

  // Define the axes.
  var xAxis =
    d3
      .svg
      .axis()
      .scale( xScale )
      .orient( 'bottom' )
      .ticks( 5 )
      .tickFormat( d3.time.format( '%-I%p' ) )
      .innerTickSize( -innerHeight )
      .outerTickSize( 0 )
      .tickPadding( 15 );

  var yAxisPrecipitation =
    d3
      .svg
      .axis()
      .scale( yScalePrecipitation )
      .orient( 'right' )
      .ticks( 3 )
      .tickFormat( d => d + 'mm' )
      .innerTickSize( 0 )
      .outerTickSize( 0 )
      .tickPadding( 15 );

  var yAxisTemperature =
    d3
      .svg
      .axis()
      .scale( yScaleTemperature )
      .orient( 'left' )
      .ticks( 4 )
      .tickFormat( d => d + '°' )
      .innerTickSize( -innerWidth )
      .outerTickSize( 0 )
      .tickPadding( 15 );

  // Define the datasets to be visualized.
  var precipitationSeries =
    d3
    .svg
    .area()
    .x( d => xScale( d.date ) )
    .y0( innerHeight )
    .y1( d => yScalePrecipitation( d.precipitation ) );

  var temperatureSeries =
    d3
      .svg
      .line()
      .interpolate( 'linear' )
      .x( d => xScale( d.date ) )
      .y( d => yScaleTemperature( d.temperature ) );

  var svg =
    d3
      .select( element )
      .append( 'svg' )
      .attr( 'width', width )
      .attr( 'height', height )
      .append( 'g' )
      .attr( 'transform', 'translate(' + margins.left + ',' + margins.top + ')' );

  // Add the axes.
  svg
    .append( 'g' )
    .attr( 'class', 'x axis' )
    .attr( 'transform', 'translate(0,' + innerHeight + ')' )
    .call( xAxis );

  svg
    .append( 'g' )
    .attr( 'class', 'y axis' )
    .attr( 'transform', 'translate(' + innerWidth + ',0)' )
    .call( yAxisPrecipitation );

  svg
    .append( 'g' )
    .attr( 'class', 'y axis' )
    .call( yAxisTemperature );

  // Draw the datasets being visualized.
  svg
    .append( 'path' )
    .datum( data )
    .attr( 'class', 'area' )
    .attr( 'd', precipitationSeries );

  svg
    .append( 'path' )
    .datum( data )
    .attr( 'class', 'line' )
    .attr( 'd', temperatureSeries );

  return svg;
}

export function eraseChart ( element ) {
  d3
    .select( element )
    .selectAll( 'svg' )
    .remove();
}
