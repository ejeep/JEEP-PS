const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

try {
  const port = new SerialPort({ path: 'COM6', baudRate: 9600 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  port.on('open', () => {
    console.log('Serial port opened');
  });
  
  parser.on('data', (data) => {
    console.log(`Received from Arduino: ${data}`);
  });
  
  port.on('error', (err) => {
    console.error('Serial port error:', err.message);
  });
  

} catch (err) {
  console.error('Error opening port:', err.message);
}
