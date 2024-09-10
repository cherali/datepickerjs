import {
  RangePicker,
  createDate,
  formatDate,
  Days,
  PickerLocale,
} from "drm-datepickerjs";

const locale: PickerLocale = year => ({
  months: {
    1: { name: "January", numberOfDays: 31 },
    2: { name: "February", numberOfDays: year % 4 === 0 ? 29 : 28 },
    3: { name: "March", numberOfDays: 31 },
    4: { name: "April", numberOfDays: 30 },
    5: { name: "May", numberOfDays: 31 },
    6: { name: "June", numberOfDays: 30 },
    7: { name: "July", numberOfDays: 31 },
    8: { name: "August", numberOfDays: 31 },
    9: { name: "September", numberOfDays: 30 },
    10: { name: "October", numberOfDays: 31 },
    11: { name: "November", numberOfDays: 30 },
    12: { name: "December", numberOfDays: 31 },
  },
});

const weeksTitle = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const datepickerHeight = 300;

const date = formatDate(createDate()); // convert date to iso format YYYY-MM-DD

function interpolate(
  template: string | undefined,
  values: Record<string, string>,
) {
  if (template == undefined) return "";

  return template.replace(
    /_(.*?)_/g,
    (match, key) => values[key.trim()] ?? match,
  );
}

