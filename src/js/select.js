function handleContainerClick(e) {
  e.stopPropagation();

  this.classList.toggle("open");

  // Dynamically find the latest select-value and select-items within this this
  const updatedSelectedItemDiv = this.querySelector(".select-value");
  const optionsList = this.querySelector(".select-items");

  if (updatedSelectedItemDiv && optionsList) {
    optionsList.classList.toggle("select-hide");
    updatedSelectedItemDiv.classList.toggle("select-arrow-active");
  } else {
    console.error("Select elements not found in", container);
  }
}
export function initCustomSelect() {
  /* Remove any existing custom selects to prevent duplicates */
  document
    .querySelectorAll(".select-value, .select-items")
    .forEach((el) => el.remove());
  document
    .querySelectorAll(".select-container")
    .forEach((el) => el.classList.remove("open"));

  const customSelectElements =
    document.getElementsByClassName("select-container");

  for (let i = 0; i < customSelectElements.length; i++) {
    let container = customSelectElements[i];
    const innerSelect = container.querySelector(".custom-select");
    const selectElement = container.getElementsByTagName("select")[0];
    const optionCount = selectElement.length;

    /* Reset select box to default */
    selectElement.selectedIndex = 0;

    /* Create a new DIV that will act as the selected item */
    const selectedItemDiv = document.createElement("DIV");
    selectedItemDiv.classList.add("select-value");
    selectedItemDiv.innerHTML = selectElement.options[0]?.innerHTML || "";
    innerSelect.appendChild(selectedItemDiv);

    /* Create a new DIV that will contain the option list */
    const optionsListDiv = document.createElement("DIV");
    optionsListDiv.setAttribute("class", "select-items select-hide");

    for (let j = 0; j < optionCount; j++) {
      /* Create a new DIV that will act as an option item */
      const optionDiv = document.createElement("DIV");
      optionDiv.classList.add("select-option", "flex", "gap-2");
      optionDiv.style.lineHeight = "1";
      optionDiv.innerHTML = `<span>${selectElement.options[j].innerHTML}</span>`;

      // Add SVG placeholders
      let svgUnchecked = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M14.1607 5.20546V5.20683V10.7935C14.1607 11.9074 13.8306 12.7365 13.2804 13.2866C12.7303 13.8367 11.9012 14.1668 10.7873 14.1668H5.20732C4.09343 14.1668 3.26449 13.8367 2.71443 13.286C2.16429 12.7352 1.83398 11.9044 1.83398 10.7868V5.20683C1.83398 4.09293 2.16408 3.26384 2.7142 2.71372C3.26433 2.16359 4.09342 1.8335 5.20732 1.8335H10.794C11.908 1.8335 12.7369 2.16363 13.286 2.71349C13.8351 3.26325 14.1637 4.09188 14.1607 5.20546Z" stroke="black"/>
        </svg>`;
      let svgChecked = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path opacity="0.4" d="M10.794 1.3335H5.20732C2.78065 1.3335 1.33398 2.78016 1.33398 5.20683V10.7868C1.33398 13.2202 2.78065 14.6668 5.20732 14.6668H10.7873C13.214 14.6668 14.6607 13.2202 14.6607 10.7935V5.20683C14.6673 2.78016 13.2207 1.3335 10.794 1.3335Z" fill="black"/>
          <path d="M7.05297 10.3862C6.91964 10.3862 6.79297 10.3329 6.69964 10.2396L4.81297 8.35291C4.61964 8.15958 4.61964 7.83958 4.81297 7.64624C5.0063 7.45291 5.3263 7.45291 5.51964 7.64624L7.05297 9.17958L10.4796 5.75291C10.673 5.55958 10.993 5.55958 11.1863 5.75291C11.3796 5.94624 11.3796 6.26624 11.1863 6.45958L7.4063 10.2396C7.31297 10.3329 7.1863 10.3862 7.05297 10.3862Z" fill="black"/>
        </svg>`;

      let svgIcon = document.createElement("span");
      svgIcon.innerHTML = j ? svgUnchecked : svgChecked;
      svgIcon.style.order = "-1";
      optionDiv.append(svgIcon);

      optionDiv.addEventListener("click", function () {
        selectElement.selectedIndex = j;
        selectedItemDiv.innerHTML = this.innerText;
        document
          .querySelectorAll(".select-option span:last-child")
          .forEach((icon) => (icon.innerHTML = svgUnchecked));
        this.querySelector("span:last-child").innerHTML = svgChecked;

        selectElement.dispatchEvent(new Event("change", { bubbles: true }));
      });

      optionsListDiv.appendChild(optionDiv);
    }
    innerSelect.appendChild(optionsListDiv);

    container.removeEventListener("click", handleContainerClick);

    container.addEventListener("click", handleContainerClick);
  }
}

document.addEventListener("click", function () {
  document
    .querySelectorAll(".select-items")
    .forEach((el) => el.classList.add("select-hide"));
  document
    .querySelectorAll(".select-container")
    .forEach((el) => el.classList.remove("open"));
});

function closeAllSelect(element) {
  var optionsLists,
    selectedItems,
    i,
    optionsListsLength,
    selectedItemsLength,
    selectedIndexesToExclude = [];

  optionsLists = document.getElementsByClassName("select-items");
  selectedItems = document.getElementsByClassName("select-selected");
  optionsListsLength = optionsLists.length;
  selectedItemsLength = selectedItems.length;

  for (i = 0; i < selectedItemsLength; i++) {
    if (element == selectedItems[i]) {
      selectedIndexesToExclude.push(i);
    } else {
      selectedItems[i].classList.remove("select-arrow-active");
    }
  }

  for (i = 0; i < optionsListsLength; i++) {
    if (selectedIndexesToExclude.indexOf(i) === -1) {
      optionsLists[i].classList.add("select-hide");
      optionsLists[
        i
      ].parentElement.parentElement.parentElement.classList.remove("open");
    }
  }
}

document.addEventListener("click", closeAllSelect);
