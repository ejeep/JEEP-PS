import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About JEEP-PS</h1>
      <p>View the live locations of E-Jeepneys in our system!</p>
      <p>
        Our project, JEEP-PS, focuses on pioneering smart mobility solutions by
        integrating advanced tracking technology for e-jeepneys, offering real-time
        arrival information, route optimization, and more.
      </p>
      <p>
        JEEP-PS aims to support the Public Utility Vehicle Modernization Program
        (PUVMP) by improving the commuting experience, helping operators, and
        addressing issues like traffic congestion in Solano, Bayombong, and Bambang.
      </p>
      <h2>Important Notes</h2>
      <ul>
        <li>
          Real-time tracking and seating availability are available in our app for
          passengers.
        </li>
        <li>
          Fleet operators can optimize routes and improve vehicle management using
          our tools.
        </li>
        <li>
          Passengers are advised to follow safety protocols while riding.
        </li>
        <li>More features to enhance passenger safety and experience are coming!</li>
      </ul>

      <h2>In partnership with</h2>
      <div className="partnerships">
        <p>Ifugao Transport Service Cooperative</p>
        <p>Saint Mary's University</p>
      </div>

      <div className="share-section">
        <p>Share</p>
        <button className="share-btn">Share on Facebook</button>
        <button className="share-btn">Share on Twitter</button>
      </div>
    </div>
  );
}

export default About;
