const calendar = document.querySelector("#calendar_main"),
  input = document.querySelector("#date"),
  calHeader = document.querySelector("#calendar_header"),
  calHeaderTitle = document.querySelector("#calendar_header span"),
  calDays = document.querySelector("#cal_days"),
  days = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه شنبه",
    "چهار شنبه",
    "پنج شنبه",
    "جمعه",
  ],
  months = [
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

let oneDay = 60 * 60 * 24 * 1000;

// Calculated Today

let todayJalali = jalaali.toJalaali(new Date());

// Convert the Jalali date back to Gregorian date
let gregorianDate = jalaali.toGregorian(
  todayJalali.jy,
  todayJalali.jm,
  todayJalali.jd
);

// Create a new JavaScript Date object using the Gregorian date
let todayTimestamp = new Date(
  gregorianDate.gy,
  gregorianDate.gm - 1,
  gregorianDate.gd
).getTime();

let selectedDay = todayTimestamp;

// Calculate the days in each month with an astonishing way

/*  This starts on February 1, 2024 (because month = 1 corresponds to February).
    Adding 40 days to February 1 moves the date to March 11, 2024.
    JavaScript's Date object automatically adjusts for the number of days in the month (February has 29 days in 2024 because it’s a leap year). */
const getNumberOfDays = (year, month) => {
  const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  // If Esfand (month 11 in zero-based index) and leap year
  if (month === 11 && isLeapYear(year)) {
    return 30;
  }

  return monthDays[month];
};

const isLeapYear = (year) => {
  return jalaali.isLeapJalaaliYear(year); // Use jalaali-js or similar library
};

const getDayDetails = (args) => {
  let date = args.index - args.firstDay;
  let day = args.index % 7;

  // Adjust for Jalali calendar where the first day is Saturday
  day = (day + 1) % 7; // Shift days so that Saturday is 0, Sunday is 1, etc.

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

  // Convert the Jalali date to Gregorian before creating timestamp
  let gregorianDate = jalaali.toGregorian(args.year, args.month + 1, _date); // Jalali month is 1-based, so +1

  let timestamp = new Date(
    gregorianDate.gy,
    gregorianDate.gm - 1,
    gregorianDate.gd
  ).getTime(); // Gregorian month is 0-based

  return {
    date: _date,
    day,
    month,
    timestamp,
    dayString: days[day],
  };
};

const getJalaliFirstDay = (year, month) => {
  // Convert Jalali year, month, and day (always 1st of the month) to Gregorian
  const { gy, gm, gd } = jalaali.toGregorian(year, month + 1, 1); // month + 1 because Jalali months are 1-indexed

  // Get the Gregorian day of the week (0 = Sunday, 6 = Saturday)
  const gregorianFirstDay = new Date(gy, gm - 1, gd).getDay();

  // Adjust for Jalali (0 = Saturday, 6 = Friday)
  const jalaliFirstDay = (gregorianFirstDay + 1) % 7;

  return jalaliFirstDay;
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

let date = new Date();

// Convert the current Gregorian year and month to Jalali
let jalaliDate = jalaali.toJalaali(date);

// Get the Jalali year and month
let year = jalaliDate.jy;
let month = jalaliDate.jm - 1; // Adjusting because `jalaali.toJalaali()` returns month in range 1-12

// Now use the Jalali year and month to get month details
let monthDetails = getMonthDetails(year, month);

const isCurrentDay = (day, cell) => {
  if (day.timestamp === todayTimestamp) {
    cell.classList.add("active");
    cell.classList.add("isCurrent");
  }
};

const isSelectedDay = (day, cell) => {
  if (day.timestamp === selectedDay) {
    cell.classList.add("active");
    cell.classList.add("isSelected");
  }
};

const getMonthStr = (month) =>
  months[Math.max(Math.min(11, month), 0)] || "Month"; // Record like mechanism to correspond number to month

const setHeader = (year, month) => {
  calHeaderTitle.innerHTML = getMonthStr(month) + " " + year;
};

// Set calendar header
setHeader(year, month);

const setHeaderNav = (offset) => {
  month = month + offset;
  if (month === -1) {
    month = 11;
    year--;
  } else if (month === 12) {
    month = 0;
    year++;
  }
  monthDetails = getMonthDetails(year, month);
  // console.log(getMonthDetails(year, month))
  return {
    year,
    month,
    monthDetails,
  };
};

const getDateStringFromTimestamp = (timestamp) => {
  let dateObject = jalaali.toJalaali(new Date(timestamp));

  return `${months[dateObject.jm - 1]} ${dateObject.jd}, ${dateObject.jy}`;
};

const setDateToInput = (timestamp) => {
  let dateString = getDateStringFromTimestamp(timestamp);
  input.value = dateString;
  alert(input.value);
};

setDateToInput(todayTimestamp);

// Abbr generation for day names

for (let i = 0; i < days.length; i++) {
  let div = document.createElement("div"),
    span = document.createElement("span");

  div.classList.add("cell_wrapper");
  span.classList.add("cell_item");

  span.innerText = days[i].slice(0, 2);

  div.appendChild(span);
  calDays.appendChild(div);
}

// Generate Body of calendar

const setCalBody = (monthDetails) => {
  // Add dates to calendar
  for (let i = 0; i < monthDetails.length; i++) {
    let div = document.createElement("div"),
      span = document.createElement("span");

    div.classList.add("cell_wrapper");
    div.classList.add("cal_date");
    monthDetails[i].month === 0
      ? div.classList.add("current")
      : div.classList.add("hiddenz");
    monthDetails[i].month === 0 && isCurrentDay(monthDetails[i], div);
    span.classList.add("cell_item");

    span.innerText = monthDetails[i].date;

    div.appendChild(span);
    calendar.appendChild(div);
  }
};

setCalBody(monthDetails);

// Re arrange dates according to arrow

const updateCalendar = (btn) => {
  let newCal, offset;
  if (btn.classList.contains("back")) {
    offset = -1;
  } else if (btn.classList.contains("front")) {
    offset = 1;
  }
  newCal = setHeaderNav(offset);
  // console.log(monthDetails)
  setHeader(newCal.year, newCal.month);
  calendar.innerHTML = "";
  setCalBody(newCal.monthDetails);
};

document.querySelectorAll(".cal-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    updateCalendar(btn);
    updateInput();
  });
});

const updateInput = () => {
  let currentDay = document.querySelector(".isCurrent");
  // Update input based on clicked cell
  document.querySelectorAll(".cell_wrapper").forEach((cell) => {
    if (cell.classList.contains("current")) {
      cell.addEventListener("click", (e) => {
        let cell_date = e.target.textContent;

        // Remove active state from current day

        for (let i = 0; i < monthDetails.length; i++) {
          if (monthDetails[i].month === 0) {
            if (monthDetails[i].date.toString() === cell_date) {
              selectedDay = monthDetails[i].timestamp;
              setDateToInput(selectedDay);

              // Assure only one calendar day is selected

              currentDay !== null && currentDay.classList.remove("active");

              selectOnClick();

              cell
                .querySelector("span")
                .classList.contains("inactive_indicator") &&
                cell
                  .querySelector("span")
                  .classList.remove("inactive_indicator");

              isSelectedDay(monthDetails[i], cell);

              // Remove inactive state if current day is clicked
            }
          }
        }
      });
    }
  });
};

const selectOnClick = () => {
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

updateInput();
