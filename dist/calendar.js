"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _jalaaliJs = _interopRequireDefault(require("jalaali-js"));
var _select = require("./select");
var _scrollMonthPicker = require("./scroll-month-picker");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DatePicker = /*#__PURE__*/function () {
  function DatePicker(elementId) {
    var _this = this;
    _classCallCheck(this, DatePicker);
    if (window.datePicker) return window.datePicker;
    // Element references
    this.dp = document.getElementById(elementId);
    if (!window.datePickers) window.datePickers = new Map(); // Store multiple instances

    if (window.datePickers.has(elementId)) {
      return window.datePickers.get(elementId); // Return existing instance if it exists
    }
    this.input = this.dp.querySelector(".date");
    this.calendar = this.dp.querySelector(".calendar_main");
    this.calDays = this.dp.querySelector(".cal_days");
    this.input.addEventListener("click", function () {
      (0, _scrollMonthPicker.dpInitScrollMonthPicker)(_this.selector);
    });

    // Calendar state
    this.calendarType = "jalali";
    this.selectedYear = null;
    this.selectedMonth = null;
    this.selectedTime = null;
    this.selector = elementId;
    this.currentMonthIndex = null;
    this.initialized = false;
    window.datePickers.set(elementId, this);

    // Calendar data
    this.Jalalimonths = ["فروردین", "اردیبهشت", "خرداد", "تیر ", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    this.Jalalidays = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه"];
    this.Georgianmonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.Georgiandays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.months = this.Jalalimonths;
    this.days = this.Jalalidays;

    // Initialize
    this.init();
  }
  return _createClass(DatePicker, [{
    key: "init",
    value: function init() {
      this.initCalendar();
      this.setupEventListeners();
      this.initScrollMonthPicker();
      this.generateYearOptions();
      this.initCustomSelect();
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this2 = this;
      // Handle navigation buttons
      this.dp.querySelectorAll(".cal-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var newDate = _this2.updateCalendar(btn, _this2.selectedMonth, _this2.selectedYear, _this2.monthDetails, _this2.todayTimestamp, _this2.selectedTime);
          _this2.selectedYear = newDate.year;
          _this2.selectedMonth = newDate.month;
          _this2.monthDetails = newDate.monthDetails;
          _this2.updateInput(_this2.monthDetails, _this2.selectedTime);
        });
      });

      // Toggle calendar type
      var toggleBtn = this.dp.querySelector(".change-calendar");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
          _this2.calendarType = _this2.calendarType === "jalali" ? "gregorian" : "jalali";
          toggleBtn.textContent = _this2.calendarType === "jalali" ? "تقویم میلادی" : "تقویم شمسی";
          _this2.initCalendar();
          _this2.initScrollMonthPicker();
          _this2.generateYearOptions();
          _this2.initCustomSelect();
        });
      }

      // Year picker change event
      var yearPicker = this.dp.querySelector(".select-container");
      if (yearPicker) {
        yearPicker.querySelector("select").addEventListener("change", function (e) {
          var selectedYear = parseInt(e.target.value, 10);
          if (!isNaN(selectedYear)) {
            _this2.updateCalendarYear(selectedYear);
          }
        });
      }

      // Select and delete buttons
      this.dp.querySelector(".select").addEventListener("click", function () {
        if (_this2.selectedTime) {
          _this2.setDateToInput(_this2.selectedTime, _this2.input);
        }
      });
      this.dp.querySelector(".delete").addEventListener("click", function () {
        _this2.selectedTime = null;
        _this2.dp.querySelectorAll(".isSelected").forEach(function (el) {
          return el.classList.remove("active", "isSelected");
        });
        _this2.input.value = "";
      });
    }
  }, {
    key: "initCalendar",
    value: function initCalendar() {
      // Clear the calendar before rendering the new one
      this.calendar.innerHTML = "";
      var date = new Date();
      var currentDate = new Date();
      if (this.calendarType === "jalali") {
        var jalaliDate = _jalaaliJs["default"].toJalaali(currentDate);
        this.selectedYear = jalaliDate.jy;
        this.selectedMonth = jalaliDate.jm - 1; // 0-indexed for internal use

        this.months = this.Jalalimonths;
        this.days = this.Jalalidays;
        var todayJalali = _jalaaliJs["default"].toJalaali(new Date());
        var gregorianDate = _jalaaliJs["default"].toGregorian(todayJalali.jy, todayJalali.jm, todayJalali.jd);
        this.todayTimestamp = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd).getTime();
        var year = jalaliDate.jy;
        var month = jalaliDate.jm - 1;
        this.monthDetails = this.getMonthDetails(year, month);
        this.currentMonthIndex = month;
      } else {
        this.selectedYear = currentDate.getFullYear();
        this.selectedMonth = currentDate.getMonth();
        this.months = this.Georgianmonths;
        this.days = this.Georgiandays;
        var _year = date.getFullYear();
        var _month = date.getMonth();
        var day = date.getDate();
        this.todayTimestamp = new Date(_year, _month, day).getTime();
        this.monthDetails = this.getMonthDetailsGregorian(_year, _month);
        this.currentMonthIndex = _month;
      }
      this.selectedTime = this.todayTimestamp;

      // Add the weekday labels at the top of the calendar
      this.calDays.innerHTML = "";
      for (var i = 0; i < this.days.length; i++) {
        var div = document.createElement("div");
        var span = document.createElement("span");
        div.classList.add("cell_wrapper");
        span.classList.add("cell_item");
        span.innerText = this.days[i];
        div.appendChild(span);
        this.calDays.appendChild(div);
      }

      // Set the date input value to today's date
      this.setDateToInput(this.todayTimestamp, this.input);

      // Render the month body
      this.setCalBody(this.monthDetails, this.todayTimestamp, this.selectedTime);

      // Handle click events for selecting a date
      this.updateInput(this.monthDetails, this.selectedTime);
      this.initialized = true;
    }
  }, {
    key: "getMonths",
    value: function getMonths() {
      return this.months;
    }
  }, {
    key: "getCurrentMonthIndex",
    value: function getCurrentMonthIndex() {
      return this.currentMonthIndex;
    }
  }, {
    key: "setCalBody",
    value: function setCalBody(monthDetails, todayTimestamp, selectedDay) {
      // Clear the previous calendar dates
      this.calendar.innerHTML = "";

      // Add dates to calendar
      for (var i = 0; i < monthDetails.length; i++) {
        var div = document.createElement("div");
        var span = document.createElement("span");
        div.classList.add("cell_wrapper");
        div.classList.add("cal_date");

        // Check if the current date is before today and disable it
        if (Math.abs(monthDetails[i].timestamp) < todayTimestamp) {
          div.classList.add("disabled");
        } else {
          monthDetails[i].month === 0 ? div.classList.add("current") : div.classList.add("hiddenz");
          monthDetails[i].month === 0 && this.isCurrentDay(monthDetails[i], div, todayTimestamp);
        }
        span.classList.add("cell_item");
        span.innerText = monthDetails[i].date;

        // Add the active or selected day class
        if (monthDetails[i].timestamp === selectedDay) {
          div.classList.add("active");
          div.classList.add("isSelected");
          this.selectedTime = monthDetails[i].timestamp;
        }
        div.appendChild(span);
        this.calendar.appendChild(div);
      }
    }
  }, {
    key: "updateInput",
    value: function updateInput(monthDetails) {
      var _this3 = this;
      this.dp.querySelectorAll(".cell_wrapper").forEach(function (cell) {
        if (cell.classList.contains("current")) {
          cell.addEventListener("click", function (e) {
            var cell_date = e.target.textContent.trim();
            for (var i = 0; i < monthDetails.length; i++) {
              if (monthDetails[i].month === 0 && monthDetails[i].date.toString().trim() === cell_date) {
                _this3.selectedTime = monthDetails[i].timestamp;
                _this3.dp.querySelectorAll(".isSelected").forEach(function (el) {
                  return el.classList.remove("active", "isSelected");
                });
                cell.classList.add("active", "isSelected");
              }
            }
          });
        }
      });
    }
  }, {
    key: "updateCalendar",
    value: function updateCalendar(btn, month, year, monthDetails, todayTimestamp, selectedDay) {
      var offset;
      if (btn.classList.contains("back")) {
        offset = -1;
      } else if (btn.classList.contains("front")) {
        offset = 1;
      }
      var newCal = this.setHeaderNav(offset, month, year, monthDetails);

      // Re-render the calendar body
      this.setCalBody(newCal.monthDetails, todayTimestamp, selectedDay);
      return newCal;
    }
  }, {
    key: "setHeaderNav",
    value: function setHeaderNav(offset, month, year, monthDetails) {
      month = month + offset;
      if (month === -1) {
        month = 11;
        year--;
      } else if (month === 12) {
        month = 0;
        year++;
      }
      if (this.calendarType === "jalali") {
        monthDetails = this.getMonthDetails(year, month);
      } else {
        monthDetails = this.getMonthDetailsGregorian(year, month);
      }
      return {
        year: year,
        month: month,
        monthDetails: monthDetails
      };
    }
  }, {
    key: "getJalaliFirstDay",
    value: function getJalaliFirstDay(year, month) {
      var _jalaali$toGregorian = _jalaaliJs["default"].toGregorian(year, month + 1, 1),
        gy = _jalaali$toGregorian.gy,
        gm = _jalaali$toGregorian.gm,
        gd = _jalaali$toGregorian.gd;
      var gregorianFirstDay = new Date(gy, gm - 1, gd).getDay();
      var jalaliFirstDay = (gregorianFirstDay + 1) % 7;
      return jalaliFirstDay;
    }
  }, {
    key: "getMonthDetails",
    value: function getMonthDetails(year, month) {
      var firstDay = this.getJalaliFirstDay(year, month);
      var monthArray = [];
      var numberOfDays = this.getNumberOfDays(year, month);
      var rows = 5;
      var currentDay = null;
      var index = 0;
      var cols = firstDay >= 5 ? 8 : 7;
      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
          currentDay = this.getDayDetails({
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
    }
  }, {
    key: "getDayDetails",
    value: function getDayDetails(args) {
      var date = args.index - args.firstDay;
      var day = args.index % 7;
      day = (day + 1) % 7;
      var prevMonth = args.month - 1;
      var prevYear = args.year;
      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
      }
      var prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);
      var _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
      var month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
      var gregorianDate = _jalaaliJs["default"].toGregorian(args.year, args.month + 1, _date);
      var timestamp = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd).getTime();
      return {
        date: _date,
        day: day,
        month: month,
        timestamp: timestamp,
        dayString: this.days[day]
      };
    }
  }, {
    key: "getMonthDetailsGregorian",
    value: function getMonthDetailsGregorian(year, month) {
      var firstDay = new Date(year, month).getDay();
      var numberOfDays = this.getNumberOfDaysGregorian(year, month);
      var monthArray = [];
      var rows = 5;
      var currentDay = null;
      var index = 0;
      var cols = firstDay >= 5 ? 8 : 7;
      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
          currentDay = this.getDayDetailsGregorian({
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
    }
  }, {
    key: "getDayDetailsGregorian",
    value: function getDayDetailsGregorian(args) {
      var date = args.index - args.firstDay;
      var day = args.index % 7;
      var prevMonth = args.month - 1;
      var prevYear = args.year;
      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
      }
      var prevMonthNumberOfDays = this.getNumberOfDaysGregorian(prevYear, prevMonth);
      var _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
      var month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
      var timestamp = new Date(args.year, args.month, _date).getTime();
      return {
        date: _date,
        day: day,
        month: month,
        timestamp: timestamp,
        dayString: this.days[day]
      };
    }
  }, {
    key: "getNumberOfDays",
    value: function getNumberOfDays(year, month) {
      var monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
      if (month === 11 && this.isLeapYear(year)) {
        return 30;
      }
      return monthDays[month];
    }
  }, {
    key: "getNumberOfDaysGregorian",
    value: function getNumberOfDaysGregorian(year, month) {
      return 40 - new Date(year, month, 40).getDate();
    }
  }, {
    key: "isLeapYear",
    value: function isLeapYear(year) {
      return _jalaaliJs["default"].isLeapJalaaliYear(year);
    }
  }, {
    key: "isCurrentDay",
    value: function isCurrentDay(day, cell, today) {
      if (day.timestamp === today) {
        cell.classList.add("active");
        cell.classList.add("isCurrent");
      }
    }
  }, {
    key: "isSelectedDay",
    value: function isSelectedDay(day, cell, selectedDay) {
      // Remove previous selections
      this.dp.querySelectorAll(".isSelected").forEach(function (el) {
        el.classList.remove("active", "isSelected");
      });
      if (day.timestamp === selectedDay) {
        cell.classList.add("active");
        cell.classList.add("isSelected");
        this.selectedTime = day.timestamp;
      }
    }
  }, {
    key: "selectOnClick",
    value: function selectOnClick() {
      this.dp.querySelectorAll(".cell_wrapper").forEach(function (cell) {
        cell.classList.contains("isSelected") && cell.classList.remove("active");
        if (cell.classList.contains("isCurrent") && !cell.classList.contains("active")) {
          cell.querySelector("span").classList.add("inactive_indicator");
        }
      });
    }
  }, {
    key: "getDateStringFromTimestamp",
    value: function getDateStringFromTimestamp(timestamp) {
      if (this.calendarType === "jalali") {
        var dateObject = _jalaaliJs["default"].toJalaali(new Date(timestamp));
        return "".concat(this.months[dateObject.jm - 1], " ").concat(dateObject.jd, ", ").concat(dateObject.jy);
      } else {
        var _dateObject = new Date(timestamp);
        var year = _dateObject.getFullYear();
        var month = _dateObject.getMonth();
        var day = _dateObject.getDate();
        return "".concat(this.months[month], " ").concat(day, ", ").concat(year);
      }
    }
  }, {
    key: "setDateToInput",
    value: function setDateToInput(timestamp, input) {
      var dateString = this.getDateStringFromTimestamp(timestamp);
      input.value = dateString;
    }
  }, {
    key: "getMonthStr",
    value: function getMonthStr(month) {
      return this.months[Math.max(Math.min(11, month), 0)] || "Month";
    }
  }, {
    key: "updateCalendarYear",
    value: function updateCalendarYear(newYear) {
      var currentYear = newYear;
      var currentMonth = this.selectedMonth;
      var currentDay, monthDetails, selectedTimestamp;
      var todayJalali = _jalaaliJs["default"].toJalaali(new Date());
      var gregorianDate = _jalaaliJs["default"].toGregorian(todayJalali.jy, todayJalali.jm, todayJalali.jd);
      var todayTimestamp = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd).getTime();
      if (this.calendarType === "jalali") {
        this.months = this.Jalalimonths;
        this.days = this.Jalalidays;
        var jalaliDate = _jalaaliJs["default"].toJalaali(new Date());
        currentDay = jalaliDate.jd;
        var maxDays = this.getNumberOfDays(currentYear, currentMonth);
        if (currentDay > maxDays) {
          currentDay = maxDays;
        }
        selectedTimestamp = this.selectedTime;
        monthDetails = this.getMonthDetails(currentYear, currentMonth);
      } else {
        this.months = this.Georgianmonths;
        this.days = this.Georgiandays;
        var currentDate = new Date();
        currentDay = currentDate.getDate();
        var _maxDays = this.getNumberOfDaysGregorian(currentYear, currentMonth);
        if (currentDay > _maxDays) {
          currentDay = _maxDays;
        }
        selectedTimestamp = this.selectedTime;
        monthDetails = this.getMonthDetailsGregorian(currentYear, currentMonth);
      }

      // Update global state
      this.selectedYear = currentYear;
      this.setCalBody(monthDetails, todayTimestamp, selectedTimestamp);
      this.setDateToInput(selectedTimestamp, this.input);
      this.updateInput(monthDetails, selectedTimestamp);
    }
  }, {
    key: "updateCalendarMonth",
    value: function updateCalendarMonth(newMonth) {
      var currentMonth = newMonth;
      var currentYear = this.selectedYear;
      var currentDay, monthDetails, selectedTimestamp;
      var todayJalali = _jalaaliJs["default"].toJalaali(new Date());
      var gregorianDate = _jalaaliJs["default"].toGregorian(todayJalali.jy, todayJalali.jm, todayJalali.jd);
      var todayTimestamp = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd).getTime();
      if (this.calendarType === "jalali") {
        this.months = this.Jalalimonths;
        this.days = this.Jalalidays;
        var jalaliDate = _jalaaliJs["default"].toJalaali(new Date());
        currentDay = jalaliDate.jd;
        var maxDays = this.getNumberOfDays(currentYear, currentMonth);
        if (currentDay > maxDays) {
          currentDay = maxDays;
        }
        selectedTimestamp = this.selectedTime;
        monthDetails = this.getMonthDetails(currentYear, currentMonth);
      } else {
        this.months = this.Georgianmonths;
        this.days = this.Georgiandays;
        var currentDate = new Date();
        currentDay = currentDate.getDate();
        var _maxDays2 = this.getNumberOfDaysGregorian(currentYear, currentMonth);
        if (currentDay > _maxDays2) {
          currentDay = _maxDays2;
        }
        selectedTimestamp = this.selectedTime;
        monthDetails = this.getMonthDetailsGregorian(currentYear, currentMonth);
      }
      this.selectedMonth = currentMonth;
      this.setCalBody(monthDetails, todayTimestamp, selectedTimestamp);
      this.setDateToInput(selectedTimestamp, this.input);
      this.updateInput(monthDetails, selectedTimestamp);
    }
  }, {
    key: "generateYearOptions",
    value: function generateYearOptions() {
      var yearPicker = this.dp.querySelector(".select-container");
      if (!yearPicker) return;
      var selectElement = yearPicker.querySelector("select");
      selectElement.innerHTML = "";
      var YEARS_BACK = 100;
      for (var y = this.selectedYear; y >= this.selectedYear - YEARS_BACK; y--) {
        var option = document.createElement("option");
        option.value = y;
        option.textContent = y;
        selectElement.appendChild(option);
      }
    }
  }, {
    key: "initScrollMonthPicker",
    value: function initScrollMonthPicker() {
      (0, _scrollMonthPicker.dpInitScrollMonthPicker)(this.selector);
    }
  }, {
    key: "initCustomSelect",
    value: function initCustomSelect() {
      (0, _select.dpInitCustomSelect)(this.selector);
    }
  }]);
}();
var _default = exports["default"] = DatePicker;