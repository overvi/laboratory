// Import the necessary libraries
import "@testing-library/jest-dom";
// calendar.test.js
import * as calendar from "../js/calendar";

function createCell() {
  return {
    classList: {
      classes: [],
      add: function (className) {
        this.classes.push(className);
      },
      contains: function (className) {
        return this.classes.includes(className);
      },
    },
  };
}

describe("Utilities", () => {
  global.alert = jest.fn();

  beforeEach(() => {
    document.body.innerHTML = `
 <main>
      <div id="date_picker" style="direction: rtl">
        <div id="date_picker_input">
          <input type="text" id="date" />
        </div>
        <div id="date_picker_calendar">
          <div id="calendar_header">
            <button class="cal-btn back">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABJUlEQVR4nO2Uv0oDQRCHR9BKrAQJ2FgIdnc7njtzSbMzd7lGC80T5DXMW+gzpNJHsPEJYuELBA60EBELsfIfBGIixvNyt0IKP9h2vt3fb1iAfxaCXZt0DGuOrO8+jmHNQ3JHnwLDeutrOI4lJDcTAcngDwSDSUSkCbK++RSEJAdfejCkfX+31/63oq1N15H0rn7Bch80s42Z22SsdGsLrHQLVxZJLioLSC8BYKlQELLbQpanCrk/Y+y2C4dPFd6bP3s9hrI455aR9GqO219HUbRSWjB6xV5qDcnL7wJ5RZs2oQpIelqi2BOoShBkq0g6LMg932m11qAOhnX/5+zlEHyALOczhp+BL6x1DSR9mPoOHsM42QSfGE6yUR+kQxO7ttfhC80HheuaG9wAq10AAAAASUVORK5CYII="
              />
            </button>
            <span></span>
            <button class="cal-btn front">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABJUlEQVR4nO2Uv0oDQRCHR9BKrAQJ2FgIdnc7njtzSbMzd7lGC80T5DXMW+gzpNJHsPEJYuELBA60EBELsfIfBGIixvNyt0IKP9h2vt3fb1iAfxaCXZt0DGuOrO8+jmHNQ3JHnwLDeutrOI4lJDcTAcngDwSDSUSkCbK++RSEJAdfejCkfX+31/63oq1N15H0rn7Bch80s42Z22SsdGsLrHQLVxZJLioLSC8BYKlQELLbQpanCrk/Y+y2C4dPFd6bP3s9hrI455aR9GqO219HUbRSWjB6xV5qDcnL7wJ5RZs2oQpIelqi2BOoShBkq0g6LMg932m11qAOhnX/5+zlEHyALOczhp+BL6x1DSR9mPoOHsM42QSfGE6yUR+kQxO7ttfhC80HheuaG9wAq10AAAAASUVORK5CYII="
              />
            </button>
          </div>
          <div id="cal_wrapper">
            <div id="cal_days"></div>
            <div id="calendar_main"></div>
          </div>
        </div>
      </div>
    </main>
`;
  });

  test("adds active and isSelected classes when day matches selectedDay", () => {
    const day = { timestamp: 1627286400000 };
    const selectedDay = 1627286400000;
    const cell = createCell();

    calendar.isSelectedDay(day, cell, selectedDay);

    expect(cell.classList.contains("active")).toBe(true);
    expect(cell.classList.contains("isSelected")).toBe(true);
  });
  test("does not add classes when day does not match selectedDay", () => {
    const day = { timestamp: 1672800000 };
    const selectedDay = 1627286400000;
    const cell = createCell();

    calendar.isSelectedDay(day, cell, selectedDay);

    expect(cell.classList.contains("active")).toBe(false);
    expect(cell.classList.contains("isSelected")).toBe(false);
  });

  test("selectOnClick function works as expected", () => {
    document.body.innerHTML = `
    <div class="cell_wrapper isSelected active"><span></span></div>
    <div class="cell_wrapper isCurrent"><span></span></div>
    <div class="cell_wrapper"><span></span></div>
  `;

    calendar.selectOnClick();

    const cell1 = document.querySelector(".cell_wrapper:nth-child(1)");
    const cell2 = document.querySelector(".cell_wrapper:nth-child(2)");
    const cell3 = document.querySelector(".cell_wrapper:nth-child(3)");

    expect(cell1).not.toHaveClass("active");

    expect(cell2.querySelector("span")).toHaveClass("inactive_indicator");

    expect(cell3).not.toHaveClass("inactive_indicator");
  });

  test("getDateStringFromTimestamp function works as expected", () => {
    const timestamp = 1640995200000; // Example timestamp
    const expectedDateString = "دی 11, 1400"; // Example expected output for the given timestamp

    // Call the function with the test timestamp
    const result = calendar.getDateStringFromTimestamp(timestamp);

    // Assertions
    expect(result).toBe(expectedDateString);
  });
  test("setDateToInput function sets the date to the input field and triggers an alert", () => {
    const mockTimestamp = 1672531200000;
    const mockDateString = "دی 11, 1401";
    const mockInput = { value: "" };

    jest
      .spyOn(calendar, "getDateStringFromTimestamp")
      .mockReturnValue(mockDateString);

    calendar.setDateToInput(mockTimestamp, mockInput);

    expect(mockInput.value).toBe(mockDateString);
    expect(global.alert).toHaveBeenCalledWith(mockDateString);
  });

  test("Get number of days returns the correct number for months", () => {
    const month = 11;
    const year = 1398;
    const daysOfMonth = 29;

    const result = calendar.getNumberOfDays(year, month);

    expect(result).toBe(daysOfMonth);
  });

  test("Get Number of Days returns 30 for esfand in a leap year", () => {
    const month = 11;
    const year = 1403;
    const daysOfMonth = 30;

    const result = calendar.getNumberOfDays(year, month);

    expect(result).toBe(daysOfMonth);
  });

  test("Get Months str returns correct string according to number of month", () => {
    const month = 9; // js indexes start from 0 so we should decrement one
    const monthStr = "دی";

    const res = calendar.getMonthStr(month);

    expect(res).toBe(monthStr);
  });
  test("Get Months str returns correct string on wrong input", () => {
    const month = 13; // js indexes start from 0 so we should decrement one
    const monthStr = "اسفند";

    const res = calendar.getMonthStr(month);

    expect(res).toBe(monthStr);
  });
  test("Get First Day of Jalali returns correct number", () => {
    const month = 8; // js indexes start from 0 so we should decrement one
    const year = 1380;
    const expectedValue = 5;

    const res = calendar.getJalaliFirstDay(year, month);

    expect(res).toBe(expectedValue);
  });

  test("Set Header correctly set calendar header", () => {
    const year = 1400;
    const month = 11;
    const el = document.querySelector("#calendar_header span");

    calendar.setHeader(year, month, el);

    expect(el.innerHTML).toBe("اسفند 1400");
  });
});

