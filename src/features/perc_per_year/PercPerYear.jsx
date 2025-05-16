import React, { useEffect, useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from 'recharts';
import * as d3 from "d3";
// Import a new CSS file for this component's specific overrides
import './PercPerYear.css'; // Create this file

// Define colors outside component for easier management
const COLORS = {
    ThreePointShot: "#FFD700",
    MidRange: "#FF6B2D",
    RestrictedArea: "#707565",
    InThePaint: "#A65F44"
};
const VISIBLE_COLOR = "#e0e0e0";
const GRID_COLOR = "#555555";

// Define the keys consistently
const DATA_KEYS = ["ThreePointShot", "MidRange", "RestrictedArea", "InThePaint"];

// Mapping from internal keys to user-friendly display names
const DISPLAY_NAMES = {
    ThreePointShot: '3 Point Shot',
    MidRange: 'Mid-Range',
    RestrictedArea: 'Restricted Area (RA)',
    InThePaint: 'In the Paint (Non-RA)'
};

export default function PercPerYear({ years_to_highlight = [2004, 2011] }) {
    const [rawData, setRawData] = useState([]); // Renamed for clarity

    useEffect(() => {
        d3.csv(`/datas/perc_per_year_per_zone.csv`).then((loadedData) => {
            console.log("Loaded Data (Raw):", loadedData); // 1. Check raw loaded data

            const formattedData = loadedData.map(d => {
                // Helper function to safely parse numbers, return null if invalid
                const parsePercent = (value) => {
                    const num = parseFloat(value); // Use parseFloat
                    return isNaN(num) ? null : num;
                };

                return {
                    Year: +d.Year, // Keep year conversion simple
                    MidRange: parsePercent(d["Mid-Range"]),
                    InThePaint: parsePercent(d["In The Paint (Non-RA)"]),
                    RestrictedArea: parsePercent(d["Restricted Area"]),
                    ThreePointShot: parsePercent(d["3 Point Shot"]),
                };
            }).sort((a, b) => a.Year - b.Year);

            console.log("Formatted Data (for Chart):", formattedData); // 2. Check data passed to chart
            setRawData(formattedData); // Use setRawData

        }).catch(error => console.error("Error loading CSV:", error));
    }, []); // Empty dependency array means this runs once on mount

    // --- Data Transformation for Solid/Dashed ---
    const processedChartData = useMemo(() => {
        if (!rawData || rawData.length === 0) {
            console.log("useMemo: rawData is empty, returning [].");
            return [];
        }
        console.log("useMemo: Processing rawData with length:", rawData.length);
    
        const [startYear, endYear] = years_to_highlight;
        console.log(`useMemo: Highlight range ${startYear}-${endYear}`);
    
        // Calculate the resultData first using your existing map logic
        const resultData = rawData.map((d, index, arr) => {
            const year = d.Year;
            if (typeof year !== 'number' || isNaN(year)) {
                console.warn(`useMemo: Invalid year found in rawData item:`, d);
                return { Year: null }; // Return minimal object if year is invalid
            }
            const isHighlighted = year >= startYear && year <= endYear;
            const borders = year === startYear || year === endYear;
            let processedEntry = { Year: year };
    
            DATA_KEYS.forEach(key => {
                if (!d.hasOwnProperty(key)) {
                    console.warn(`useMemo: Key "${key}" not found in rawData item for year ${year}:`, d);
                    processedEntry[`${key}_solid`] = null;
                    processedEntry[`${key}_dashed`] = null;
                    return;
                }
                const value = d[key];
                processedEntry[`${key}_solid`] = isHighlighted ? value : null;
                processedEntry[`${key}_dashed`] = (!isHighlighted || borders) ? value : null;
    
                if (value !== null) {
                    if (year === startYear) {
                        processedEntry[`${key}_dashed`] = value;
                    }
                    if (year === endYear) {
                        processedEntry[`${key}_solid`] = value;
                    }
                }
            });
            return processedEntry;
        });
    
        // ========================================================
        // *** INSERT THE VALIDATION BLOCK HERE ***
        // This block CHECKS the resultData you just calculated
        // ========================================================
        if (resultData && resultData.length > 0) {
            console.log("VALIDATING Processed Chart Data...");
            let invalidFound = false;
            resultData.forEach((d, index) => {
                // Check Year
                if (typeof d.Year !== 'number' || isNaN(d.Year)) {
                    console.error(`Validation Error: Invalid Year at index ${index}`, d);
                    invalidFound = true;
                }
                // Check Sorting (simple check)
                if (index > 0 && resultData[index-1].Year >= d.Year) {
                     console.warn(`Validation Warning: Data might not be sorted correctly near index ${index}`, resultData[index-1], d);
                }
                // Check Keys and Values
                DATA_KEYS.forEach(key => {
                    const solidKey = `${key}_solid`;
                    const dashedKey = `${key}_dashed`;
                    if (!d.hasOwnProperty(solidKey) || !d.hasOwnProperty(dashedKey)) {
                         console.error(`Validation Error: Missing keys for ${key} at index ${index}`, d);
                         invalidFound = true;
                    }
                    const solidVal = d[solidKey];
                    const dashedVal = d[dashedKey];
                    // Check Type (must be number or null)
                    if (solidVal !== null && typeof solidVal !== 'number') {
                         console.error(`Validation Error: Invalid type for ${solidKey} at index ${index} (value: ${solidVal}, type: ${typeof solidVal})`, d);
                         invalidFound = true;
                    }
                    // Check Finite (no Infinity/NaN)
                    else if (solidVal !== null && !isFinite(solidVal)) {
                         console.error(`Validation Error: Non-finite number for ${solidKey} at index ${index} (value: ${solidVal})`, d);
                         invalidFound = true;
                    }
                     // Check Dashed Type
                     if (dashedVal !== null && typeof dashedVal !== 'number') {
                         console.error(`Validation Error: Invalid type for ${dashedKey} at index ${index} (value: ${dashedVal}, type: ${typeof dashedVal})`, d);
                         invalidFound = true;
                     }
                     // Check Dashed Finite
                     else if (dashedVal !== null && !isFinite(dashedVal)) {
                         console.error(`Validation Error: Non-finite number for ${dashedKey} at index ${index} (value: ${dashedVal})`, d);
                         invalidFound = true;
                     }
                });
            });
            // Final Validation Result
            if (!invalidFound) {
                console.log("%cValidation Passed for Processed Chart Data.", "color: lightgreen"); // Green color for success
            } else {
                 console.error("VALIDATION FAILED. Check errors above.");
                 // Optional: prevent rendering bad data
                 // return [];
            }
        }
        // *** END VALIDATION BLOCK ***
        // ========================================================
    
    
        // Log and return the data AFTER validation (the return value isn't changed by validation)
        console.log("useMemo: Final Processed Chart Data (Post-Validation):", resultData);
        return resultData;
    
    }, [rawData, years_to_highlight]);


    // *** DEFINE MINIMAL TEST DATA ***
    const simpleTestData = [
        { year: 2010, value_solid: 10, value_dashed: null }, // Inside default highlight [2004, 2011]
        { year: 2011, value_solid: 15, value_dashed: 15 },   // Boundary
        { year: 2012, value_solid: null, value_dashed: 20 }, // Outside default highlight
        { year: 2013, value_solid: null, value_dashed: 18 },
    ];
    console.log("USING SIMPLE TEST DATA:", simpleTestData);
    
    // --- Legend Formatter ---
    const formatLegend = (value, entry) => {
        // value is like "MidRange_solid" or "MidRange_dashed"
        const baseName = value.split('_')[0];
        if (value.endsWith('_solid')) {
            return DISPLAY_NAMES[baseName] || baseName; // Return the clean name
        }
        return null; // Hide the entry for the dashed part
    };

   // --- Tooltip Formatter ---
   const formatTooltip = (value, name, props) => {
       // name is like "MidRange_solid" or "MidRange_dashed"
       const baseName = name.split('_')[0];
       const formattedValue = `${value !== null ? value.toFixed(1) : 'N/A'}%`;
       // Return array: [formattedValue, baseName]
       // We only modify the name part here
       return [formattedValue, baseName];
   };



   // --- Render Logic ---
   if (!processedChartData || processedChartData.length === 0) {
        return (
            <div style={{ backgroundColor: '#2c2c2c', padding: '20px', borderRadius: '10px', color: 'orange', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No data available to display the chart after processing. Check console for details.
            </div>
        );
    }

    

    return (
        <div className="perc-per-zone-chart-wrapper">
            <div style={{ backgroundColor: '#252525', padding: '20px', borderRadius: '10px', height: '450px', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={processedChartData} // Use the processed data
                        margin={{ top: 5, right: 40, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="Year"
                            type="number"
                            domain={[2004, 2024]}
                            allowDataOverflow={true}
                            tickFormatter={(tick) => tick.toString()}
                            stroke={VISIBLE_COLOR}
                            tick={{ fill: VISIBLE_COLOR, fontSize: 12 }}
                            dy={10}
                        >
                            <Label value="Year" position="bottom" offset={10} fill={VISIBLE_COLOR} fontSize={14} />
                        </XAxis>
                        <YAxis
                            stroke={VISIBLE_COLOR}
                            tick={{ fill: VISIBLE_COLOR, fontSize: 12 }}
                            tickFormatter={(tick) => `${tick}%`}
                            dx={-5}
                            domain={[10, 'auto']}
                        >
                            <Label value="Percentage" angle={-90} position="left" offset={-5} fill={VISIBLE_COLOR} fontSize={14} style={{ textAnchor: 'middle' }} />
                        </YAxis>
                        <Legend
                            layout="horizontal"
                            verticalAlign="top"
                            align="right"
                            iconSize={12}
                            formatter={formatLegend} // Use updated legend formatter
                        />


                        
                        {/* --- Render Paired Lines --- */}
                        
                        {DATA_KEYS.map(key => (
                            <React.Fragment key={key}>
                                {/*Dashed lines*/}
                                <Line
                                    className={`line-${key}-dashed`} // Keep className for CSS
                                    type="monotone"
                                    dataKey={`${key}_dashed`} // Use dashed data key
                                    stroke={COLORS[key]}      // Original color
                                    strokeWidth={1}
                                    strokeDasharray="5 5"   // Apply dashing
                                    dot={false}
                                    activeDot={{ strokeWidth: 1, stroke: 'white', fill: COLORS[key], r: 5 }}
                                    connectNulls={false}     // ESSENTIAL
                                />
                                {/*Solid Lines*/}
                                <Line
                                    className={`line-${key}-solid`} // Keep className for CSS
                                    type="monotone"
                                    dataKey={`${key}_solid`} // Use solid data key
                                    stroke={COLORS[key]}     // Original color
                                    strokeWidth={2.5}
                                    // No strokeDasharray = solid
                                    dot={false}
                                    activeDot={{ strokeWidth: 1, stroke: 'white', fill: COLORS[key], r: 5 }}
                                    connectNulls={true}    // ESSENTIAL
                                    // name={key} // Name for tooltip reference before formatting
                                />
                            </React.Fragment>
                        ))}
                

                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}


