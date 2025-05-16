/*
Script took from Initial script copied from here: https://github.com/mc-buckets/d3-shotchart/blob/master/src/court.js
Just translated to a jsx file
*/

// src/components/Court.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from "d3-hexbin";

const Court = ({ selectedFile }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  //Data depending on the selected file
  useEffect(() => {
        if (!selectedFile) return;
    
        d3.csv(`/datas/${selectedFile}`).then((loadedData) => {
          loadedData.forEach(d => {
            d.x = +d.x;
            d.y = +d.y;
            d.made = d.made === "True"; // Convert 'made' to boolean
          });
    
          setData(loadedData);
        }).catch(error => console.error("Error loading CSV:", error));
      }, [selectedFile]);

  useEffect(() => {
    const width = 500;
    const height = 0.94 * width;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 50 47`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .classed('court', true);

    // Clear previous content if any
    svg.selectAll('*').remove();

    // Set dimensions for the SVG container
    svg.attr("width", width)
       .attr("height", height)
       //.attr("viewBox", `0 0 ${width} ${height}`)
       ;

       
    // Define yScale
    const yScale = d3.scaleLinear().domain([0, 47]).rangeRound([47, 0])


    // Append the outer paint rectangle
    svg.append('g')
       .classed('court-paint', true)
       .append('rect')
       .attr('width', 16)
       .attr('height', 19)
       .attr('x', 25)
       .attr('transform', 'translate(-8, 0)')
       .attr('y', yScale(19));

    
    // Append inner paint lines
    svg.append('g')
       .classed('inner-court-paint', true)
       .append('line')
       .attr('x1', 19)
       .attr('x2', 19)
       .attr('y1', yScale(19))
       .attr('y2', yScale(0));

    svg.append('g')
       .classed('inner-court-paint', true)
       .append('line')
       .attr('x1', 31)
       .attr('x2', 31)
       .attr('y1', yScale(19))
       .attr('y2', yScale(0));

    
    // Append foul circle
    const dashedFoulCircle = svg.append('g')
                                 .classed('foul-circle dashed', true);
    dashedFoulCircle.append('defs')
                     .append('clipPath')
                     .attr('id', 'cut-off-top')
                     .append('rect')
                     .attr('width', 12)
                     .attr('height', 6)
                     .attr('x', 25)
                     .attr('y', yScale(19))
                     .attr('transform', 'translate(-6, 0)');
    dashedFoulCircle.append('circle')
                     .attr('cx', 25)
                     .attr('cy', yScale(19))
                     .attr('r', 6)
                     .attr('stroke-dasharray', '1,1')
                     .attr('clip-path', 'url(#cut-off-top)');

    const solidFoulCircle = svg.append('g')
                               .classed('foul-circle solid', true);
    solidFoulCircle.append('defs')
                    .append('clipPath')
                    .attr('id', 'cut-off-bottom')
                    .append('rect')
                    .attr('width', 12)
                    .attr('height', 6)
                    .attr('x', 25)
                    .attr('y', yScale(19))
                    .attr('transform', 'translate(-6, -6)');
    solidFoulCircle.append('circle')
                    .attr('cx', 25)
                    .attr('cy', yScale(19))
                    .attr('r', 6)
                    .attr('clip-path', 'url(#cut-off-bottom)');

    // Add backboard and rim
    svg.append('g')
       .classed('backboard', true)
       .append('line')
       .attr('x1', 22)
       .attr('x2', 28)
       .attr('y1', yScale(4))
       .attr('y2', yScale(4));

    svg.append('g')
       .classed('rim', true)
       .append('circle')
       .attr('cx', 25)
       .attr('cy', yScale(4.75))
       .attr('r', 0.75);

    // Add restricted area
    const restrictedArea = svg.append('g')
                               .classed('restricted-area', true);
    restrictedArea.append('defs')
                  .append('clipPath')
                  .attr('id', 'restricted-cut-off')
                  .append('rect')
                  .attr('width', 8)
                  .attr('height', 4)
                  .attr('x', 25)
                  .attr('y', yScale(4.75))
                  .attr('transform', 'translate(-4, -4)');
    restrictedArea.append('circle')
                  .attr('cx', 25)
                  .attr('cy', yScale(4.75))
                  .attr('r', 4)
                  .attr('clip-path', 'url(#restricted-cut-off)');
    restrictedArea.append('line')
                  .attr('x1', 21)
                  .attr('x2', 21)
                  .attr('y1', yScale(5.25))
                  .attr('y2', yScale(4));
    restrictedArea.append('line')
                  .attr('x1', 29)
                  .attr('x2', 29)
                  .attr('y1', yScale(5.25))
                  .attr('y2', yScale(4));

    // Add 3-point arc
    const threePointArea = svg.append('g')
                               .classed('three-point-area', true);
    threePointArea.append('defs')
                  .append('clipPath')
                  .attr('id', 'three-point-cut-off')
                  .append('rect')
                  .attr('width', 44)
                  .attr('height', 23.75)
                  .attr('x', 25)
                  .attr('y', yScale(4.75))
                  .attr('transform', 'translate(-22, -23.75)');
    threePointArea.append('circle')
                  .attr('cx', 25)
                  .attr('cy', yScale(4.75))
                  .attr('r', 23.75)
                  .attr('clip-path', 'url(#three-point-cut-off)');
    threePointArea.append('line')
                  .attr('x1', 3)
                  .attr('x2', 3)
                  .attr('y1', yScale(14))
                  .attr('y2', yScale(0));
                  threePointArea.append('line')
                  .attr('x1', 47)
                  .attr('x2', 47)
                  .attr('y1', yScale(14))
                  .attr('y2', yScale(0)); 

    // Add key lines
    const keyLines = svg.append('g')
                        .classed('key-lines', true);
    keyLines.append('line')
            .attr('x1', 16)
            .attr('x2', 17)
            .attr('y1', yScale(7))
            .attr('y2', yScale(7));
    keyLines.append('line')
            .attr('x1', 16)
            .attr('x2', 17)
            .attr('y1', yScale(8))
            .attr('y2', yScale(8));
    keyLines.append('line')
            .attr('x1', 16)
            .attr('x2', 17)
            .attr('y1', yScale(11))
            .attr('y2', yScale(11));
    keyLines.append('line')
            .attr('x1', 16)
            .attr('x2', 17)
            .attr('y1', yScale(14))
            .attr('y2', yScale(14));
    keyLines.append('line')
            .attr('x1', 33)
            .attr('x2', 34)
            .attr('y1', yScale(7))
            .attr('y2', yScale(7));
    keyLines.append('line')
            .attr('x1', 33)
            .attr('x2', 34)
            .attr('y1', yScale(8))
            .attr('y2', yScale(8));
    keyLines.append('line')
            .attr('x1', 33)
            .attr('x2', 34)
            .attr('y1', yScale(11))
            .attr('y2', yScale(11));
    keyLines.append('line')
            .attr('x1', 33)
            .attr('x2', 34)
            .attr('y1', yScale(14))
            .attr('y2', yScale(14));

    // Append baseline
    svg.append('g')
       .classed('court-baseline', true)
       .append('line')
       .attr('x1', 0)
       .attr('x2', 50)
       .attr('y1', yScale(0))
       .attr('y2', yScale(0));


     
      //----------Draw Shots---------------
      if (data.length === 0) return;

     // Define hexbin generator
     const baseRadius = 1;
     const hexbin = d3Hexbin()
     .radius(baseRadius) // Size of hexagons
     .extent([[0, 0], [50, 47]]); // Court dimensions

     // Group shots into hexagons
     const bins = hexbin(data.map(d => [d.x, d.y, d.made]));

     // Compute FG% per bin --> does not work somehow -> bin.fgPercentafe is not really used
     bins.forEach(bin => {
        const totalShots = bin.length;
        const madeShots = bin.filter(d => d[2]).length;
        bin.fgPercentage = totalShots > 0 ? madeShots / totalShots : 0;
        //console.log(`Shots: ${totalShots}, Made: ${madeShots}, FG%: ${bin.fgPercentage}`);
      });

   // Define color scale based on shot count
   //const colorScale = d3.scaleSequential(d3.interpolateOrRd).domain([0, d3.max(bins, d => d.length/5)]); //orange-red scale
   const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([0, 1]); //RED-YELLOW-GREEN based on fg percentage

     //Define a radius scale
     const radiusScale = d3.scalePow() // Square root scale gives better scaling
     .exponent(0.1) 
     .domain([1, d3.max(bins, d => d.length/2)])
     .range([0.1, 1]); // Min and max hex sizes

   // Draw hexagons
   svg.selectAll("path")
     .data(bins)
     .enter().append("path")
     //.attr("d", d => `M${d.x},${d.y}${hexbin.hexagon(0.75)}`) // Hexagon shape: uncomment to have static shape size
     .attr("transform", d => `translate(${d.x},${d.y})`) //Hexagon shape: dynamic
     .attr("d", d => hexbin.hexagon(radiusScale(d.length))) //Hexagon shape: dynamic
     //.attr("fill", "#ff4500") //Hexagon color: static
     //.attr("fill", d => colorScale(d.length)) //hexagon color: dynamic
     .attr("fill", d => colorScale(d.fgPercentage)) //based on percentage
     .attr("stroke", "white")
     .attr("stroke-width", 0.1);

     // Create the shot data container
    //svg.append('g').classed('shots', true);
     

  }, [data]);  // Empty dependency array, meaning this effect runs only once when the component mounts

  return (
    <svg ref={svgRef} />
  );
};

export default Court;

 
