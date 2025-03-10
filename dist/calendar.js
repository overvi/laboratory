"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateInput = exports.setHeader = exports.setDateToInput = exports.selectOnClick = exports.months = exports.isSelectedDay = exports.initCalendar = exports.getNumberOfDays = exports.getMonthStr = exports.getJalaliFirstDay = exports.getDateStringFromTimestamp = exports.days = void 0;
var _module = _interopRequireWildcard(require("./calendar"));
var _jalaaliJs = _interopRequireDefault(require("jalaali-js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var input = document.querySelector("#date");
var calendar = document.querySelector("#calendar_main"),
  calHeaderTitle = document.querySelector("#calendar_header span"),
  calDays = document.querySelector("#cal_days");
var months = exports.months = ["فروردین", "اردیبهشت", "خرداد", "تیر ", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
var days = exports.days = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه"];
var isSelectedDay = exports.isSelectedDay = function isSelectedDay(day, cell, selectedDay) {
  if (day.timestamp === selectedDay) {
    cell.classList.add("active");
    cell.classList.add("isSelected");
  }
};
var selectOnClick = exports.selectOnClick = function selectOnClick() {
  document.querySelectorAll(".cell_wrapper").forEach(function (cell) {
    cell.classList.contains("isSelected") && cell.classList.remove("active");
    if (cell.classList.contains("isCurrent") && !cell.classList.contains("active")) {
      cell.querySelector("span").classList.add("inactive_indicator");
    }
  });
};
var getDateStringFromTimestamp = exports.getDateStringFromTimestamp = function getDateStringFromTimestamp(timestamp) {
  var dateObject = _jalaaliJs["default"].toJalaali(new Date(timestamp));
  return "".concat(months[dateObject.jm - 1], " ").concat(dateObject.jd, ", ").concat(dateObject.jy);
};
var setDateToInput = exports.setDateToInput = function setDateToInput(timestamp, input) {
  var dateString;
  if (calendarType === "jalali") {
    dateString = getDateStringFromTimestamp(timestamp);
  } else {
    var dateObject = new Date(timestamp);
    dateString = "".concat(dateObject.toLocaleString("fa-IR", {
      month: "long"
    }), " ").concat(dateObject.getDate(), ", ").concat(dateObject.getFullYear());
  }
  input.value = dateString;
};
var getNumberOfDays = exports.getNumberOfDays = function getNumberOfDays(year, month) {
  var monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  if (month === 11 && isLeapYear(year)) {
    return 30;
  }
  return monthDays[month];
};
var isLeapYear = function isLeapYear(year) {
  return _jalaaliJs["default"].isLeapJalaaliYear(year);
};
var isCurrentDay = function isCurrentDay(day, cell, today) {
  if (day.timestamp === today) {
    cell.classList.add("active");
    cell.classList.add("isCurrent");
  }
};
var getMonthStr = exports.getMonthStr = function getMonthStr(month) {
  return months[Math.max(Math.min(11, month), 0)] || "Month";
};
var getJalaliFirstDay = exports.getJalaliFirstDay = function getJalaliFirstDay(year, month) {
  var _jalaali$toGregorian = _jalaaliJs["default"].toGregorian(year, month + 1, 1),
    gy = _jalaali$toGregorian.gy,
    gm = _jalaali$toGregorian.gm,
    gd = _jalaali$toGregorian.gd;
  var gregorianFirstDay = new Date(gy, gm - 1, gd).getDay();
  var jalaliFirstDay = (gregorianFirstDay + 1) % 7;
  return jalaliFirstDay;
};
var setHeader = exports.setHeader = function setHeader(year, month, el) {
  el.innerHTML = getMonthStr(month) + " " + year;
};
var setHeaderNav = function setHeaderNav(offset, month, year, monthDetails) {
  month = month + offset;
  if (month === -1) {
    month = 11;
    year--;
  } else if (month === 12) {
    month = 0;
    year++;
    ddddd;
  }
  monthDetails = getMonthDetails(year, month);
  return {
    year: year,
    month: month,
    monthDetails: monthDetails
  };
};
var setCalBody = function setCalBody(monthDetails, today) {
  // Add dates to calendar
  for (var i = 0; i < monthDetails.length; i++) {
    var div = document.createElement("div"),
      span = document.createElement("span");
    div.classList.add("cell_wrapper");
    div.classList.add("cal_date");
    monthDetails[i].month === 0 ? div.classList.add("current") : div.classList.add("hiddenz");
    monthDetails[i].month === 0 && isCurrentDay(monthDetails[i], div, today);
    span.classList.add("cell_item");
    span.innerText = monthDetails[i].date;
    div.appendChild(span);
    calendar.appendChild(div);
  }
};

// Re arrange dates according to arrow

var updateCalendar = function updateCalendar(btn, month, year, monthDetails) {
  var newCal, offset;
  if (btn.classList.contains("back")) {
    offset = -1;
  } else if (btn.classList.contains("front")) {
    offset = 1;
  }
  newCal = setHeaderNav(offset, month, year, monthDetails);
  // console.log(monthDetails)
  setHeader(newCal.year, newCal.month, calHeaderTitle);
  calendar.innerHTML = "";
  setCalBody(newCal.monthDetails);
  return newCal;
};
var getMonthDetails = function getMonthDetails(year, month) {
  var firstDay = getJalaliFirstDay(year, month); // Correct first day for Jalali  let numberOfDays = getNumberOfDays(year, month);
  var monthArray = [];
  var numberOfDays = getNumberOfDays(year, month); // Number of days in Jalali month
  var rows = 5;
  var currentDay = null;
  var index = 0;
  var cols = firstDay >= 5 ? 8 : 7;
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      currentDay = getDayDetails({
        index: index,
        numberOfDays: numberOfDays,
        firstDay: firstDay,
        year: year,
        month: month
      });
      monthArray.push(currentDay);
      index++;
    }
  }
  return monthArray;
};
var getDayDetails = function getDayDetails(args) {
  var date = args.index - args.firstDay;
  var day = args.index % 7;
  day = (day + 1) % 7;
  var prevMonth = args.month - 1;
  var prevYear = args.year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  var prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
  var _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
  var month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
  var gregorianDate = _jalaaliJs["default"].toGregorian(args.year, args.month + 1, _date);
  var timestamp = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd).getTime();
  return {
    date: _date,
    day: day,
    month: month,
    timestamp: timestamp,
    dayString: days[day]
  };
};
var updateInput = exports.updateInput = function updateInput(monthDetails, selectedDay, input) {
  var currentDay = document.querySelector(".isCurrent");
  // Update input based on clicked cell
  document.querySelectorAll(".cell_wrapper").forEach(function (cell) {
    if (cell.classList.contains("current")) {
      cell.addEventListener("click", function (e) {
        var cell_date = e.target.textContent;

        // Remove active state from current day

        for (var i = 0; i < monthDetails.length; i++) {
          if (monthDetails[i].month === 0) {
            if (monthDetails[i].date.toString().trim() === cell_date.trim()) {
              selectedDay = monthDetails[i].timestamp;
              _module.setDateToInput(selectedDay, input);
              currentDay !== null && currentDay.classList.remove("active");
              selectOnClick();
              cell.querySelector("span").classList.contains("inactive_indicator") && cell.querySelector("span").classList.remove("inactive_indicator");
              isSelectedDay(monthDetails[i], cell, selectedDay);

              // Remove inactive state if current day is clicked
            }
          }
        }
      });
    }
  });
};
var getMonthDetailsGregorian = function getMonthDetailsGregorian(year, month) {
  var firstDay = new Date(year, month, 1).getDay();
  var numberOfDays = new Date(year, month + 1, 0).getDate();
  var monthArray = [];
  for (var i = 0; i < numberOfDays; i++) {
    var timestamp = new Date(year, month, i + 1).getTime();
    monthArray.push({
      date: i + 1,
      day: (firstDay + i) % 7,
      month: 0,
      timestamp: timestamp,
      dayString: days[(firstDay + i) % 7]
    });
  }
  return monthArray;
};
var initCalendar = exports.initCalendar = function initCalendar() {
  var today = new Date();
  var todayTimestamp = today.getTime();
  var year, month, monthDetails;
  if (calendarType === "jalali") {
    var todayJalali = _jalaaliJs["default"].toJalaali(today);
    year = todayJalali.jy;
    month = todayJalali.jm - 1;
    monthDetails = getMonthDetails(year, month);
  } else {
    year = today.getFullYear();
    month = today.getMonth();
    monthDetails = getMonthDetailsGregorian(year, month);
  }
  document.querySelectorAll(".cal-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var newDate = updateCalendar(btn, month, year, monthDetails);
      year = newDate.year;
      month = newDate.month;
      monthDetails = newDate.monthDetails;
      updateInput(monthDetails, todayTimestamp, input);
    });
  });
  setHeader(year, month, calHeaderTitle);
  setDateToInput(todayTimestamp, input);
  setCalBody(monthDetails, todayTimestamp);
  updateInput(monthDetails, todayTimestamp, input);
};