function picker() {
  const {
    onChangeDate,
    setOpen,
    setMode,
    getDate,
    isSelectedDay,
    changeDay,
    getRenderedMonthName,
    getRenderedYear,
    handleShowNextMonth,
    handleShowPrevMonth,
    getMonthList,
    changeMonth,
    getYearsList,
    changeYear,
    getRenderedMonth,
    goToToday,
    getDays,
    getRenderedNextMonthName,
    getRenderedNextDateYear,
    onCellHover,
    getEndDate,
    isDateInRange,
    isSelecting,
    isEndDate,
    getDayMonthOffset,
    getMode,
    isOpen,
    isLoading,
  } = new RangePicker({
    date: date,
    locale: locale,
    dayRenderType: "fill",
    twoSide: true,
  });

  const renderTitle = ({ year, month }) => {
    const titleTemplate = document.getElementById("title");

    return interpolate(titleTemplate?.innerHTML, { month, year });
  };

  const getRangePickerBackgroundColor = (
    day,
    currentColor,
    selectColor,
    hoveredColor,
    otherColor,
  ) => {
    if (
      isSelecting() &&
      isDateInRange(day.date) &&
      isEndDate(day.date) &&
      day.state == "current"
    )
      return "#23cdcd";
    else if (isSelecting() && isDateInRange(day.date) && day.state == "current")
      return "#deffff";
    else if (day.state !== "current") return otherColor;
    else if (isSelectedDay(day.date)) return selectColor;
    else if (!isSelecting() && isDateInRange(day.date)) return hoveredColor;
    else return currentColor;
  };

  const getRangePickerColor = (
    day,
    currentColor,
    selectColor,
    hoveredColor,
    otherColor,
  ) => {
    if (isSelectedDay(day.date) && day.state === "current") return selectColor;
    else if (
      !isSelecting() &&
      isDateInRange(day.date) &&
      day.state === "current"
    )
      return hoveredColor;
    else if (day.state === "current") return currentColor;
    else return otherColor;
  };

  const dayStyle = day => `
    background-color: ${getRangePickerBackgroundColor(day, "#cacaca", "#2cf2f2", "#b7fafa", "#d8d8d8")};
    color: ${getRangePickerColor(day, "#000", "#099090", "#066060", "#888")};
    width: 100%;
    border: none;
    padding: 5px 0;
  `;

  const getWeeksHTML = () => {
    const weekWrapper = document.createElement("div");
    weekWrapper.style.display = "flex";
    weekWrapper.style.flexWrap = "wrap";
    weekWrapper.style.padding = "7px 0 5px";

    const weekTemplate = document.getElementById("week-item");

    weeksTitle.forEach(week => {
      weekWrapper.insertAdjacentHTML(
        "beforeend",
        interpolate(weekTemplate?.innerHTML, {
          week,
        }),
      );
    });

    return weekWrapper.outerHTML;
  };

  const getDaysHTML = (daysList: Days[]) => {
    const dayWrapper = document.createElement("div");
    const dayTemplate = document.getElementById("day-item");

    daysList.forEach(day => {
      dayWrapper.insertAdjacentHTML(
        "beforeend",
        interpolate(dayTemplate?.innerHTML, {
          date: day.date,
          day: day.day.toString(),
          state: day.state,
          style: `style="${dayStyle(day)}"`,
        }),
      );
    });

    return dayWrapper.innerHTML;
  };

  const getDayMonthOffsetHTML = (offset: 0 | 1) => {
    const offsetWrapper = document.createElement("div");

    const offsetItem = document.createElement("div");
    offsetItem.style.width = `${100 / 7}%`;

    Array(getDayMonthOffset(offset))
      .fill("")
      .forEach(() => {
        offsetWrapper.insertAdjacentHTML("beforeend", offsetItem.outerHTML);
      });

    return offsetWrapper.innerHTML;
  };

  const getYearListHTML = () => {
    const wrapper = document.createElement("div");

    getYearsList(1950, 2050).forEach(year => {
      const div = document.createElement("div");

      div.style.padding = "1px 0";
      div.style.textAlign = "center";
      div.style.width = "19%";
      div.style.backgroundColor =
        getRenderedYear() === year ? " #cacaca" : "#fafafa";

      const button = document.createElement("button");
      button.style.backgroundColor = "transparent";
      button.style.border = "none";
      button.dataset.value = year.toString();
      button.classList.add("--year");
      button.innerText = year.toString();

      div.innerHTML = button.outerHTML;

      wrapper.insertAdjacentHTML("beforeend", div.outerHTML);
    });

    return wrapper.innerHTML;
  };

  const getMonthListHTML = () => {
    const wrapper = document.createElement("div");

    const button = document.createElement("button");
    button.style.backgroundColor = "transparent";
    button.style.border = "none";
    button.style.margin = "0";
    button.style.padding = "0";
    button.style.width = "100%";
    button.classList.add("change-month");

    getMonthList().forEach(month => {
      const container = document.createElement("div");

      container.style.padding = "1px 5px";
      container.style.backgroundColor =
        getRenderedMonth() === month.monthNumber ? "#cacaca" : "#fff";

      button.dataset.value = month.monthNumber.toString();
      button.innerHTML = `<p>${month.name}</p>`;
      container.innerHTML = button.outerHTML;

      wrapper.appendChild(container);
    });

    return wrapper.outerHTML;
  };

  const createMarkup = () => {
    const daysList = getDays();
    const daysListNext = getDays("next");

    const dayListTemplate = document.getElementById("day-list");
    const monthListTemplate = document.getElementById("month-list");
    const yearListTemplate = document.getElementById("year-list");

    const dayDisplay = getMode() === "day" && !isLoading() ? "black" : "none";
    const dayWeekHTML = getWeeksHTML();

    const renderDay = interpolate(dayListTemplate?.innerHTML, {
      display: dayDisplay,
      title: renderTitle({
        month: getRenderedMonthName(),
        year: getRenderedYear(),
      }),
      weeksTitle: dayWeekHTML,
      dayList: getDaysHTML(daysList),
      dayOffset: getDayMonthOffsetHTML(0),
      prevBtn: `<button id="prev-btn">prev</button>`,
      nextBtn: "",
    });

    const renderDayNextMonth = interpolate(dayListTemplate?.innerHTML, {
      display: dayDisplay,
      title: renderTitle({
        month: getRenderedNextMonthName(),
        year: getRenderedNextDateYear(),
      }),
      weeksTitle: dayWeekHTML,
      dayList: getDaysHTML(daysListNext),
      dayOffset: getDayMonthOffsetHTML(1),
      prevBtn: "",
      nextBtn: `<button id="next-btn">next</button>`,
    });

    const renderMonth = interpolate(monthListTemplate?.innerHTML, {
      display: getMode() === "month" ? "block" : "none",
      title: renderTitle({
        month: getRenderedMonthName(),
        year: getRenderedYear(),
      }),
      pickerHeight: datepickerHeight + "px",
      monthList: getMonthListHTML(),
    });

    const renderYear = interpolate(yearListTemplate?.innerHTML, {
      display: getMode() === "year" ? "block" : "none",
      title: renderTitle({
        month: getRenderedMonthName(),
        year: getRenderedYear(),
      }),
      pickerHeight: datepickerHeight + "px",
      yearList: getYearListHTML(),
    });

    const container = document.createElement("div");
    container.style.width = "auto";
    container.id = "container";
    container.style.display = "inline-block";

    const goToTodayBtn = document.createElement("button");
    goToTodayBtn.id = "go-to-today";
    goToTodayBtn.innerText = "go to today";

    const content = document.createElement("div");
    content.style.width = "600px";

    const input = document.createElement("input");
    input.classList.add("date-picker-input");
    input.type = "text";
    input.setAttribute("value", getDate());

    const endInput = document.createElement("input");
    endInput.classList.add("date-picker-input");
    endInput.type = "text";
    endInput.setAttribute("value", getEndDate());

    const body = document.createElement("div");
    body.style.width = "600px";
    body.style.gap = "16px";
    body.style.flexDirection = "row";
    body.style.display = isOpen() ? "flex" : "none";

    body.insertAdjacentHTML("beforeend", renderYear);
    body.insertAdjacentHTML("beforeend", renderMonth);
    body.insertAdjacentHTML("beforeend", renderDay);
    body.insertAdjacentHTML("beforeend", renderDayNextMonth);

    content.insertAdjacentHTML("beforeend", input.outerHTML);
    content.insertAdjacentHTML("beforeend", endInput.outerHTML);
    content.insertAdjacentHTML("beforeend", body.outerHTML);

    container.insertAdjacentHTML("beforeend", goToTodayBtn.outerHTML);
    container.insertAdjacentHTML("beforeend", content.outerHTML);

    return container.outerHTML;
  };

  const updateDom = () => {
    document.getElementById("app")!.innerHTML = createMarkup();
  };

  updateDom();

  const changeOpenState = state => () => {
    setOpen(state);
    updateDom();
  };

  const setPickerMode = mode => () => {
    setMode(mode);
    updateDom();
  };

  const handleNextMonth = () => {
    handleShowNextMonth();
    updateDom();
  };

  const handlePrevMonth = () => {
    handleShowPrevMonth();
    updateDom();
  };

  const onDayClicked = (date, state) => () => {
    changeDay(date, state);
    updateDom();
  };

  const handleSetMonth = month => () => {
    changeMonth(Number(month));

    updateDom();
  };

  const handleChangeYear = year => () => {
    changeYear(year);

    updateDom();
  };

  const handleHoverCell = date => () => {
    onCellHover(date);
  };

  const addListeners = () => {
    const mode = getMode();

    document
      .querySelectorAll(".set-year-mode")
      .forEach(qs => qs.addEventListener("click", setPickerMode("year")));
    document
      .querySelectorAll(".set-month-mode")
      .forEach(qs => qs.addEventListener("click", setPickerMode("month")));
    document
      .querySelectorAll(".date-picker-input")
      .forEach(qs => qs.addEventListener("focus", changeOpenState(true)));
    document
      .getElementById("go-to-today")!
      .addEventListener("click", goToToday);

    document
      .getElementById("prev-btn")!
      .addEventListener("click", handlePrevMonth);
    document
      .getElementById("next-btn")!
      .addEventListener("click", handleNextMonth);

    document
      .querySelectorAll(".--back")
      .forEach(qs => qs.addEventListener("click", setPickerMode("day")));

    if (mode == "month") {
      document.querySelectorAll(".change-month").forEach(qs => {
        qs.addEventListener(
          "click",
          handleSetMonth(qs.attributes["data-value"].value),
        );
      });
    }

    if (mode == "day") {
      document.querySelectorAll(".--days").forEach(qs => {
        qs.addEventListener(
          "mouseover",
          handleHoverCell(qs.attributes["data-value"].value),
        );
        qs.addEventListener(
          "click",
          onDayClicked(
            qs.attributes["data-value"].value,
            qs.attributes["data-value-state"].value,
          ),
        );
      });
    }

    if (mode == "year") {
      document.querySelectorAll(".--year").forEach(qs => {
        qs.addEventListener(
          "click",
          handleChangeYear(qs.attributes["data-value"].value),
        );
      });
    }
  };

  onChangeDate(() => {
    updateDom();
    setTimeout(() => {
      addListeners();
    });
  });

  setTimeout(() => {
    addListeners();
  });

  // close date picker by clicking outside
  const handleClickOutside = event => {
    const container = document.getElementById("container");
    if (container && !container.contains(event.target)) {
      changeOpenState(false)();
    }
  };

  document.addEventListener("click", handleClickOutside, true);
}

document.addEventListener("DOMContentLoaded", function () {
  picker();
});
