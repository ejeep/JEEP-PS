const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const axios = require('axios');

const port = new SerialPort('COM3', {
    baudRate: 9600,
});

const parser = port.pipe(new Readline({ delimiter: '\n' }));

let dataBuffer = '';

parser.on('data', (chunk) => {
    dataBuffer += chunk; // Append incoming chunk to buffer

    try {
        // Filter out non-relevant data
        if (!dataBuffer.includes('ARD')) {
            console.log('Ignored non-SMS data:', chunk);
            dataBuffer = ''; // Reset buffer for next input
            return;
        }

        // Parse the SMS content
        const parsedData = parseSMS(dataBuffer.trim());

        // Reset buffer after successful parsing
        dataBuffer = '';

        // Log the parsed data
        console.log('Parsed SMS Data:', parsedData);

        // Send the parsed data to the server
        sendDataToMERN(parsedData);

    } catch (error) {
        console.error('Error parsing SMS or sending data:', error.message);
        // Reset the buffer if it's an invalid SMS
        dataBuffer = '';
    }
});

// Function to parse the SMS content based on the LocationSchema
const parseSMS = (sms) => {
    const fields = sms.split(',');

    // Remove any unintended prefixes in the first field
    const arduinoID = fields[0].replace('SMS Content: ', '').trim();

    // Map the fields to the schema
    const locationData = {
        arduinoID, // Arduino ID without prefix
        jeepLocation: {
            lat: parseFloat(fields[1]), // Latitude
            lng: parseFloat(fields[2]), // Longitude
        },
        speed: parseFloat(fields[3]), // Speed
        seatAvailability: parseInt(fields[4], 10), // Seat availability
        status: fields[5], // Status
        direction: fields[6], // Direction
        condition: fields[7], // Condition
    };

    return locationData;
};

// Function to send data to the MERN backend
const sendDataToMERN = async (parsedData) => {
    try {
        const response = await axios.post('http://localhost:3004/gps/jeep-location', {
            arduinoID: parsedData.arduinoID,
            jeepLocation: parsedData.jeepLocation,
            speed: parsedData.speed,
            seatAvailability: parsedData.seatAvailability,
            status: parsedData.status,
            direction: parsedData.direction,
            condition: parsedData.condition,
            // Add timestamp if needed for the request
        });
        console.log('Data sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending data to the server:', error.message);
    }
};
