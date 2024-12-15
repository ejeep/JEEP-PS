const TravelLog = require("../models/travelLogs");

// Function to format travel duration into HH:MM:SS format
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemaining = seconds % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}:${secondsRemaining
    .toString()
    .padStart(2, "0")}`;
};

// Get all travel logs
exports.getAllTravelLogs = async (req, res) => {
  try {
    const travelLogs = await TravelLog.find();
    res.status(200).json(travelLogs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving travel logs.", error });
  }
};

// Create or Update travel log
exports.createOrUpdateTravelLog = async (req, res) => {
  const logs = req.body;

  if (!Array.isArray(logs)) {
    return res
      .status(400)
      .json({ message: "Invalid input format, expected an array of logs." });
  }

  try {
    // Loop through each travel log in the array
    for (const logData of logs) {
      const {
        arduinoID,
        plateNumber,
        jeepLocation,
        speed,
        seatAvailability,
        status,
        direction,
        condition,
        timestamp,
        eta,
      } = logData;

      if (
        !arduinoID ||
        !timestamp ||
        !jeepLocation ||
        !jeepLocation.lat ||
        !jeepLocation.lng
      ) {
        return res
          .status(400)
          .json({
            message:
              "arduinoID, timestamp, and valid jeepLocation (lat, lng) are required",
          });
      }

      let lastLog = await TravelLog.findOne({ arduinoID }).sort({
        timestamp: -1,
      });

      if (lastLog) {
        if (lastLog.status === "waiting" && status === "en route") {
          lastLog.startTime = timestamp;
        } else if (lastLog.status === "en route" && status === "waiting") {
          lastLog.endTime = timestamp;
          // Calculate travel duration in seconds
          const travelDurationInSeconds =
            (new Date(lastLog.endTime) - new Date(lastLog.startTime)) / 1000;
          // Format the duration to HH:MM:SS
          lastLog.travelDuration = travelDurationInSeconds;
        }

        lastLog.plateNumber = plateNumber || lastLog.plateNumber;
        lastLog.jeepLocation = jeepLocation || lastLog.jeepLocation;
        lastLog.speed = speed || lastLog.speed;
        lastLog.seatAvailability = seatAvailability || lastLog.seatAvailability;
        lastLog.status = status || lastLog.status;
        lastLog.direction = direction || lastLog.direction;
        lastLog.condition = condition || lastLog.condition;
        lastLog.timestamp = timestamp || lastLog.timestamp;
        lastLog.eta = eta || lastLog.eta;

        await lastLog.save();
      } else {
        const newTravelLog = new TravelLog({
          arduinoID,
          plateNumber,
          jeepLocation,
          speed,
          seatAvailability,
          status,
          direction,
          condition,
          timestamp,
          eta,
        });

        if (status === "en route") {
          newTravelLog.startTime = timestamp;
        }

        await newTravelLog.save();
      }
    }

    res.status(200).json({ message: "Travel logs processed successfully" });
  } catch (error) {
    console.error("Error creating or updating travel logs:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get total travel duration for a specific arduinoID
exports.getTotalDuration = async (req, res) => {
  try {
    const { arduinoID } = req.params;
    const logs = await TravelLog.find({ arduinoID }).sort({ timestamp: 1 });

    if (logs.length === 0) {
      return res.status(200).json({ totalDuration: "0:00:00" }); // Return 0 in HH:MM:SS format
    }

    let startTime = null;
    let endTime = null;

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];

      if (log.status === "en route" && !startTime) {
        startTime = new Date(log.timestamp);
      }

      if (log.status === "waiting" && startTime) {
        endTime = new Date(log.timestamp);
        break;
      }
    }

    if (!startTime || !endTime) {
      return res.status(200).json({ totalDuration: "0:00:00" });
    }

    const totalDuration = (endTime - startTime) / 1000; // Duration in seconds
    const formattedDuration = formatDuration(totalDuration); // Format duration

    res.status(200).json({ totalDuration: formattedDuration });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error calculating total duration.", error });
  }
};

// Get logs for today
exports.getLogsForToday = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setDate(startOfDay.getDate() + 1);

    const logs = await TravelLog.find({
      timestamp: { $gte: startOfDay, $lt: endOfDay },
    });
    res.status(200).json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving today's travel logs.", error });
  }
};
