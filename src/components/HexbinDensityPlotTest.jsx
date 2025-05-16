import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';

const HexbinDensityPlot = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // Append the svg object to the div with id 'my_dataviz'
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Read data
    d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_for_density2d.csv').then(data => {
      // Add X axis
      const x = d3.scaleLinear()
        .domain([5, 18])
        .range([0, width]);
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([5, 20])
        .range([height, 0]);
      svg.append('g')
        .call(d3.axisLeft(y));

      // Reformat the data: d3.hexbin() needs a specific format
      const inputForHexbinFun = data.map(d => [x(d.x), y(d.y)]);

      // Prepare a color palette
      const color = d3.scaleLinear()
        .domain([0, 600]) // Number of points in the bin?
        .range(['transparent', '#69b3a2']);

      // Compute the hexbin data
      const hexbinGenerator = hexbin()
        .radius(9) // size of the bin in px
        .extent([[0, 0], [width, height]]);

      // Plot the hexbins
      svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

      svg.append('g')
        .attr('clip-path', 'url(#clip)')
        .selectAll('path')
        .data(hexbinGenerator(inputForHexbinFun))
        .enter().append('path')
        .attr('d', hexbinGenerator.hexagon())
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .attr('fill', d => color(d.length))
        .attr('stroke', 'black')
        .attr('stroke-width', '0.1');
    });
  }, []);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default HexbinDensityPlot;
