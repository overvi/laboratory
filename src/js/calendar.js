import * as module from "./calendar";
import jalaali from "jalaali-js";
import { initScrollMonthPicker } from "./scroll-month-picker";
import { initCustomSelect } from "./select";

let calendarType = "jalali";

const input = document.querySelector("#date");
const calendar = document.querySelector("#calendar_main"),
  calDays = document.querySelector("#cal_days");

let selectedYear;
let selectedMonth;
let selectedTime;
export let currentMonthIndex;

export let initialized = false;
export let months;
let days;

const Jalalimonths = [
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

const Jalalidays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه شنبه",
  "چهار شنبه",
  "پنج شنبه",
  "جمعه",
];

const Georgianmonths = [
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

const Georgiandays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const isSelectedDay = (day, cell, selectedDay) => {
  // Remove previous selections
  document.querySelectorAll(".isSelected").forEach((el) => {
    el.classList.remove("active", "isSelected");
  });

  if (day.timestamp === selectedDay) {
    cell.classList.add("active");
    cell.classList.add("isSelected");
    selectedTime = day.timestamp;
  }
};

export const selectOnClick = () => {
  document.querySelectorAll(".cell_wrapper").forEach((cell) => {
    cell.classList.contains("isSelected") && cell.classList.remove("active");

    if (
      cell.classList.contains("isCurrent") &&
      !cell.classList.contains("active")
    ) {
      cell.querySelector("span").classList.add("inactive_indicator");
    }
  });
};

export const getDateStringFromTimestamp = (timestamp) => {
  if (calendarType === "jalali") {
    let dateObject = jalaali.toJalaali(new Date(timestamp));

    return `${months[dateObject.jm - 1]} ${dateObject.jd}, ${dateObject.jy}`;
  } else {
    let dateObject = new Date(timestamp); // Create Date object from timestamp

    let year = dateObject.getFullYear();
    let month = dateObject.getMonth(); // Get the month (0-indexed)
    let day = dateObject.getDate();

    return `${months[month]} ${day}, ${year}`;
  }
};

export const setDateToInput = (timestamp, input) => {
  let dateString = getDateStringFromTimestamp(timestamp);
  input.value = dateString;
};

export const getNumberOfDays = (year, month) => {
  const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  if (month === 11 && isLeapYear(year)) {
    return 30;
  }

  return monthDays[month];
};

const isLeapYear = (year) => {
  return jalaali.isLeapJalaaliYear(year);
};

const isCurrentDay = (day, cell, today) => {
  if (day.timestamp === today) {
    cell.classList.add("active");
    cell.classList.add("isCurrent");
  }
};

export const getMonthStr = (month) =>
  months[Math.max(Math.min(11, month), 0)] || "Month";

export const getJalaliFirstDay = (year, month) => {
  const { gy, gm, gd } = jalaali.toGregorian(year, month + 1, 1);

  const gregorianFirstDay = new Date(gy, gm - 1, gd).getDay();

  const jalaliFirstDay = (gregorianFirstDay + 1) % 7;

  return jalaliFirstDay;
};

const setHeaderNav = (offset, month, year, monthDetails) => {
  month = month + offset;
  if (month === -1) {
    month = 11;
    year--;
  } else if (month === 12) {
    month = 0;
    year++;
  }

  if (calendarType === "jalali") {
    monthDetails = getMonthDetails(year, month);
  } else {
    monthDetails = getMonthDetailsGregorian(year, month);
  }

  return {
    year,
    month,
    monthDetails,
  };
};

const setCalBody = (monthDetails, todayTimestamp, selectedDay) => {
  // Clear the previous calendar dates
  calendar.innerHTML = "";

  // Add dates to calendar
  for (let i = 0; i < monthDetails.length; i++) {
    let div = document.createElement("div"),
      span = document.createElement("span");

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
        isCurrentDay(monthDetails[i], div, todayTimestamp);
    }

    span.classList.add("cell_item");

    span.innerText = monthDetails[i].date;

    // Add the active or selected day class
    if (monthDetails[i].timestamp === selectedDay) {
      div.classList.add("active");
      div.classList.add("isSelected");
      selectedTime = monthDetails[i].timestamp;
    }

    div.appendChild(span);
    calendar.appendChild(div);
  }
};

// Re arrange dates according to arrow

const updateCalendar = (
  btn,
  month,
  year,
  monthDetails,
  todayTimestamp,
  selectedDay
) => {
  let newCal, offset;
  if (btn.classList.contains("back")) {
    offset = -1;
  } else if (btn.classList.contains("front")) {
    offset = 1;
  }
  newCal = setHeaderNav(offset, month, year, monthDetails);

  // Re-render the calendar body with the selectedDay and todayTimestamp
  setCalBody(newCal.monthDetails, todayTimestamp, selectedDay);

  return newCal;
};

const getNumberOfDaysGregorian = (year, month) => {
  return 40 - new Date(year, month, 40).getDate();
};

