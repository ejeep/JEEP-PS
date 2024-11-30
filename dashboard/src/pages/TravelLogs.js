// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
// import io from 'socket.io-client';

// const API_BASE_URL = "http://localhost:3004";  // Your API base URL
// const socket = io(API_BASE_URL);  // Connect to the WebSocket server

// const TravelLogs = () => {
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     // Fetch initial travel logs from the server
//     const fetchLogs = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/travel/logs`);
//         setLogs(response.data);  // Set fetched logs into state
//       } catch (error) {
//         console.error('Error fetching travel logs:', error);
//       }
//     };

//     fetchLogs();

//     // Listen for new travel logs emitted by the WebSocket server
//     socket.on('newTravelLog', (newLog) => {
//       setLogs((prevLogs) => [newLog, ...prevLogs]);  // Add new log at the beginning
//     });

//     // Cleanup socket event listener when the component unmounts
//     return () => {
//       socket.off('newTravelLog');
//     };
//   }, []);

//   return (
//     <TableContainer component={Paper}>
//       <Typography variant="h6" gutterBottom align="center">
//         Travel Logs
//       </Typography>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Jeep ID</TableCell>
//             <TableCell>Plate Number</TableCell>
//             <TableCell>Location (Lat, Lng)</TableCell>
//             <TableCell>Speed (m/s)</TableCell>
//             <TableCell>Seat Availability</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Direction</TableCell>
//             <TableCell>Condition</TableCell>
//             <TableCell>Timestamp</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {logs.map((log, index) => (
//             <TableRow key={index}>
//               <TableCell>{log.arduinoID}</TableCell>
//               <TableCell>{log.plateNumber}</TableCell>
//               <TableCell>{log.jeepLocation.lat}, {log.jeepLocation.lng}</TableCell>
//               <TableCell>{log.speed}</TableCell>
//               <TableCell>{log.seatAvailability}</TableCell>
//               <TableCell>{log.status}</TableCell>
//               <TableCell>{log.direction}</TableCell>
//               <TableCell>{log.condition}</TableCell>
//               <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default TravelLogs;
