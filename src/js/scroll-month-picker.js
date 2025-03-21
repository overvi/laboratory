import { currentMonthIndex, months, updateCalendarMonth } from "./calendar";

export function initScrollMonthPicker() {
  let currentIndex = currentMonthIndex;
  const monthList = document.querySelector(".month-list");

  if (!monthList) return;

  // **Step 1: Remove all previous event listeners**
  const newMonthList = monthList.cloneNode(false); // Clone without children
  monthList.parentNode.replaceChild(newMonthList, monthList); // Replace old one
  monthList.innerHTML = ""; // Clear all items

  let monthItems = Array.from(document.querySelectorAll(".month-item"));
  const colors = ["#000", "#5A5A5A", "#858585", "#B6B6B6", "#D4D4D4"];
  let isScrolling = false;
  let lastScrollPosition = 0;
  let scrollTimeout;

  months.forEach((month) => {
    const el = document.createElement("div");
    el.classList.add("month-item");
    el.textContent = month;
    newMonthList.appendChild(el);
  });

  monthItems = Array.from(newMonthList.querySelectorAll(".month-item"));

  function updateFontSizes() {
    monthItems.forEach((item, index) => {
      const distance = Math.abs(index - currentIndex);
      let fontSize = Math.max(6, 14 - distance * 2);
      item.style.fontSize = fontSize + "px";
      item.style.color = colors[Math.min(distance, colors.length - 1)];
    });
  }

  function updateSelectedMonth(index) {
    index = Math.max(0, Math.min(index, monthItems.length - 1));
    document
      .querySelector(".month-item.selected")
      ?.classList.remove("selected");
    monthItems[index].classList.add("selected");
    currentIndex = index;
    updateFontSizes();
    updateCalendarMonth(index);
  }

  function scrollToMonth(index) {
    const item = monthItems[index];
    const containerRect = document
      .querySelector(".month-list-container")
      .getBoundingClientRect();
    const containerCenter = containerRect.height / 2;
    const scrollPosition =
      item.offsetTop - containerCenter + item.offsetHeight / 2;

    isScrolling = true;
    newMonthList.scrollTo({ top: scrollPosition, behavior: "smooth" });

    setTimeout(() => {
      isScrolling = false;
      lastScrollPosition = newMonthList.scrollTop;
    }, 0);
  }

  newMonthList.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      if (isScrolling) return;
      let stepSize = Math.min(2, Math.max(1, Math.abs(event.deltaY / 110)));
      let direction = event.deltaY > 0 ? stepSize : -stepSize;
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < monthItems.length) {
        updateSelectedMonth(Math.round(newIndex));
        scrollToMonth(Math.round(newIndex));
      }
    },
    { passive: false }
  );

  let touchStartY = 0,
    touchEndY = 0;
  newMonthList.addEventListener(
    "touchstart",
    (event) => {
      touchStartY = event.touches[0].clientY;
      clearTimeout(scrollTimeout);
    },
    { passive: true }
  );

  newMonthList.addEventListener(
    "touchmove",
    (event) => {
      touchEndY = event.touches[0].clientY;
    },
    { passive: true }
  );

  newMonthList.addEventListener(
    "touchend",
    () => {
      const touchDelta = touchStartY - touchEndY;
      if (Math.abs(touchDelta) > 20) {
        const direction = touchDelta > 0 ? 1 : -1;
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < monthItems.length) {
          updateSelectedMonth(newIndex);
          scrollToMonth(newIndex);
        }
      } else {
        scrollToMonth(currentIndex);
      }
    },
    { passive: true }
  );

  monthItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      updateSelectedMonth(index);
      scrollToMonth(index);
    });
  });

  // **This line ensures the default selected month gets the "selected" class**
  updateSelectedMonth(currentIndex);

  updateFontSizes();
  setTimeout(() => scrollToMonth(currentIndex), 100);

  newMonthList.addEventListener("scroll", () => {
    if (isScrolling) return;
    if (Math.abs(newMonthList.scrollTop - lastScrollPosition) > 10) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const containerRect = document
          .querySelector(".month-list-container")
          .getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;
        let closestIndex = 0,
          closestDistance = Infinity;
        monthItems.forEach((item, index) => {
          const itemRect = item.getBoundingClientRect();
          const itemCenter = itemRect.top + itemRect.height / 2;
          const distance = Math.abs(itemCenter - containerCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        updateSelectedMonth(closestIndex);
        scrollToMonth(closestIndex);
      }, 100);
      lastScrollPosition = newMonthList.scrollTop;
    }
  });
}
