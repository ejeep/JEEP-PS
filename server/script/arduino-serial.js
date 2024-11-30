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
const sendDataToMERN = async (arduinoID, lat, lng, speed) => {
  try {
    // POST request to the backend with location data
    const response = await axios.post('http://localhost:3004/gps/jeep-location', {
      arduinoID: arduinoID,  // Unique ID for the Jeep
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

let smsMessages = [];

// Handle incoming data from Arduino (GSM Module)
parser.on('data', (chunk) => {
  console.log('Received raw data:', chunk.toString());

  const message = chunk.toString().trim();

  // Process only SMS data (e.g., messages starting with "+CMT:")
  if (message.includes("+CMT:")) {
    // Example of extracting SMS content after "+CMT:"
    const smsContent = message.split("+CMT:")[1]?.trim();
    if (smsContent) {
      smsMessages.push(smsContent); // Store SMS content in memory
    }
  }
});



// Function to process and parse a single message
// function processMessage(message) {
//   try {
//     const parsedData = JSON.parse(message);
//     const { arduinoID, jeepLocation, speed } = parsedData;

//     if (arduinoID && jeepLocation?.lat && jeepLocation?.lng && speed !== undefined) {
//       const speedMs = convertSpeedToMetersPerSecond(parseFloat(speed));
//       sendDataToMERN(arduinoID, parseFloat(jeepLocation.lat), parseFloat(jeepLocation.lng), speedMs);
//     } else {
//       console.log('Invalid JSON structure:', parsedData);
//     }
//   } catch (error) {
//     console.log('Received non-JSON data or parsing error:', error.message);
//   }
// }



