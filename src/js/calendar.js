import * as module from "./calendar";
import jalaali from "jalaali-js";

let calendarType = "jalali";

const input = document.querySelector("#date");
const calendar = document.querySelector("#calendar_main"),
  calHeaderTitle = document.querySelector("#calendar_header span"),
  calDays = document.querySelector("#cal_days");

let months, days;

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
  if (day.timestamp === selectedDay) {
    cell.classList.add("active");
    cell.classList.add("isSelected");
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
  alert(input.value);
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

export const setHeader = (year, month, el) => {
  el.innerHTML = getMonthStr(month) + " " + year;
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
    if (monthDetails[i].timestamp < todayTimestamp) {
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

  setHeader(newCal.year, newCal.month, calHeaderTitle);

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

export const updateInput = (monthDetails, selectedDay, input) => {
  let currentDay = document.querySelector(".isCurrent");

  // Update input based on clicked cell
  document.querySelectorAll(".cell_wrapper").forEach((cell) => {
    if (cell.classList.contains("current")) {
      cell.addEventListener("click", (e) => {
        let cell_date = e.target.textContent;

        // Remove active state from current day

        for (let i = 0; i < monthDetails.length; i++) {
          if (monthDetails[i].month === 0) {
            if (monthDetails[i].date.toString().trim() === cell_date.trim()) {
              selectedDay = monthDetails[i].timestamp;

              module.setDateToInput(selectedDay, input);

              currentDay !== null && currentDay.classList.remove("active");

              selectOnClick();

              cell
                .querySelector("span")
                .classList.contains("inactive_indicator") &&
                cell
                  .querySelector("span")
                  .classList.remove("inactive_indicator");

              isSelectedDay(monthDetails[i], cell, selectedDay);

              // Remove inactive state if current day is clicked
            }
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
  } else {
    months = Georgianmonths;
    days = Georgiandays;
    year = date.getFullYear();
    month = date.getMonth();
    const day = date.getDate();

    todayTimestamp = new Date(year, month, day).getTime();

    monthDetails = getMonthDetailsGregorian(year, month);
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

  // Set the header for the new month
  setHeader(year, month, calHeaderTitle);

  // Add the weekday labels at the top of the calendar
  calDays.innerHTML = ""; // Clear previous days
  for (let i = 0; i < days.length; i++) {
    let div = document.createElement("div"),
      span = document.createElement("span");

    div.classList.add("cell_wrapper");
    span.classList.add("cell_item");

    span.innerText = days[i].slice(0, 2);

    div.appendChild(span);
    calDays.appendChild(div);
  }

  // Set the date input value to today's date
  setDateToInput(todayTimestamp, input);

  // Render the new month body
  setCalBody(monthDetails, todayTimestamp, selectedDay);

  // Handle click events for selecting a date
  updateInput(monthDetails, selectedDay, input);
};

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector("#change-calendar");

  toggleBtn.addEventListener("click", () => {
    calendarType = calendarType === "jalali" ? "gregorian" : "jalali";
    document.documentElement.style.setProperty(
      "--font",
      calendarType === "jalali" ? "Yekan" : "Inter"
    );

    initCalendar();
  });
});