const getMonthDetailsGregorian = (year, month) => {
  let firstDay = new Date(year, month).getDay();
  let numberOfDays = getNumberOfDaysGregorian(year, month);
  let monthArray = [];
  let rows = 5;
  let currentDay = null;
  let index = 0;
  let cols = 7;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      currentDay = getDayDetailsGregorian({
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
};

const getDayDetailsGregorian = (args) => {
  let date = args.index - args.firstDay;
  let day = args.index % 7;

  let prevMonth = args.month - 1;
  let prevYear = args.year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  let prevMonthNumberOfDays = getNumberOfDaysGregorian(prevYear, prevMonth);

  let _date =
    (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;

  let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
  let timestamp = new Date(args.year, args.month, _date).getTime();

  return {
    date: _date,
    day,
    month,
    timestamp,
    dayString: days[day],
  };
};

const getMonthDetails = (year, month) => {
  let firstDay = getJalaliFirstDay(year, month); // Correct first day for Jalali  let numberOfDays = getNumberOfDays(year, month);
  let monthArray = [];
  let numberOfDays = getNumberOfDays(year, month); // Number of days in Jalali month
  let rows = 5;
  let currentDay = null;
  let index = 0;
  let cols = firstDay >= 5 ? 8 : 7;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      currentDay = getDayDetails({
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
};

const getDayDetails = (args) => {
  let date = args.index - args.firstDay;
  let day = args.index % 7;

  day = (day + 1) % 7;

  let prevMonth = args.month - 1;
  let prevYear = args.year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);

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
    dayString: days[day],
  };
};

export const updateInput = (monthDetails, selectedDay) => {
  document.querySelectorAll(".cell_wrapper").forEach((cell) => {
    if (cell.classList.contains("current")) {
      cell.addEventListener("click", (e) => {
        let cell_date = e.target.textContent.trim();

        for (let i = 0; i < monthDetails.length; i++) {
          if (
            monthDetails[i].month === 0 &&
            monthDetails[i].date.toString().trim() === cell_date
          ) {
            selectedTime = monthDetails[i].timestamp; // ✅ Store selected timestamp
            document
              .querySelectorAll(".isSelected")
              .forEach((el) => el.classList.remove("active", "isSelected"));
            cell.classList.add("active", "isSelected"); // ✅ Visually highlight selection
          }
        }
      });
    }
  });
};

export const initCalendar = () => {
  // Clear the calendar before rendering the new one
  calendar.innerHTML = ""; // This clears the entire calendar including the header and days

  let year, month, monthDetails, todayTimestamp;

  let date = new Date();

  const currentDate = new Date();

  if (calendarType === "jalali") {
    const jalaliDate = jalaali.toJalaali(currentDate);
    selectedYear = jalaliDate.jy;
    selectedMonth = jalaliDate.jm;
  } else {
    selectedYear = currentDate.getFullYear();
    selectedMonth = currentDate.getMonth() + 1;
  }

  if (calendarType === "jalali") {
    months = Jalalimonths;
    days = Jalalidays;
    let todayJalali = jalaali.toJalaali(new Date());

    let gregorianDate = jalaali.toGregorian(
      todayJalali.jy,
      todayJalali.jm,
      todayJalali.jd
    );

    todayTimestamp = new Date(
      gregorianDate.gy,
      gregorianDate.gm - 1,
      gregorianDate.gd
    ).getTime();

    let jalaliDate = jalaali.toJalaali(date);

    year = jalaliDate.jy;
    month = jalaliDate.jm - 1;

    monthDetails = getMonthDetails(year, month);

    currentMonthIndex = month;
  } else {
    months = Georgianmonths;
    days = Georgiandays;
    year = date.getFullYear();
    month = date.getMonth();
    const day = date.getDate();

    todayTimestamp = new Date(year, month, day).getTime();

    monthDetails = getMonthDetailsGregorian(year, month);
    currentMonthIndex = month;
  }

  let selectedDay = todayTimestamp;

  // Now handle the navigation buttons
  document.querySelectorAll(".cal-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const newDate = updateCalendar(
        btn,
        month,
        year,
        monthDetails,
        todayTimestamp,
        selectedDay
      );
      year = newDate.year;
      month = newDate.month;
      monthDetails = newDate.monthDetails;

      updateInput(monthDetails, selectedDay, input);
    });
  });

  // Add the weekday labels at the top of the calendar
  calDays.innerHTML = ""; // Clear previous days
  for (let i = 0; i < days.length; i++) {
    let div = document.createElement("div"),
      span = document.createElement("span");

    div.classList.add("cell_wrapper");
    span.classList.add("cell_item");

    span.innerText = days[i];

    div.appendChild(span);
    calDays.appendChild(div);
  }

  // Set the date input value to today's date
  setDateToInput(todayTimestamp, input);

  // Render the new month body
  setCalBody(monthDetails, todayTimestamp, selectedDay);

  // Handle click events for selecting a date
  updateInput(monthDetails, selectedDay, input);

  initialized = true;
};

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("change-calendar");
  const yearPicker = document.getElementById("year-picker"); // Select year picker

  // Function to generate year options
  function generateYearOptions() {
    const selectElement = yearPicker.querySelector("select");

    // Clear any existing options
    selectElement.innerHTML = "";

    if (calendarType === "jalali") {
      // Add 4 years starting from the current Jalali year
      for (let i = 0; i < 4; i++) {
        const option = document.createElement("option");
        option.value = selectedYear + i;
        option.textContent = selectedYear + i;
        selectElement.appendChild(option);
      }
    } else {
      // Add 4 years starting from the current Gregorian year
      for (let i = 0; i < 4; i++) {
        const option = document.createElement("option");
        option.value = selectedYear + i;
        option.textContent = selectedYear + i;
        selectElement.appendChild(option);
      }
    }
  }

  // Toggle between Jalali and Gregorian calendars
  toggleBtn.addEventListener("click", () => {
    calendarType = calendarType === "jalali" ? "gregorian" : "jalali";

    toggleBtn.textContent =
      calendarType === "jalali" ? "تقویم میلادی" : "تقویم شمسی";

    initCalendar();
    initScrollMonthPicker();
    generateYearOptions();
    initCustomSelect();
  });

  // Initialize year picker options
  generateYearOptions();

  // Year picker change event
  if (yearPicker) {
    yearPicker.querySelector("select").addEventListener("change", (e) => {
      const selectedYear = parseInt(e.target.value, 10);

      if (!isNaN(selectedYear)) {
        updateCalendarYear(selectedYear);
      }
    });
  }

  document.querySelector("#select").addEventListener("click", () => {
    if (selectedTime) {
      setDateToInput(selectedTime, input); // ✅ Update input when button is clicked
    }
  });
  document.querySelector("#delete").addEventListener("click", () => {
    selectedTime = null; // ✅ Reset selected date
    document
      .querySelectorAll(".isSelected")
      .forEach((el) => el.classList.remove("active", "isSelected")); // ✅ Remove highlight
    input.value = ""; // ✅ Clear input field
  });
});

