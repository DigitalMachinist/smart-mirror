import d3 from 'd3';
import Moment from 'moment';

export function drawChart ( element, data, height, width, margins, precipitationMax = 10 ) {

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
      .domain( [ 0, precipitationMax ] )
      .range( [ innerHeight, 0 ] );

  var yScaleTemperature =
    d3
      .scale
      .linear()
      .domain( [
        d3.min( data, d => d.temperature ) - 5,
        d3.max( data, d => d.temperature ) + 5
      ] )
      .nice()
      .range( [ innerHeight, 0 ] );

  // Define the axes.
  var xAxis =
    d3
      .svg
      .axis()
      .scale( xScale )
      .orient( 'bottom' )
      .ticks( 10 )
      .tickFormat( d3.time.format( '%-I%p' ) )
      .innerTickSize( -innerHeight )
      .outerTickSize( 0 )
      .tickPadding( 5 );

  var yAxisPrecipitation =
    d3
      .svg
      .axis()
      .scale( yScalePrecipitation )
      .orient( 'right' )
      .ticks( 3 )
      .tickFormat( d => `${ d }mm` )
      .innerTickSize( 0 )
      .outerTickSize( 0 )
      .tickPadding( 5 );

  var yAxisTemperature =
    d3
      .svg
      .axis()
      .scale( yScaleTemperature )
      .orient( 'left' )
      .ticks( 5 )
      .tickFormat( d => `${ d }°` )
      .innerTickSize( -innerWidth )
      .outerTickSize( 0 )
      .tickPadding( 5 );

  // Define the datasets to be visualized.
  var precipitationArea =
    d3
    .svg
    .area()
    .interpolate( 'monotone' )
    .x( d => xScale( d.date ) )
    .y0( innerHeight )
    .y1( d => yScalePrecipitation( d.precipitation ) );

  var temperatureArea =
    d3
      .svg
      .area()
      .interpolate( 'monotone' )
      .x( d => xScale( d.date ) )
      .y0( innerHeight )
      .y1( d => yScaleTemperature( d.temperature ) );

  var temperatureLine =
    d3
      .svg
      .line()
      .interpolate( 'monotone' )
      .x( d => xScale( d.date ) )
      .y( d => yScaleTemperature( d.temperature ) );

  var svg =
    d3
      .select( element )
      .append( 'svg' )
      .attr( 'width', width )
      .attr( 'height', height )
      .append( 'g' )
      .attr( 'transform', `translate(${ margins.left },${ margins.top })` );

  // Add the axes.
  svg
    .append( 'g' )
    .attr( 'class', 'x axis time' )
    .attr( 'transform', `translate(0,${ innerHeight - 20 })` )
    .call( xAxis );

  // svg
  //   .append( 'g' )
  //   .attr( 'class', 'y axis precipitation' )
  //   .attr( 'transform', `translate(${ innerWidth },0)` )
  //   .call( yAxisPrecipitation );

  // svg
  //   .append( 'g' )
  //   .attr( 'class', 'y axis temperature' )
  //   .attr( 'transform', `translate(0,0)` )
  //   .call( yAxisTemperature );

  // Draw the datasets being visualized.
  svg
    .selectAll( '.area.temperature' )
    .data( [ data ] )
    .enter()
    .append( 'path' )
    .attr( 'class', 'area temperature' )
    .attr( 'd', temperatureArea );

  svg
    .selectAll( '.area.precipitation' )
    .data( [ data ] )
    .enter()
    .append( 'path' )
    .attr( 'class', 'area precipitation' )
    .attr( 'd', precipitationArea );

  svg
    .selectAll( '.line.temperature' )
    .data( [ data ] )
    .enter()
    .append( 'path' )
    .attr( 'class', 'line temperature' )
    .attr( 'd', temperatureLine );

  // Temperature labels shouldn't include the first or last data point, and they shouldn't
  // include data points less than 1 hour from now.
  const startLimit = Moment().add( 1, 'hours' );
  const labelData =
    data
      .slice( 1, data.length - 1 )
      .filter( d => Moment( d.date ) >= startLimit );

  // Draw tempaerature labels.
  svg
    .selectAll( '.label' )
    .data( labelData )
    .enter()
    .append( 'text' )
    .text( d => `${ Math.round( d.temperature ).toFixed( 0 ) }°` )
    .attr( 'class', 'label' )
    .attr( 'transform', d => {
      return `translate(${ xScale( d.date ) - 7 },${ yScaleTemperature( d.temperature ) - 7 })`;
    } );

  return svg;
}

export function eraseChart ( element ) {
  d3
    .select( element )
    .selectAll( 'svg' )
    .remove();
}
