const SerialPort = require('serialport');  // Correct way to import in version 9.x
const Readline = require('@serialport/parser-readline');
const axios = require('axios');

// Replace with your actual serial port (example: COM3 for Windows)
const port = new SerialPort('COM3', {
  baudRate: 9600
});

// Parser to handle incoming data from the Arduino
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Conversion factor for speed from km/h to m/s
const convertSpeedToMetersPerSecond = (speedKmh) => {
  return speedKmh * (1000 / 3600);
};

// Function to send data to MERN backend
const sendDataToMERN = async (jeepID, lat, lng, speed) => {
  try {
    // POST request to the backend with location data
    const response = await axios.post('http://localhost:3004/gps/jeep-location', {
      jeepID: jeepID,  // Unique ID for the Jeep
      jeepLocation: {
        lat: lat,    // Latitude from Arduino
        lng: lng     // Longitude from Arduino
      },
      speed: speed,    // Speed in m/s
      timestamp: new Date()  // Automatically generated timestamp
    });
    console.log('Data sent to MERN:', response.data);
  } catch (error) {
    console.error('Error sending data:', error);
  }
};

// Read data from Arduino
parser.on('data', (data) => {
  console.log('Data received from Arduino:', data);

  // Trim any unwanted whitespace or newline characters from the data
  const cleanedData = data.trim();

  try {
    // Parse the cleaned JSON data from the Arduino
    const parsedData = JSON.parse(cleanedData);

    // Log the parsed data for debugging
    console.log("Parsed data:", parsedData);

    // Extract latitude, longitude, jeepID, and speed from the parsed object
    const latitude = parsedData.jeepLocation?.lat;
    const longitude = parsedData.jeepLocation?.lng;
    const jeepID = parsedData.jeepID;
    const speedKmh = parsedData.speed; // Speed in km/h from Arduino

    // Validate that latitude, longitude, jeepID, and speed are present
    if (latitude && longitude && jeepID && speedKmh !== undefined) {
      console.log("Valid data:", { latitude, longitude, jeepID, speedKmh });

      // Convert speed from km/h to m/s
      const speedMs = convertSpeedToMetersPerSecond(parseFloat(speedKmh));

      // Send the data to MERN backend
      sendDataToMERN(
        jeepID,
        parseFloat(latitude),
        parseFloat(longitude),
        speedMs
      );
    } else {
      console.log('Invalid or missing latitude, longitude, jeepID, or speed');
    }
  } catch (error) {
    console.log('Error parsing data:', error);
  }
});
