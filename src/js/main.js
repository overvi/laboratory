import { initCalendar } from "./calendar";
import { initScrollMonthPicker } from "./scroll-month-picker";

import { initCustomSelect } from "./select";

initCalendar();
initScrollMonthPicker();

document.addEventListener("DOMContentLoaded", () => {
  initCustomSelect();
});
