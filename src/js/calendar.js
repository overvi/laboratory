import jalaali from "jalaali-js";
import { dpInitCustomSelect } from "./select";
import { dpInitScrollMonthPicker } from "./scroll-month-picker";

class DatePicker {
  constructor(elementId) {
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

    this.input.addEventListener("click", () => {
      dpInitScrollMonthPicker(this.selector);
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
    this.Jalalimonths = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر ",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];

    this.Jalalidays = [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه شنبه",
      "چهار شنبه",
      "پنج شنبه",
      "جمعه",
    ];

    this.Georgianmonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.Georgiandays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    this.months = this.Jalalimonths;
    this.days = this.Jalalidays;

    // Initialize
    this.init();
  }

  init() {
    this.initCalendar();
    this.setupEventListeners();
    this.initScrollMonthPicker();
    this.generateYearOptions();
    this.initCustomSelect();
  }

  setupEventListeners() {
    // Handle navigation buttons
    this.dp.querySelectorAll(".cal-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newDate = this.updateCalendar(
          btn,
          this.selectedMonth,
          this.selectedYear,
          this.monthDetails,
          this.todayTimestamp,
          this.selectedTime
        );
        this.selectedYear = newDate.year;
        this.selectedMonth = newDate.month;
        this.monthDetails = newDate.monthDetails;

        this.updateInput(this.monthDetails, this.selectedTime);
      });
    });

    // Toggle calendar type
    const toggleBtn = this.dp.querySelector(".change-calendar");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        this.calendarType =
          this.calendarType === "jalali" ? "gregorian" : "jalali";
        toggleBtn.textContent =
          this.calendarType === "jalali" ? "تقویم میلادی" : "تقویم شمسی";

        this.initCalendar();
        this.initScrollMonthPicker();
        this.generateYearOptions();

        this.initCustomSelect();
      });
    }

    // Year picker change event
    const yearPicker = this.dp.querySelector(".select-container");
    if (yearPicker) {
      yearPicker.querySelector("select").addEventListener("change", (e) => {
        const selectedYear = parseInt(e.target.value, 10);

        if (!isNaN(selectedYear)) {
          this.updateCalendarYear(selectedYear);
        }
      });
    }

    // Select and delete buttons
    this.dp.querySelector(".select").addEventListener("click", () => {
      if (this.selectedTime) {
        this.setDateToInput(this.selectedTime, this.input);
      }
    });

    this.dp.querySelector(".delete").addEventListener("click", () => {
      this.selectedTime = null;
      this.dp
        .querySelectorAll(".isSelected")
        .forEach((el) => el.classList.remove("active", "isSelected"));
      this.input.value = "";
    });
  }

  initCalendar() {
    // Clear the calendar before rendering the new one
    this.calendar.innerHTML = "";

    let date = new Date();
    const currentDate = new Date();

    if (this.calendarType === "jalali") {
      const jalaliDate = jalaali.toJalaali(currentDate);
      this.selectedYear = jalaliDate.jy;
      this.selectedMonth = jalaliDate.jm - 1; // 0-indexed for internal use

      this.months = this.Jalalimonths;
      this.days = this.Jalalidays;

      let todayJalali = jalaali.toJalaali(new Date());
      let gregorianDate = jalaali.toGregorian(
        todayJalali.jy,
        todayJalali.jm,
        todayJalali.jd
      );

      this.todayTimestamp = new Date(
        gregorianDate.gy,
        gregorianDate.gm - 1,
        gregorianDate.gd
      ).getTime();

      let year = jalaliDate.jy;
      let month = jalaliDate.jm - 1;

      this.monthDetails = this.getMonthDetails(year, month);
      this.currentMonthIndex = month;
    } else {
      this.selectedYear = currentDate.getFullYear();
      this.selectedMonth = currentDate.getMonth();

      this.months = this.Georgianmonths;
      this.days = this.Georgiandays;

      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();

      this.todayTimestamp = new Date(year, month, day).getTime();
      this.monthDetails = this.getMonthDetailsGregorian(year, month);
      this.currentMonthIndex = month;
    }

    this.selectedTime = this.todayTimestamp;

    // Add the weekday labels at the top of the calendar
    this.calDays.innerHTML = "";
    for (let i = 0; i < this.days.length; i++) {
      let div = document.createElement("div");
      let span = document.createElement("span");

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

  getMonths() {
    return this.months;
  }
  getCurrentMonthIndex() {
    return this.currentMonthIndex;
  }

  setCalBody(monthDetails, todayTimestamp, selectedDay) {
    // Clear the previous calendar dates
    this.calendar.innerHTML = "";

    // Add dates to calendar
    for (let i = 0; i < monthDetails.length; i++) {
      let div = document.createElement("div");
      let span = document.createElement("span");

      div.classList.add("cell_wrapper");
      div.classList.add("cal_date");

      // Check if the current date is before today and disable it
      if (Math.abs(monthDetails[i].timestamp) < todayTimestamp) {
        div.classList.add("disabled");
      } else {
        monthDetails[i].month === 0
          ? div.classList.add("current")
          : div.classList.add("hiddenz");

        monthDetails[i].month === 0 &&
          this.isCurrentDay(monthDetails[i], div, todayTimestamp);
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

  updateInput(monthDetails) {
    this.dp.querySelectorAll(".cell_wrapper").forEach((cell) => {
      if (cell.classList.contains("current")) {
        cell.addEventListener("click", (e) => {
          let cell_date = e.target.textContent.trim();

          for (let i = 0; i < monthDetails.length; i++) {
            if (
              monthDetails[i].month === 0 &&
              monthDetails[i].date.toString().trim() === cell_date
            ) {
              this.selectedTime = monthDetails[i].timestamp;
              this.dp
                .querySelectorAll(".isSelected")
                .forEach((el) => el.classList.remove("active", "isSelected"));
              cell.classList.add("active", "isSelected");
            }
          }
        });
      }
    });
  }

  updateCalendar(btn, month, year, monthDetails, todayTimestamp, selectedDay) {
    let offset;
    if (btn.classList.contains("back")) {
      offset = -1;
    } else if (btn.classList.contains("front")) {
      offset = 1;
    }

    const newCal = this.setHeaderNav(offset, month, year, monthDetails);

    // Re-render the calendar body
    this.setCalBody(newCal.monthDetails, todayTimestamp, selectedDay);

    return newCal;
  }

  setHeaderNav(offset, month, year, monthDetails) {
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
      year,
      month,
      monthDetails,
    };
  }

  getJalaliFirstDay(year, month) {
    const { gy, gm, gd } = jalaali.toGregorian(year, month + 1, 1);
    const gregorianFirstDay = new Date(gy, gm - 1, gd).getDay();
    const jalaliFirstDay = (gregorianFirstDay + 1) % 7;
    return jalaliFirstDay;
  }

  getMonthDetails(year, month) {
    let firstDay = this.getJalaliFirstDay(year, month);
    let monthArray = [];
    let numberOfDays = this.getNumberOfDays(year, month);
    let rows = 5;
    let currentDay = null;
    let index = 0;
    let cols = firstDay >= 5 ? 8 : 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = this.getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  }

  getDayDetails(args) {
    let date = args.index - args.firstDay;
    let day = args.index % 7;

    day = (day + 1) % 7;

    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);

    let _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;

    let gregorianDate = jalaali.toGregorian(args.year, args.month + 1, _date);

    let timestamp = new Date(
      gregorianDate.gy,
      gregorianDate.gm - 1,
      gregorianDate.gd
    ).getTime();

    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: this.days[day],
    };
  }

  getMonthDetailsGregorian(year, month) {
    let firstDay = new Date(year, month).getDay();
    let numberOfDays = this.getNumberOfDaysGregorian(year, month);
    let monthArray = [];
    let rows = 5;
    let currentDay = null;
    let index = 0;
    let cols = firstDay >= 5 ? 8 : 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = this.getDayDetailsGregorian({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  }

  getDayDetailsGregorian(args) {
    let date = args.index - args.firstDay;
    let day = args.index % 7;

    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    let prevMonthNumberOfDays = this.getNumberOfDaysGregorian(
      prevYear,
      prevMonth
    );

    let _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;

    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();

    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: this.days[day],
    };
  }

  getNumberOfDays(year, month) {
    const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

    if (month === 11 && this.isLeapYear(year)) {
      return 30;
    }

    return monthDays[month];
  }

  getNumberOfDaysGregorian(year, month) {
    return 40 - new Date(year, month, 40).getDate();
  }

  isLeapYear(year) {
    return jalaali.isLeapJalaaliYear(year);
  }

  isCurrentDay(day, cell, today) {
    if (day.timestamp === today) {
      cell.classList.add("active");
      cell.classList.add("isCurrent");
    }
  }

  isSelectedDay(day, cell, selectedDay) {
    // Remove previous selections
    this.dp.querySelectorAll(".isSelected").forEach((el) => {
      el.classList.remove("active", "isSelected");
    });

    if (day.timestamp === selectedDay) {
      cell.classList.add("active");
      cell.classList.add("isSelected");
      this.selectedTime = day.timestamp;
    }
  }

  selectOnClick() {
    this.dp.querySelectorAll(".cell_wrapper").forEach((cell) => {
      cell.classList.contains("isSelected") && cell.classList.remove("active");

      if (
        cell.classList.contains("isCurrent") &&
        !cell.classList.contains("active")
      ) {
        cell.querySelector("span").classList.add("inactive_indicator");
      }
    });
  }

  getDateStringFromTimestamp(timestamp) {
    if (this.calendarType === "jalali") {
      let dateObject = jalaali.toJalaali(new Date(timestamp));
      return `${this.months[dateObject.jm - 1]} ${dateObject.jd}, ${
        dateObject.jy
      }`;
    } else {
      let dateObject = new Date(timestamp);
      let year = dateObject.getFullYear();
      let month = dateObject.getMonth();
      let day = dateObject.getDate();
      return `${this.months[month]} ${day}, ${year}`;
    }
  }

  setDateToInput(timestamp, input) {
    let dateString = this.getDateStringFromTimestamp(timestamp);
    input.value = dateString;
  }

  getMonthStr(month) {
    return this.months[Math.max(Math.min(11, month), 0)] || "Month";
  }

  updateCalendarYear(newYear) {
    let currentYear = newYear;
    let currentMonth = this.selectedMonth;
    let currentDay, monthDetails, selectedTimestamp;

    let todayJalali = jalaali.toJalaali(new Date());
    let gregorianDate = jalaali.toGregorian(
      todayJalali.jy,
      todayJalali.jm,
      todayJalali.jd
    );

    let todayTimestamp = new Date(
      gregorianDate.gy,
      gregorianDate.gm - 1,
      gregorianDate.gd
    ).getTime();

    if (this.calendarType === "jalali") {
      this.months = this.Jalalimonths;
      this.days = this.Jalalidays;

      let jalaliDate = jalaali.toJalaali(new Date());
      currentDay = jalaliDate.jd;

      let maxDays = this.getNumberOfDays(currentYear, currentMonth);
      if (currentDay > maxDays) {
        currentDay = maxDays;
      }

      selectedTimestamp = this.selectedTime;
      monthDetails = this.getMonthDetails(currentYear, currentMonth);
    } else {
      this.months = this.Georgianmonths;
      this.days = this.Georgiandays;

      let currentDate = new Date();
      currentDay = currentDate.getDate();

      let maxDays = this.getNumberOfDaysGregorian(currentYear, currentMonth);
      if (currentDay > maxDays) {
        currentDay = maxDays;
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

  updateCalendarMonth(newMonth) {
    let currentMonth = newMonth;
    let currentYear = this.selectedYear;
    let currentDay, monthDetails, selectedTimestamp;

    let todayJalali = jalaali.toJalaali(new Date());
    let gregorianDate = jalaali.toGregorian(
      todayJalali.jy,
      todayJalali.jm,
      todayJalali.jd
    );

    let todayTimestamp = new Date(
      gregorianDate.gy,
      gregorianDate.gm - 1,
      gregorianDate.gd
    ).getTime();

    if (this.calendarType === "jalali") {
      this.months = this.Jalalimonths;
      this.days = this.Jalalidays;

      let jalaliDate = jalaali.toJalaali(new Date());
      currentDay = jalaliDate.jd;

      let maxDays = this.getNumberOfDays(currentYear, currentMonth);
      if (currentDay > maxDays) {
        currentDay = maxDays;
      }

      selectedTimestamp = this.selectedTime;
      monthDetails = this.getMonthDetails(currentYear, currentMonth);
    } else {
      this.months = this.Georgianmonths;
      this.days = this.Georgiandays;

      let currentDate = new Date();
      currentDay = currentDate.getDate();

      let maxDays = this.getNumberOfDaysGregorian(currentYear, currentMonth);
      if (currentDay > maxDays) {
        currentDay = maxDays;
      }

      selectedTimestamp = this.selectedTime;
      monthDetails = this.getMonthDetailsGregorian(currentYear, currentMonth);
    }

    this.selectedMonth = currentMonth;

    this.setCalBody(monthDetails, todayTimestamp, selectedTimestamp);
    this.setDateToInput(selectedTimestamp, this.input);
    this.updateInput(monthDetails, selectedTimestamp);
  }


  generateYearOptions() {
    const yearPicker = this.dp.querySelector(".select-container");
    if (!yearPicker) return;

    const selectElement = yearPicker.querySelector("select");

    selectElement.innerHTML = "";

    const YEARS_BACK = 100;

    for (let y = this.selectedYear; y >= this.selectedYear - YEARS_BACK; y--) {
      const option = document.createElement("option");
      option.value = y;
      option.textContent = y;
      selectElement.appendChild(option);
    }
  }

  initScrollMonthPicker() {
    dpInitScrollMonthPicker(this.selector);
  }

  initCustomSelect() {
    dpInitCustomSelect(this.selector);
  }
}

export default DatePicker;
