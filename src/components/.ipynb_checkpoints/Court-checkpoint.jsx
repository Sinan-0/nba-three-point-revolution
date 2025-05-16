// src/components/Court.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Court = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 500;   // adjust as needed
    const height = 470;  // approximate half-court height in pixels

    // Clear previous content if any (helpful during re-renders)
    svg.selectAll('*').remove();

    // Set dimensions for the SVG container
    svg.attr("width", width).attr("height", height);

    // Example: Draw the baseline (bottom of the court)
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", height)
      .attr("x2", width)
      .attr("y2", height)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Example: Draw the sidelines (left and right)
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    svg.append("line")
      .attr("x1", width)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", height)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Example: Draw a circle for the hoop
    // Assuming the hoop is centered at the baseline, adjust coordinates as needed
    const hoopX = width / 2;
    const hoopY = height - 30;  // 30 pixels from baseline, for instance
    svg.append("circle")
      .attr("cx", hoopX)
      .attr("cy", hoopY)
      .attr("r", 10)  // adjust radius as needed
      .attr("stroke", "orange")
      .attr("fill", "none")
      .attr("stroke-width", 2);

    // Continue drawing other court elements (free-throw line, key, three-point arc, etc.)
    // For example, drawing the key:
    const keyWidth = 160; // adjust according to your scale
    const keyHeight = 190;
    svg.append("rect")
      .attr("x", (width - keyWidth) / 2)
      .attr("y", height - keyHeight)
      .attr("width", keyWidth)
      .attr("height", keyHeight)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", 2);

    // You can also add shot data points if needed:
    // For example, assume you have shot data as an array:
    const shots = [{x: 250, y: 350, made: true}, {x: 100, y: 350, made: false}];
    shots.forEach(d => {
       svg.append("circle")
         .attr("cx", d.x)
         .attr("cy", d.y)
         .attr("r", 4)
         .attr("fill", d.made ? "green" : "red");
     });
  }, []);

  return <svg ref={svgRef} />;
};

export default Court;
