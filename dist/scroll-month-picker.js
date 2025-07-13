"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dpInitScrollMonthPicker = dpInitScrollMonthPicker;
function dpInitScrollMonthPicker(selector) {
  var _window$datePickers;
  var datePicker = (_window$datePickers = window.datePickers) === null || _window$datePickers === void 0 ? void 0 : _window$datePickers.get(selector);
  var currentIndex = datePicker.getCurrentMonthIndex();
  var dp = document.querySelector("#".concat(selector));
  var monthList = dp.querySelector(".month-list");
  if (!monthList) return;
  var newMonthList = monthList.cloneNode(false);
  monthList.parentNode.replaceChild(newMonthList, monthList);
  monthList.innerHTML = "";
  var monthItems = Array.from(dp.querySelectorAll(".month-item"));
  var colors = ["#000", "#5A5A5A", "#858585", "#B6B6B6", "#D4D4D4"];
  var isScrolling = false;
  var lastScrollPosition = 0;
  var scrollTimeout;
  console.log(datePicker.getMonths());
  datePicker.getMonths().forEach(function (month) {
    var el = document.createElement("div");
    el.classList.add("month-item");
    el.textContent = month;
    newMonthList.appendChild(el);
  });
  monthItems = Array.from(newMonthList.querySelectorAll(".month-item"));
  function updateFontSizes() {
    monthItems.forEach(function (item, index) {
      var distance = Math.abs(index - currentIndex);
      var fontSize = Math.max(6, 14 - distance * 2);
      item.style.fontSize = fontSize + "px";
      item.style.color = colors[Math.min(distance, colors.length - 1)];
    });
  }
  function updateSelectedMonth(index) {
    var _document$querySelect;
    index = Math.max(0, Math.min(index, monthItems.length - 1));
    (_document$querySelect = document.querySelector(".month-item.selected")) === null || _document$querySelect === void 0 || _document$querySelect.classList.remove("selected");
    monthItems[index].classList.add("selected");
    currentIndex = index;
    updateFontSizes();
    datePicker.updateCalendarMonth(index);
  }
  function scrollToMonth(index) {
    var item = monthItems[index];
    var scrollPosition = item.offsetTop - newMonthList.clientHeight / 2 + item.offsetHeight / 2;
    isScrolling = true;
    newMonthList.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    });
    setTimeout(function () {
      isScrolling = false;
      lastScrollPosition = newMonthList.scrollTop;
    }, 300);
  }
  newMonthList.addEventListener("wheel", function (event) {
    event.preventDefault();
    if (isScrolling) return;
    var stepSize = Math.min(2, Math.max(1, Math.abs(event.deltaY / 110)));
    var direction = event.deltaY > 0 ? stepSize : -stepSize;
    var newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < monthItems.length) {
      updateSelectedMonth(Math.round(newIndex));
      scrollToMonth(Math.round(newIndex));
    }
  }, {
    passive: false
  });
  var touchStartY = 0,
    touchEndY = 0;
  newMonthList.addEventListener("touchstart", function (event) {
    touchStartY = event.touches[0].clientY;
    clearTimeout(scrollTimeout);
  }, {
    passive: true
  });
  newMonthList.addEventListener("touchmove", function (event) {
    touchEndY = event.touches[0].clientY;
  }, {
    passive: true
  });
  newMonthList.addEventListener("touchend", function () {
    var touchDelta = touchStartY - touchEndY;
    if (Math.abs(touchDelta) > 20) {
      var direction = touchDelta > 0 ? 1 : -1;
      var newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < monthItems.length) {
        updateSelectedMonth(newIndex);
        scrollToMonth(newIndex);
      }
    } else {
      scrollToMonth(currentIndex);
    }
  }, {
    passive: true
  });
  monthItems.forEach(function (item, index) {
    item.addEventListener("click", function () {
      updateSelectedMonth(index);
      scrollToMonth(index);
    });
  });

  // **This line ensures the default selected month gets the "selected" class**
  updateSelectedMonth(currentIndex);
  updateFontSizes();
  setTimeout(function () {
    return scrollToMonth(currentIndex);
  }, 100);
  newMonthList.addEventListener("scroll", function () {
    if (isScrolling) return;
    if (Math.abs(newMonthList.scrollTop - lastScrollPosition) > 10) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var containerRect = dp.querySelector(".month-list-container").getBoundingClientRect();
        var containerCenter = containerRect.top + containerRect.height / 2;
        var closestIndex = 0,
          closestDistance = Infinity;
        monthItems.forEach(function (item, index) {
          var itemRect = item.getBoundingClientRect();
          var itemCenter = itemRect.top + itemRect.height / 2;
          var distance = Math.abs(itemCenter - containerCenter);
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