import React from "react";

const TimeSelection = ({
  label,
  timeValue,
  onChange,
  minTime, // Minimum time for validation
  isDisabled, // Prop to disable the component
  isSameDay, // New prop to know if start/end dates are the same
}) => {
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const parseTimeValue = () => {
    if (!timeValue) return { hour: "--", minute: "--", period: "--" }; // Initialize with '--'
    const [time, period] = timeValue.split(" ");
    const [hour, minute] = time.split(":");
    return {
      hour: hour.padStart(2, "0"),
      minute,
      period,
    };
  };

  const { hour, minute, period } = parseTimeValue();

  // Convert time to comparable format (24-hour)
  const convertTo24Hour = (hour, minute, period) => {
    if (hour === "--" || minute === "--" || period === "--") return null;
    let hr = parseInt(hour);
    if (period === "PM" && hr !== 12) hr += 12;
    if (period === "AM" && hr === 12) hr = 0;
    return `${hr.toString().padStart(2, "0")}:${minute}`;
  };

  const handleTimeChange = (field, value) => {
    const newTime = {
      hour: field === "hour" ? value : hour,
      minute: field === "minute" ? value : minute,
      period: field === "period" ? value : period,
    };

    // Check for valid time when all fields are selected
    const newTimeStr = convertTo24Hour(
      newTime.hour,
      newTime.minute,
      newTime.period
    );

    if (minTime && newTimeStr) {
      const [minHour, minMinute, minPeriod] = minTime
        .match(/(\d+):(\d+)\s+(AM|PM)/)
        .slice(1);
      const minTimeStr = convertTo24Hour(minHour, minMinute, minPeriod);

      // Only validate that the new time is strictly greater than the minimum time
      // if this is for the same day. If different days, any time is valid.
      if (isSameDay && newTimeStr < minTimeStr) {
        return; // Do not update the time if it is invalid and on the same day
      }
    }

    // Update the time regardless of validation to reflect changes in dropdown
    onChange(
      `${newTime.hour !== "--" ? newTime.hour : "--"}:${
        newTime.minute !== "--" ? newTime.minute : "--"
      } ${newTime.period !== "--" ? newTime.period : "--"}`
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-white font-medium">{label}</label>
      <div className="flex gap-2">
        {/* Hour Selection */}
        <select
          value={hour}
          onChange={(e) => handleTimeChange("hour", e.target.value)}
          className={`px-2 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            isDisabled ? "bg-gray-100" : ""
          }`}
          disabled={isDisabled}
        >
          <option value="--">--</option>
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        {/* Minute Selection */}
        <select
          value={minute}
          onChange={(e) => handleTimeChange("minute", e.target.value)}
          className={`px-2 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            isDisabled ? "bg-gray-100" : ""
          }`}
          disabled={isDisabled}
        >
          <option value="--">--</option>
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {/* Period (AM/PM) Selection */}
        <select
          value={period}
          onChange={(e) => handleTimeChange("period", e.target.value)}
          className={`px-2 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            isDisabled ? "bg-gray-100" : ""
          }`}
          disabled={isDisabled}
        >
          <option value="--">--</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default TimeSelection;