const updateCalendarYear = (newYear) => {
  let currentYear = newYear;
  let currentMonth = selectedMonth;
  let currentDay, monthDetails, selectedTimestamp;

  console.log(currentMonth);
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

  if (calendarType === "jalali") {
    months = Jalalimonths;
    days = Jalalidays;

    let jalaliDate = jalaali.toJalaali(new Date());
    currentDay = jalaliDate.jd;

    let maxDays = getNumberOfDays(currentYear, currentMonth);
    if (currentDay > maxDays) {
      currentDay = maxDays;
    }

    selectedTimestamp = selectedTime;
    monthDetails = getMonthDetails(currentYear, currentMonth);
  } else {
    months = Georgianmonths;
    days = Georgiandays;

    let currentDate = new Date();
    currentDay = currentDate.getDate();

    let maxDays = getNumberOfDaysGregorian(currentYear, currentMonth);
    if (currentDay > maxDays) {
      currentDay = maxDays;
    }

    selectedTimestamp = selectedTime;
    monthDetails = getMonthDetailsGregorian(currentYear, currentMonth);
  }

  // Update global state
  selectedYear = currentYear;

  setCalBody(monthDetails, todayTimestamp, selectedTimestamp); // ✅ Real todayTimestamp
  setDateToInput(selectedTimestamp, input);
  updateInput(monthDetails, selectedTimestamp, input);
};

export const updateCalendarMonth = (newMonth) => {
  let currentMonth = newMonth;
  let currentYear = selectedYear;
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

  if (calendarType === "jalali") {
    months = Jalalimonths;
    days = Jalalidays;

    let jalaliDate = jalaali.toJalaali(new Date());
    currentDay = jalaliDate.jd;

    let maxDays = getNumberOfDays(currentYear, currentMonth);
    if (currentDay > maxDays) {
      currentDay = maxDays;
    }

    selectedTimestamp = selectedTime;
    monthDetails = getMonthDetails(currentYear, currentMonth);
  } else {
    months = Georgianmonths;
    days = Georgiandays;

    let currentDate = new Date();
    currentDay = currentDate.getDate();

    let maxDays = getNumberOfDaysGregorian(currentYear, currentMonth);
    if (currentDay > maxDays) {
      currentDay = maxDays;
    }

    selectedTimestamp = selectedTime;
    monthDetails = getMonthDetailsGregorian(currentYear, currentMonth);
  }

  selectedMonth = currentMonth;

  setCalBody(monthDetails, todayTimestamp, selectedTimestamp); // ✅ Real todayTimestamp
  setDateToInput(selectedTimestamp, input);
  updateInput(monthDetails, selectedTimestamp, input);
};
