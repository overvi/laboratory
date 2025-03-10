"use strict";

var _calendar = require("./calendar");
console.log("first");
var calendarType = "jalali"; // Default to Jalali

(0, _calendar.initCalendar)();
var toggleCalendarType = function toggleCalendarType() {
  calendarType = calendarType === "jalali" ? "gregorian" : "jalali";
  (0, _calendar.initCalendar)(); // Reinitialize with the selected calendar type
};
document.querySelector("#calendar_toggle").addEventListener("click", toggleCalendarType);