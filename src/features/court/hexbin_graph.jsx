import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from "d3-hexbin";
import CourtBase from './CourtBase';

const HexbinGraph = ({ selectedFile }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!selectedFile) return;

    d3.csv(import.meta.env.BASE_URL + `/datas/${selectedFile}`).then((loadedData) => {
      loadedData.forEach(d => {
        d.x = +d.x;
        d.y = +d.y;
        d.made = d.made === "True";
      });
      setData(loadedData);
    }).catch(error => console.error("Error loading CSV:", error));
  }, [selectedFile]);

  useEffect(() => {
    if (data.length === 0 || !svgRef.current) return; // Ensure SVG is available

    const svg = d3.select(svgRef.current);
    const hexbin = d3Hexbin().radius(1).extent([[0, 0], [50, 47]]);
    const bins = hexbin(data.map(d => [d.x, d.y, d.made]));

    bins.forEach(bin => {
      const totalShots = bin.length;
      const madeShots = bin.filter(d => d[2]).length;
      bin.fgPercentage = totalShots > 0 ? madeShots / totalShots : 0;
    });

    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([0, 1]);
    const radiusScale = d3.scalePow().exponent(0.1).domain([1, d3.max(bins, d => d.length/2)]).range([0.3, 1]);

    // Select all existing paths and bind the new data
    const paths = svg.selectAll(".hexbin-cell") // Give the hexbin paths a class
      .data(bins);

    // Exit: Remove any paths that are no longer in the data
    paths.exit().remove();

    // Enter: Create new paths for new data points
    paths.enter().append("path")
      .attr("class", "hexbin-cell") //Apply the class
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("d", d => hexbin.hexagon(radiusScale(d.length)))
      .attr("fill", '#ffbf69')
      //.attr("fill", d => colorScale(d.fgPercentage))
      .attr("stroke", "white")
      .attr("stroke-width", 0.1);

    // Update: Update existing paths that are already on the screen
    paths.attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("d", d => hexbin.hexagon(radiusScale(d.length)))
      //.attr("fill", d => colorScale(d.fgPercentage));
      
  }, [data]);

  return (
    <CourtBase ref={svgRef} />
  );
};

export default HexbinGraph;