import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import CourtBase from './CourtBase';

const IntroGraph = ({ csvFile }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null); // Ref for the parent container
  const [data, setData] = useState([]);
  const [containerWidth, setContainerWidth] = useState(500); // Initial width

  useEffect(() => {
    // Function to get container width
    const getContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Get initial width on mount
    getContainerWidth();

    // Update width on window resize (optional, but good for handling browser window resizing)
    const handleResize = () => {
      getContainerWidth();
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!csvFile) return;

    d3.csv(import.meta.env.BASE_URL + `/datas/${csvFile}`).then((loadedData) => {
      const formattedData = loadedData.map(d => ({
        x: +d.x,
        y: +d.y,
        year: d.year,
        zone: d.Zone
      }));
      setData(formattedData);
    }).catch(error => console.error("Error loading CSV:", error));
  }, [csvFile]);

  useEffect(() => {
    if (data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const colorScale = d3.scaleOrdinal()
      .domain(["2004", "2024"])
      .range(["#EFC1E3", "#0D676C"]);
    const years = ["2004", "2024"]; // Array of years for the legend

    // Remove existing tooltip
    d3.select(".tooltip-intro-graph").remove();

    // Create tooltip div
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip-intro-graph")
      .style("opacity", 0)
      .style("position", "absolute") // Ensure proper positioning
      .style("background-color", "white") // Add a background color
      .style("border", "1px solid black") // Add a border
      .style("padding", "5px") // Add some padding
      .style("pointer-events", "none"); // Allow interaction with elements underneath

    // Data join for circles
    const circles = svg.selectAll(".dot")
      .data(data);

    // Exit
    circles.exit().remove();

    // Enter
    const enterCircles = circles.enter().append("circle")
      .attr("class", d => `dot shot-year-${d.year}`)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 5); // Add a radius for better hover interaction

    enterCircles //Apply mousover event
      .on("mouseover", (event, d) => {

        // Show tooltip
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`Zone: ${d.zone}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        svg.selectAll(`.shot-year-2004`).style("opacity", 0.7);
        svg.selectAll(`.shot-year-2024`).style("opacity", 0.7);
        svg.selectAll(`.legend-circle-2004`).style("opacity", 1);
        svg.selectAll(`.legend-circle-2024`).style("opacity", 1);
        svg.selectAll(`.legend-text-2004`).style("font-weight", "normal").style("opacity", 1);
        svg.selectAll(`.legend-text-2024`).style("font-weight", "normal").style("opacity", 1);

        // Hide tooltip
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Merge enter and update selections
    const allCircles = enterCircles.merge(circles);

    // Apply common attributes
    allCircles
      .attr("r", 5)
      .attr("fill", d => colorScale(d.year))
      .style("opacity", 0.7);

    // Legend (Completely Revised for Circle Guarantee)
    const legend = svg.selectAll(".legend")
      .data(years);

    legend.exit().remove();

    const legendEnter = legend.enter()
      .append("g")
      .attr("class", d => `legend legend-${d}`)
      .attr("transform", (d, i) => `translate(${10 + i * 20}, 5)`) // Adjusted horizontal spacing to prevent overlap
      .on("mouseover", (event, d) => {
        svg.selectAll(`.shot-year-${d}`).style("opacity", 1);
        svg.selectAll(`.shot-year-${d === "2004" ? "2024" : "2004"}`).style("opacity", 0.2);
        svg.selectAll(`.legend-circle-${d}`).style("opacity", 1);
        svg.selectAll(`.legend-circle-${d === "2004" ? "2024" : "2004"}`).style("opacity", 0.2);
        svg.selectAll(`.legend-text-${d}`).style("font-weight", "normal").style("opacity", 1);
        svg.selectAll(`.legend-text-${d === "2004" ? "2024" : "2004"}`).style("opacity", 0.2);
      })
      .on("mouseout", () => {
        svg.selectAll(`.shot-year-2004`).style("opacity", 0.7);
        svg.selectAll(`.shot-year-2024`).style("opacity", 0.7);
        svg.selectAll(`.legend-circle-2004`).style("opacity", 1);
        svg.selectAll(`.legend-circle-2024`).style("opacity", 1);
        svg.selectAll(`.legend-text-2004`).style("font-weight", "normal").style("opacity", 1);
        svg.selectAll(`.legend-text-2024`).style("font-weight", "normal").style("opacity", 1);
      });

    legendEnter.append("circle")  // Explicitly create circles
      .attr("class", d => `legend-circle legend-circle-${d}`)  // Add specific class
      .attr("cx", 0) //Position of the circle to the left of the text
      .attr("cy", 0) //Position of the circle to be aligned with the text

    legendEnter.append("text")
      .attr("class", d => `legend-text legend-text-${d}`) // Add specific text class
      .attr("x", 2)  // Position text to the right of the circle
      .attr("y", 2)   // Vertically center the text relative to the circle
      .text(d => d);

    //legend.attr("transform", (d, i) => `translate(5, ${10 + i * 15})`);  // Adjusted vertical spacing

  }, [data]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: 'auto' }}> {/* Container div */}
      <CourtBase ref={svgRef} width={containerWidth} />
    </div>
  );
};

export default IntroGraph;