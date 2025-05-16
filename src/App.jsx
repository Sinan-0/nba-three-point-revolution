import React, { useState } from "react";
import ScrollySection from "./components/ScrollySection.jsx";
import IntroGraph from "./features/court/IntroGraph.jsx";
import HexbinGraph from "./features/court/hexbin_graph.jsx";
import PercPerYear from "./features/perc_per_year/PercPerYear.jsx";
import "./index.css";

const App = () => {

  //For the Hexbin chart showing shot distribution per Year
  const [selectedYear, setSelectedYear] = useState(2004); //2004 by default
  const handleSliderChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };


  return (
    <div className="App">
      <section className="intro">
        <h1>NBA's Shifting Landscape: The Three-Point Revolution Visualized</h1>
        <h2>Introduction</h2>
        <p style={{ fontSize: '1.5em' }}>As someone relatively new to the world of basketball, I've been intrigued by the talk of how much the game has evolved. One of the biggest changes everyone mentions is shot selection: the rise of the three-pointer and the decline of the Mid-Range.</p>
        <p style={{ fontSize: '1.5em' }}>So, I decided to dig into the data myself. To start, let's take a look at shot distributions from 500 randomly selected shots taken in 2004 and 2024.</p>
      </section>

      <br></br>

       
      <section className="intro-graph-text">
        <h3>500 randomly selected shots in 2004 vs 2024</h3>
        <p><i>New to basketball zones? Hover over the points in the graph to explore which shots come from where!</i></p>
        <div className="intro-graph">
          <IntroGraph csvFile={`rand_shots_5games_2004_and_2024.csv`} />
          <div className="intro-explanatory-text">
          <p>Here's some observations:</p>
            <ul>
              <li><b>Mid-Range Decline:</b> Mid-Range shot attempts decreased substantially, from <b>176</b> in 2004 to just <b>55</b> in 2024.</li>
              <li><b>Three-Point Surge:</b> Three-point attempts more than doubled, increasing from <b>93</b> in 2004 to <b>201</b> in 2024.</li>
              <li><b>Restricted Area Stability:</b> Shots in the restricted area remained relatively consistent, hovering around 150 in both 2004 and 2024.</li>
            </ul>
            <p>These initial figures reveal a dramatic shift in offensive strategy within the NBA. The data suggests a clear movement away from the Mid-Range in favor of the three-point shot. This overview sets the stage for a deeper visualization of this evolution and its driving factors, which we'll explore next.</p>
          </div>
        </div>
      </section>

      <div class="transition_intro_evolution" style={{paddingTop: '20px'}}>
        <h2>Evolution of the Proportion of Shots Taken per Zone</h2>
        <p style={{width: '80%', marginLeft: 'auto', marginRight:'auto'}}>Let's explore how NBA teams have changed their shot selection over the years, with a focus on where shots are taken on the court. In the following, we will highlight 3 different time periods, and the proportion of shots taken for each zone.</p>
        <p style={{width: '80%', marginLeft: 'auto', marginRight:'auto'}}><i>If you would like to better understand the zones, hover over the points in the graph above!</i></p>
      </div>

      <div class="perc-per-year" style={{paddingTop: '10px'}}>
        <h3>2004-2011: Mid-Range and Restricted Area Dominate</h3>
        <PercPerYear years_to_highlight={[2004, 2011]}/>
        <p style={{width: '80%', marginLeft: 'auto', marginRight:'auto'}}>
          <strong>Observation: </strong>During this period, the Mid-Range shot was the most common in the NBA alongside shots in the Restricted Area. Around 2/3 of the shots were taken from these 2 zones.
          The Three point shot was slowly gaining popularity as it went from 18% to 22% of the shots taken.
        </p>
        <p style={{width: '80%', marginLeft: 'auto', marginRight:'auto'}}>
          From 2004 to 2011, NBA shot selection was still rooted in traditional philosophy. The most common shots came from the Mid-Range and restricted area, with teams prioritizing post-ups, isolation plays, and pull-up jumpers. 
          Analytics existed in theory, e.g. Dean Oliver's Basketball on Paper had been published in 2004, but few teams actively integrated it into decision-making.
          However, this era also marked the quiet beginning of a shift. The Houston Rockets hired Daryl Morey in 2007, a MIT Sloan graduate and a known data enthusiast. The team began applying efficiency-based strategies right away, identifying that three-pointers and shots at the rim yielded higher expected value. 
          Indeed, between 2004 and 2011, teams made 36% of their three-point attempts and 40% of their Mid-Range attempts. But since the 3-point shot is worth one more point, it yielded significantly more points per shot (~1.1 vs. 0.8).
          Still, the league at large was slow to follow, and the three-point shot remained underutilized.
        </p>

        <h3 style={{paddingTop: '20px'}}>2012-2020: The Three-Point Revolution</h3>
        <PercPerYear years_to_highlight={[2012, 2020]}/>
        <p style={{width: '80%', marginLeft: 'auto', marginRight:'auto'}}>
          <strong>Observation: </strong>From 2012 to 2020, the three-point shot exploded in popularity—rising from 22% to 38% of all shots taken. Meanwhile, Mid-Range shots declined sharply, dropping from 30% to just 13%. Two main forces drove this shift:
        </p>
        <ul style={{width: '80%', marginLeft: 'auto', marginRight:'auto'}}>
          <li><strong>Analytics-Driven Strategy:</strong> Teams started to include more data enthusiasts in their organizations and sometimes in core positions, for example Dean Oliver with the Kings, John Hollinger with the Grizzlies, Sam Hinkie with the 76ers, etc.  
          Also, the league embraced the data approach, being the first major US league to install SportVU optical tracking in every arena, which provides minute-by-minute x/y data on all players and the ball. </li>
          <li><strong>Influence of the Warriors:</strong> Between 2015 and 2019, the Golden State Warriors reached the NBA finals 5 times and won 3 titles. This team, led by elite shooters Stephen Curry, Klay Thompson and later Kevin Durant, won with a style built around the three-point shot. 
          Their success debunked long-held beliefs about how to win in the NBA and showed skeptical organizations that three-pointers and perimeter-focused offense could be truly dominant.</li>
        </ul>

        <h3 style={{paddingTop: '20px'}}>2021-2024: Stabilization</h3>
        <PercPerYear years_to_highlight={[2021, 2024]}/>
        <p style={{width: '80%', marginLeft: 'auto', marginRight:'auto'}}>
          <strong>Observation: </strong>The distribution of shots by zone has remained relatively stable. The three point shot is the most popular shot, while the Mid-Range became the least used one.
        </p>
        <p style={{width: '80%', marginLeft: 'auto', marginRight:'auto'}}>
          At this point, most teams have already adjusted their shot selection based on analytics. They also optimised their defensive schemes, with perimeter defense being more important than ever.
        </p>
      </div>

      <div class="conclusion" style={{paddingTop: '20px'}}>
        <h2>Conclusion</h2>
        <p style={{width: '80%', marginLeft: 'auto', marginRight:'auto'}}>
          We saw the shot selection in the NBA completely changed, Mid-range shots went from being the most popular (35% of all attempts) to the least (just 11%) over 20 years. Almost the entire difference went in favor of the three-point shot.
          Explanations include the impact of data-driven individuals having important roles in organizations, and exceptional players having success with the 3-point shot being their main weapon.
          Of course, these are not exhaustive explanations, as there are more complex factors we haven't covered here, such as evolving defensive strategies, subtle changes in officiating, and shifts in youth player development and skill training.
          Also, the decrease of Mid-Range shots being due to analytics alone is contradictory with the rise of shots taken in the Paint (non-RA), as they both have a very similar point/shot value over the last 20 years: ~0.8 for Mid-Range shots vs ~0.81 for shots in the Paint (non-RA).
        </p>
      </div>
            
      <ScrollySection class="graph-shot-distribution">
        <h2>Bonus: Interactive Chart</h2> 
        <h3>Evolution of the amount of shots taken in each part of the court</h3>
        <p>The bigger the hexagon, the higher the proportion of shots taken in that zone. Change the Year using the slider below the graph.</p>
        <HexbinGraph selectedFile={`data_${selectedYear}.csv`} />
        <div>
          <br></br>
        <input
          type="range"
          min="2004"
          max="2024"
          step="5"
          value={selectedYear}
          onChange={handleSliderChange}
          className={'slider'}
        />
        <br></br>
        <label>Select Year: {selectedYear}</label>
      </div>
      </ScrollySection>

      <div className="sources-section">
        <h2>Sources</h2>
        <ul>
          <li>
            <strong>Data:</strong> <a href="https://github.com/DomSamangy/NBA_Shots_04_25" target="_blank" rel="noopener noreferrer">github.com/DomSamangy/NBA_Shots_04_25</a>
          </li>
          <li>
            <strong>Court Design Inspiration:</strong> <a href="https://github.com/mc-buckets/d3-shotchart/blob/master/src/court.js" target="_blank" rel="noopener noreferrer">github.com/mc-buckets/d3-shotchart</a>
          </li>
          <li>
            <strong>Analytics Context:</strong> <a href="https://www.statsperform.com/resource/state-of-analytics-how-the-idiots-who-believe-in-the-movement-have-forever-changed-basketball/" target="_blank" rel="noopener noreferrer">Stats Perform - State of Analytics...</a>
          </li>
        </ul>
      </div>
      
      

    </div>
  );
};

export default App;