describe("Init", () => {
  let input, selectedDay, monthDetails, currentDay;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="date" />
      <div class="isCurrent"></div>
      <div id="calendar">
        <div class="cell_wrapper current">
          <span>1</span>
        </div>
        <div class="cell_wrapper">
          <span>2</span>
        </div>
      </div>
    `;

    input = document.querySelector("#date");
    selectedDay = Date.now();
    currentDay = document.querySelector(".isCurrent");

    monthDetails = [
      { date: 1, month: 0, timestamp: selectedDay },
      { date: 2, month: 0, timestamp: selectedDay + 86400000 },
    ];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should update input when a current cell is clicked", () => {
    jest.spyOn(calendar, "updateInput");
    jest.spyOn(calendar, "setDateToInput");
    const cells = document.querySelectorAll(".cell_wrapper");
    calendar.updateInput(monthDetails, selectedDay, input);

    const cell = cells[0];
    cell.click();

    expect(calendar.setDateToInput).toHaveBeenCalledWith(selectedDay, input);

    expect(cell.classList.contains("active")).toBe(true);
    expect(
      cell.querySelector("span").classList.contains("inactive_indicator")
    ).toBe(false);
  });

  test("should not update input for non-current cells", () => {
    const nonCurrentCell = document.querySelectorAll(".cell_wrapper")[1];
    nonCurrentCell.click();
    jest.spyOn(calendar, "setDateToInput");

    expect(calendar.setDateToInput).not.toHaveBeenCalled();
  });
});
